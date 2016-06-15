import { expect } from 'chai';
import 'babel-polyfill';

const M = 'M';
const _ = undefined;

class EndGame {

  constructor(...rows) {
    this.board = Object.keys(rows[0]).map( c => rows.map( r => r[c] ) );
  }

  toString() {
    return this.board.toString();
  }

}

describe(`Given the Merged library`, () => {

  let Merged, Move;

  beforeEach(() => {
    Merged = require(`../main.js`).Merged;
    Move = require(`../main.js`).Move;
  });

  describe(`when a new instance of Merged is created`, () => {
    let board;
    beforeEach(() => {
      board = new Merged(0, 0);
    });
    it(`then it should respond to a calculateNext method`, () => {
      expect(board).respondTo(`calculateNext`);
    });
    it(`then it should respond to a makeMoves method`, () => {
      expect(board).respondTo(`makeMoves`);
    });
    it(`then it should respond to a clearBoard method`, () => {
      expect(board).respondTo(`clearBoard`);
    });
  });

  describe(`when calculateNext is called`, () => {
    const width = 5, height = 7;
    let board, gameBoard;
    beforeEach(() => {
      board = new Merged(width, height);
      gameBoard = board.calculateNext();
    });
    it(`it should return a 2 dimensional board array`, () => {
      expect(gameBoard).to.be.instanceOf(Array);
      expect(gameBoard).to.all.be.instanceOf(Array);
    });
    it(`and it should be as wide as specified`, () => {
      expect(gameBoard).to.have.lengthOf(width);
    });
    it(`and it should be as high as specified`, () => {
      expect(gameBoard).to.all.have.lengthOf(height);
    });
  });

  describe(`when a new instance of Move is created`, () => {
    const tile = '1', x = 0, y = 0;
    let move;
    beforeEach(() => {
      move = new Move(tile, x, y);
    });
    it(`then it should have an appropriate tile property`, () => {
      expect(move).to.have.property('tile', tile);
    });
    it(`then it should have an appropriate x property`, () => {
      expect(move).to.have.property('x', x);
    });
    it(`then it should have an appropriate y property`, () => {
      expect(move).to.have.property('y', y);
    });
  });

  describe(`when a move is made on the board`, () => {
    const tile = '1', x = 2, y = 2;
    const width = 5, height = 5;
    let move, board, gameBoard;
    beforeEach(() => {
      board = new Merged(width, height);
      move = new Move(tile, x, y);
      board.makeMoves([move]);
      gameBoard = board.calculateNext();
    });
    it(`then the tile should be in the correct place on the board`, () => {
      expect(`${gameBoard[x][y]}`).to.equal(tile);
    });
  });

  describe(`when three moves of the same tile are made in a row`, () => {
    const width = 5, height = 5;
    let board, gameBoard;
    beforeEach(() => {
      board = new Merged(width, height);
      board.makeMoves([new Move(`1`, 0, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 1, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 2, 0)]);
      gameBoard = board.calculateNext();
    });
    it(`then the tiles should merge where the last block was placed`, () => {
      expect(`${gameBoard}`).to.equal(`${new EndGame(
        [_,_,2,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
  });

  describe(`when three moves of the same tile are made in a column`, () => {
    const width = 5, height = 5;
    let board, gameBoard;
    beforeEach(() => {
      board = new Merged(width, height);
      board.makeMoves([new Move(`1`, 0, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 0, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 0, 2)]);
      gameBoard = board.calculateNext();
    });
    it(`then the tiles should merge where the last block was placed`, () => {
      expect(`${gameBoard}`).to.equal(`${new EndGame(
        [_,_,_,_,_],
        [_,_,_,_,_],
        [2,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
  });

  describe(`when three moves of the same tile are made adjacent`, () => {
    const width = 5, height = 5;
    let board;
    beforeEach(() => {
      board = new Merged(width, height);
    });
    it(`then the tiles should merge where the last block was placed on the left`, () => {
      board.makeMoves([new Move(`1`, 0, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 0, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 1, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,2,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then the tiles should merge where the last block was placed above`, () => {
      board.makeMoves([new Move(`1`, 0, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 1, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 1, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,2,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
  });

  describe(`when a move is made that completes a row of more than three tiles`, () => {
    const width = 5, height = 5;
    let board;
    beforeEach(() => {
      board = new Merged(width, height);
      board.makeMoves([new Move(`1`, 1, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 2, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 4, 0)]);
    });
    it(`then the tiles should not merge until there is three or more`, () => {
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,1,1,_,1],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then when the same tile completes a row the tiles should merge there`, () => {
      board.makeMoves([new Move(`1`, 3, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,_,2,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then when a different tile completes a row the tiles should not merge`, () => {
      board.makeMoves([new Move(`2`, 3, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,1,1,2,1],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then when the row completes diagonally the tiles should not merge`, () => {
      board.makeMoves([new Move(`1`, 3, 1)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,1,1,_,1],
        [_,_,_,1,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then when the row partially completes to form three the tiles should merge there`, () => {
      board.makeMoves([new Move(`1`, 0, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [2,_,_,_,1],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then the tiles should merge in multiple directions`, () => {
      board.makeMoves([new Move(`1`, 3, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 3, 2)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 3, 0)]);
      board.calculateNext();
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,_,2,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then merges should cause chain reactions`, () => {
      board.makeMoves([new Move(`2`, 3, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`2`, 3, 2)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 3, 0)]);
      board.calculateNext();
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,_,3,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
  });

  describe(`when a move is made that completes a column of more than three tiles`, () => {
    const width = 5, height = 5;
    let board;
    beforeEach(() => {
      board = new Merged(width, height);
      board.makeMoves([new Move(`1`, 0, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 0, 2)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 0, 4)]);
    });
    it(`then the tiles should not merge until there is three or more`, () => {
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,_,_,_],
        [1,_,_,_,_],
        [1,_,_,_,_],
        [_,_,_,_,_],
        [1,_,_,_,_])}`);
    });
    it(`then when the same tile completes a column the tiles should merge there`, () => {
      board.makeMoves([new Move(`1`, 0, 3)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [2,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then when a different tile completes a row the tiles should not merge`, () => {
      board.makeMoves([new Move(`2`, 0, 3)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,_,_,_],
        [1,_,_,_,_],
        [1,_,_,_,_],
        [2,_,_,_,_],
        [1,_,_,_,_])}`);
    });
    it(`then when the column completes diagonally the tiles should not merge`, () => {
      board.makeMoves([new Move(`1`, 1, 3)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,_,_,_],
        [1,_,_,_,_],
        [1,_,_,_,_],
        [_,1,_,_,_],
        [1,_,_,_,_])}`);
    });
    it(`then when the column partially completes to form three those tiles should merge`, () => {
      board.makeMoves([new Move(`1`, 0, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [2,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [1,_,_,_,_])}`);
    });
  });

  describe(`when tiles merge`, () => {
    const width = 5, height = 5;
    let board;
    beforeEach(() => {
      board = new Merged(width, height);
    });
    it(`1 should become 2`, () => {
      board.makeMoves([new Move(`1`, 0, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 1, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 2, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,2,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`2 should become 3`, () => {
      board.makeMoves([new Move(`2`, 0, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`2`, 1, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`2`, 2, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,3,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`3 should become 4`, () => {
      board.makeMoves([new Move(`3`, 0, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`3`, 1, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`3`, 2, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,4,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`4 should become 5`, () => {
      board.makeMoves([new Move(`4`, 0, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`4`, 1, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`4`, 2, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,5,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`5 should become 6`, () => {
      board.makeMoves([new Move(`5`, 0, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`5`, 1, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`5`, 2, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,6,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`6 should become M`, () => {
      board.makeMoves([new Move(`6`, 0, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`6`, 1, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`6`, 2, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,M,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
  });

  describe(`when M tiles are merged`, () => {
    const width = 5, height = 5;
    let board;
    beforeEach(() => {
      board = new Merged(width, height);
      board.makeMoves([new Move(`M`, 0, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`M`, 0, 1)]);
      board.calculateNext();
    });
    it(`then the merge should explode leaving blank spaces`, () => {
      board.makeMoves([new Move(`M`, 0, 2)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
  })

  describe(`when tiles form a diagonal matching set`, () => {
    const width = 5, height = 5;
    let board;
    beforeEach(() => {
      board = new Merged(width, height);
      board.makeMoves([new Move(`1`, 0, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 1, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 2, 2)]);
    });
    it(`then the tiles should not merge`, () => {
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [1,_,_,_,_],
        [_,1,_,_,_],
        [_,_,1,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
  });

  describe(`when larger board is created`, () => {
    const width = 50, height = 50;
    let move, board;
    beforeEach(() => {
      board = new Merged(width, height);
      board.makeMoves([new Move(`1`, 49, 49)]);
    });
    it(`then the tile should be in the correct place on the board`, () => {
      expect(`${board.calculateNext()[49][49]}`).to.equal(`1`);
    });
    it(`then a merge should behave as expected`, () => {
      board.makeMoves([new Move(`1`, 48, 49)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 47, 49)]);
      expect(`${board.calculateNext()[47][49]}`).to.equal(`2`);
    });
  });

  describe(`when many moves are made`, () => {
    const width = 5, height = 5;
    let board;
    beforeEach(() => {
      board = new Merged(width, height);
      board.makeMoves([new Move(`1`, 2, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 2, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`2`, 3, 2)]);
      board.calculateNext();
      board.makeMoves([new Move(`2`, 4, 2)]);
      board.calculateNext();
      board.makeMoves([new Move(`3`, 2, 3)]);
      board.calculateNext();
      board.makeMoves([new Move(`3`, 2, 4)]);
    });
    it(`then the tiles should not merge until there is three or more in a chain`, () => {
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,1,_,_],
        [_,_,1,_,_],
        [_,_,_,2,2],
        [_,_,3,_,_],
        [_,_,3,_,_])}`);
    });
    it(`then multiple merges should occur in a chain reaction`, () => {
      board.makeMoves([new Move(`1`, 2, 2)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,4,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then merging M tiles should explode 9 surrounding it`, () => {
      board.makeMoves([new Move(`5`, 1, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`5`, 3, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`5`, 3, 3)]);
      board.calculateNext();
      board.makeMoves([new Move(`5`, 1, 3)]);
      board.calculateNext();
      board.makeMoves([new Move(`M`, 0, 2)]);
      board.calculateNext();
      board.makeMoves([new Move(`M`, 1, 2)]);
      board.calculateNext();
      board.makeMoves([new Move(`M`, 2, 2)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,1,_,_],
        [_,_,_,_,_],
        [_,_,_,_,2],
        [_,_,_,_,_],
        [_,_,3,_,_])}`);
    });
  });

  describe(`when a double move is made on the board`, () => {
    const width = 5, height = 5;
    let board;
    beforeEach(() => {
      board = new Merged(width, height);
      board.makeMoves([new Move(`3`, 0, 0), new Move(`1`, 1, 0)]);
    });
    it(`then the tiles should be in the correct places on the board`, () => {
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [3,1,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then the tiles should merge when forming a set of three`, () => {
      board.makeMoves([new Move(`3`, 0, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`3`, 0, 2), new Move(`2`, 1, 2)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,1,_,_,_],
        [_,_,_,_,_],
        [4,2,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then the tiles should merge when forming multiple sets of three`, () => {
      board.makeMoves([new Move(`3`, 0, 1), new Move(`1`, 1, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 1, 2), new Move(`3`, 0, 2)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,_,_,_],
        [_,_,_,_,_],
        [4,2,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
    it(`then each tile should merge and then chain one after the other in ascending order`, () => {
      board.makeMoves([new Move(`2`, 1, 1)]);
      board.calculateNext();
      board.makeMoves([new Move(`1`, 3, 0), new Move(`2`, 3, 1)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [3,1,_,1,_],
        [_,2,_,2,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
      board.makeMoves([new Move(`2`, 2, 1), new Move(`1`, 2, 0)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [3,_,_,_,_],
        [_,_,3,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_],
        [_,_,_,_,_])}`);
    });
  });

  describe(`when the example is played`, () => {
    const width = 3, height = 4;
    let board;
    beforeEach(() => {
      board = new Merged(width, height);
      board.makeMoves([new Move(`1`, 0, 0), new Move(`1`, 1, 0)]);
      board.calculateNext();
      board.makeMoves([new Move(`2`, 0, 1), new Move(`2`, 0, 2)]);
      board.calculateNext();
    });
    it(`then it should reduce to this`, () => {
      board.makeMoves([new Move(`1`, 1, 1)]);
      expect(`${board.calculateNext()}`).to.equal(`${new EndGame(
        [_,_,_],
        [_,3,_],
        [_,_,_],
        [_,_,_])}`);
    });
  });

})