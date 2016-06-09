import { Move, Merged } from './main.js';

class MergedCLI extends Merged {

  constructor() {
    super(...arguments);
    console.log(`Generated game board of ${this.width} × ${this.height}`);
    console.log(this.toString());
  }

  /**
   * Random number between 3 and 20.
   * A reasonable board size
   */
  static reasonableRandom() {
    return Math.floor(Math.random() * 18) + 3;
  }

  static generateRandomBoard() {
    const width = MergedCLI.reasonableRandom();
    const height = MergedCLI.reasonableRandom();
    return new MergedCLI(width, height);
  }

  /**
   * Display board in play as ASCII art. A transpose function is used to simplify rendering
   */
  toString() {
    const transposedBoard = Object.keys(this.board[0]).map( c => this.board.map( r => r[c] || ' ' ) );
    const horizontals = Array(this.width).fill('─');
    const verticals   = Array(this.height).fill('│');
    const top    = `┌${horizontals.join('┬')}┐`;
    const middle = `├${horizontals.join('┼')}┤`;
    const bottom = `└${horizontals.join('┴')}┘`;
    const rows = transposedBoard.map( row => [null, ...row, null].join('│') );
    const columns = rows.join([null, middle, null].join('\n'));
    return [top, columns, bottom].join('\n')
  }

  calculateNext() {
    console.log(this.toString());
    super.calculateNext(...arguments);
    console.log(this.toString());
  }

}

// Example usage of your class.
var board = new MergedCLI(6, 6);

// Two tile domino placed
board.makeMoves([new Move('1', 0, 0), new Move('1', 1, 0)]);
board.calculateNext();

// Single tile domino placed
board.makeMoves([new Move('1', 2, 0)]);
board.calculateNext();

board.clearBoard();