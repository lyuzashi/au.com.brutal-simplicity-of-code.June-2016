/**
 * Nothing special here, just keeping it tidy with game-specific classes that could be extended
 * with extra features later on.
 * The cool thing here is the ES6 built-in Set object. Similar to an array, but only allows unique
 * values to be added. Also includes handy bool has() and delete() methods.
 *
 * Collects moves, ideally adjacent and of the same tile.
 */
class Chain extends Set {

  /**
   * Looks like a Set (species), quacks like a Set (inherits all methods), but it's a Chain!
   * The "well-known" Symbol species indicates the constructor this class will masquarade.
   */
  static get [Symbol.species]() { return Set }

  get length() {
    return this.size;
  }

}

/**
 * Another Set, this time as a holding-ground for moves before calculateNext is called.
 * Each move should be chained from here in order of lowest tiles to highest. They can then be 
 * deleted. Moves that are created by merges also pass through here – thus unlimited chain
 * reactions can be performed.
 *
 * The key reason for doing this is to avoid evaulating chains of matching Pieces across all that 
 * are on the board, or worse still, assessing every space on the board.
 */
class Moves extends Set {

  static get [Symbol.species]() { return Set }

  /**
   * Override Set's forEach with a call to forEach on an array cast version of this set, sorted.
   * Since a Move provides the primative string of it's tile, sort will order these correctly.
   * Reverse is used to start backwards from the last move made if two of the same tile are in.
   */
  forEach(){
    let array = [...this].reverse().sort();
    return array.forEach.apply(array, arguments);
  }

}

/**
 * Simply a formal data structure for gameplay input. Exported for you instantiating!
 */
export class Move {
  /**
   * @param {string} tile - Valid values are '1', '2', '3', '4', '5', '6', 'M'
   * @param {number} x - The 0 based row for the move.
   * @param {number} y - The 0 based column for the move.
   */
  constructor(tile, x, y) {
    // Destructuring FTW!
    Object.assign(this, { tile, x, y });
  }
}

/**
 * Every piece on the board has some brains to assess and manipulate itself and its peers.
 * Based on the Move data structure, but with Merged board specific methods.
 * Here is where the magic happens!
 */
class Piece extends Move {

  // Yay class properties! Wouldn't mind extending the primative tiles array to aid in upgrade()
  static minimumMerge = 3;
  static tiles = ['1', '2', '3', '4', '5', '6', 'M'];

  /**
   * @param {string|Move} tile - construct from Move or with Move-like parameters
   * @param {number} x
   * @param {number} y
   */
  constructor(tile, x, y) {
    super(...arguments)
    if( arguments[0] instanceof Move ) {
      Object.assign(this, {tile, x, y} = arguments[0]);
    }
    // Probably slows it down, but a little validation doesn't go astray
    if( Piece.tiles.indexOf( this.tile ) === -1 ) throw new Error('Invalid tile');
  }

  /**
   * Place this piece on the supplied Merge game board.
   * @param {Merged} game
   */
  placeOnGame(game) {
    if(game) Object.assign(this, {game});
    // Someone's got to check this...
    if(this.game.board[this.x][this.y]) throw new Error('Selected position is taken on the board');
    this.game.board[this.x][this.y] = this;
    // New moves get passed through the Moves set so chains can be found on relevant pieces rather
    // than searching the entire board.
    this.game.moves.add(this);
  }

  /**
   * Once a Piece has had its soul sucked out by a merged, its lifeless body should be discarded.
   * The space on the board gets wiped clean and the move erased from history.
   */
  removeFromGame() {
    this.game.board[this.x][this.y] = undefined;
    this.game.moves.delete(this);
  }

  /**
   * BOOM! Nothing left to merge, go out with a bang and remove surrounding Pieces.
   */
  explode() {
    this.getSurrounding().forEach( piece => piece.removeFromGame() );
    this.removeFromGame();
  }

  /**
   * Take the tile up a level. At the highest? Explode!
   */
  upgrade(){
    this.tile = Piece.tiles[Piece.tiles.indexOf(this.tile) + 1];
    if(!this.tile) this.explode();
  }

  // These functions grab surrounding tiles to check for chains

  getAbove() {
    if(this.y > 0) return this.game.board[this.x][this.y - 1];
  }

  getBelow() {
    if(this.y < this.game.height - 1) return this.game.board[this.x][this.y + 1];
  }

  getLeft() {
    if(this.x > 0) return this.game.board[this.x - 1][this.y];
  }

  getRight() {
    if(this.x < this.game.width - 1) return this.game.board[this.x + 1][this.y];
  }

  // Diagonals for explosion

  getAboveLeft() {
    if(this.y > 0 && this.x > 0) return this.game.board[this.x - 1][this.y - 1];
  }

  getAboveRight() {
    if(this.y > 0 && this.x < this.game.width - 1) return this.game.board[this.x + 1][this.y - 1];
  }

  getBelowLeft() {
    if(this.x > 0 && this.y < this.game.height - 1) return this.game.board[this.x - 1][this.y + 1];
  }

  getBelowRight() {
    if(this.x < this.game.width - 1 && this.y < this.game.height - 1) 
      return this.game.board[this.x + 1][this.y + 1];
  }

  /**
   * Lump all neighbours together, ignoring empty spaces.
   */
  getAdjacent() {
    return [this.getAbove(), this.getBelow(), this.getLeft(), this.getRight()].filter( m => m );
  }

  /**
   * All eight surrounding spaces.
   */
  getSurrounding() {
    return [...this.getAdjacent(), this.getAboveLeft(), this.getAboveRight(), this.getBelowLeft(),
      this.getBelowRight()].filter( m => m );
  }

  /**
   * Filter out adjacent Pieces that don't have the same tile
   */
  getAdjacentSame() {
    return this.getAdjacent().filter( m => m.tile === this.tile );
  }

  /**
   * Deceptively simplistic! Returns a Chain of neighbouring pieces of the same tile.
   * Takes advantage of Set to ignore duplicates and avoid double-checking.
   * Uses recursion to collect neighbours-of-neighbours... Chains to the edges of space itself!
   */
  getChain(chain = new Chain){
    const adjacent = this.getAdjacentSame();
    chain.add(this);
    adjacent.forEach( sibling => {
      if( !chain.has(sibling) ) sibling.getChain(chain);
    });
    return chain;
  }

  /**
   * Another deceptively simple method. Performs a merge to this piece if applicable.
   * Using the chains of pieces found above, the siblings get removed and the current piece gets an
   * upgrade before being replaced on the board.
   * 
   * Since placing a piece on the board adds it to the Moves Set, merge can be continually called
   * until the Set is empty – thus performing domino effect merges.
   */
  merge() {
    const chain = this.getChain();
    if(chain.size >= Piece.minimumMerge) {
      chain.forEach( piece => piece.removeFromGame() );
      this.upgrade();
      if(this.tile) this.placeOnGame();
    }
  }

  /**
   * Go on, console.log a Piece. What more did you want to see?
   */
  toString() {
    return this.tile;
  }

}

export class Merged {

  // Each game has a Set of Moves
  moves = new Moves;

  /**
   * Do whatever you need to do here to prep.
   */
  constructor(width, height) {
    Object.assign(this, {width, height});
    this.clearBoard();
  }

  /**
   * This function will be used by my tests to reset the board.
   * And also to construct the board first time! Arrays for dayz. Fill will pad them out with 
   * undefined, so there's a nice expanse of empty space to play!
   */
  clearBoard() {
    this.board = Array(this.width).fill().map( row => Array(this.height).fill() );
  }

  /**
   * Make a move
   * @param {Move[]} move - One or two tiles and positions that are being played.
   */
  makeMoves(moves) {
    // There are many ways to loop through arrays, handle a single move or many in any form,
    // however the quickest way to retrieve a set number of items is to access them directly.
    //
    // I'd love to use this flatten pattern, however it's not overly efficient
    // [...arguments].reduce((m, a) => m.concat(a), []).forEach( move => move.placeOnGame(this) );

    // Moves are turned into pieces, which can be placed on the game board.
    new Piece(moves[0]).placeOnGame(this);
    if(moves.length > 1) new Piece(moves[1]).placeOnGame(this);
  }

  /**
   * Calculate the next step of the game (meaning all possible combinations
   * chained and applied, not just one of them), then apply it to the board
   * and return it as a convenience for my tests to know what just happened.
   *
   * Just keep merging each Move that hasn't been cleared from the Moves set. This will trigger
   * domino effects of merges, starting from the lowest-value piece last placed, stacking up new
   * Pieces to check neighbours for Chains.
   *
   * @return {number[][]}
   */
  calculateNext() {
    do {
      this.moves.forEach( move => {
        this.moves.delete( move );
        move.merge();
      });
    } while ( this.moves.size > 0 );
    return this.board;
  }

}
