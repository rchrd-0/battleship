import gameBoardFactory from '../modules/gameboard-factory';

let board;
let ship;
beforeEach(() => {
  board = gameBoardFactory();
  ship = { id: 99, length: 3 };
});

test('place ship; horizontal x', () => {
  board.placeShip(ship, [0, 5], 'x');
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i === 0 && (j === 5 || j === 6 || j === 7)) {
        continue;
      }
      expect(board.gameBoard[i][j].shipId).not.toBe(ship.id);
    }
  }
  expect(board.gameBoard[0][5].shipId).toBe(ship.id);
  expect(board.gameBoard[0][6].shipId).toBe(ship.id);
  expect(board.gameBoard[0][7].shipId).toBe(ship.id);
});

test('place ship; vertical y', () => {
  board.placeShip(ship, [0, 5], 'y');
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (j === 5 && (i === 0 || i === 1 || i === 2)) {
        continue;
      }
      expect(board.gameBoard[i][j].shipId).not.toBe(ship.id);
    }
  }
  expect(board.gameBoard[0][5].shipId).toBe(ship.id);
  expect(board.gameBoard[1][5].shipId).toBe(ship.id);
  expect(board.gameBoard[2][5].shipId).toBe(ship.id);
});
