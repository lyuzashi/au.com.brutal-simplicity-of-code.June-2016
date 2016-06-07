export class Move {
  /**
   * @param {string} tile - Valid values are '1', '2', '3', '4', '5', '6', 'M'
   * @param {number} x - The 0 based row for the move.
   * @param {number} y - The 0 based column for the move.
   */
  constructor(tile, x, y) {
    Object.assign(this, {tile, x, y});
  }

  placeOnGame(game) {
    Object.assign(this, {game});
    this.game.board[this.x][this.y] = this;
    this.game.moves.push(this);
  }

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

  getAdjacent() {
    return [this.getAbove(), this.getBelow(), this.getLeft(), this.getRight()].filter( m => m );
  }

  getAdjacentSame() {
    return this.getAdjacent().filter( m => m.tile === this.tile );
  }

  getChain(chain = new Set){
    const adjacent = this.getAdjacentSame();
    adjacent.forEach( sibling => {
      chain.add(sibling)
      if( !chain.has(sibling) ) sibling.getChain(chain);
      chain.add()
    });
    
    return chain;
  }

  toString() {
    return this.tile;
  }

}

export class Merged {
  /**
   * Do whatever you need to do here to prep.
   */
  constructor(width, height) {
    Object.assign(this, {width, height});
    this.clearBoard();
  }

  /**
   * This function will be used by my tests to reset the board.
   */
  clearBoard() {
    this.board = Array(this.width).fill().map( row => Array(this.height).fill() );
    this.moves = [];
  }

  /**
   * Make a move
   * @param {Move[]} move - One or two tiles that will be played in this move.
   */
  makeMove(move) {
    if(this.board[move.x][move.y]) throw new Error('Selected position is taken on the board');
    move.placeOnGame(this);
    return move;
  }

  /**
   * Calculate the next step of the game (meaning all possible combinations
   * chained and applied, not just one of them), then apply it to the board
   * and return it as a convenience for my tests to know what just happened.
   * @return {number[][]}
   */
  calculateNext() {
    return this.board;
  }

}


// Example usage of your class.
// var board = new Merged(6, 6);
//
// Two tile domino placed
// board.makeMove(new Move('1', 0, 0));
// board.makeMove(new Move('1', 1, 0));
// board.calculateNext();
//
// Single tile domino placed
// board.makeMove(new Move('1', 2, 0));
// board.calculateNext();
//
// board.clearBoard();
