class Move {
  /**
   * @param {string} tile - Valid values are '1', '2', '3', '4', '5', '6', 'M'
   * @param {number} x - The 0 based row for the move.
   * @param {number} y - The 0 based column for the move.
   */
  function constructor(tile, x, y) {
    this.tile = tile;
    this.x = x;
    this.y = y;
  }
}

class Merged {
  /**
   * Do whatever you need to do here to prep.
   */
  function constructor(width, height) {

  }

  /**
   * This function will be used by my tests to reset the board.
   */
  function clearBoard() {

  }

  /**
   * Make a move
   * @param {Move[]} move - One or two tiles that will be played in this move.
   */
  function makeMove(move) {

  }

  /**
   * Calculate the next step of the game (meaning all possible combinations
   * chained and applied, not just one of them), then apply it to the board
   * and return it as a convenience for my tests to know what just happened.
   * @return {number[][]}
   */
  function calculateNext() {

  }
}

// Example usage of your class.
// var board = new Merged(6, 6);
//
// board.makeMove(new Move('1', 0, 0));
// board.calculateNext();
//
// board.makeMove(new Move('1', 1, 0));
// board.calculateNext();
//
// board.makeMove(new Move('1', 2, 0));
// board.calculateNext();
//
// board.clearBoard();
