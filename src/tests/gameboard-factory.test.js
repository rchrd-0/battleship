import gameBoardFactory from '../modules/gameboard-factory';

let board;
beforeEach(() => {
  board = gameBoardFactory();
});

test('place ship; vertical y', () => {
  board.placeShip(3, [0, 5], 'y');
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i === 0 && (j === 5 || j === 6 || j === 7)) {
        continue;
      }
      expect(board.gameBoard[i][j].shipId).toBe(null);
    }
  }
  expect(board.gameBoard[0][5].shipId).toBe(3);
  expect(board.gameBoard[0][6].shipId).toBe(3);
  expect(board.gameBoard[0][7].shipId).toBe(3);
});

test('place ship; vertical x', () => {
  board.placeShip(3, [0, 5], 'x');
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (j === 5 && (i === 0 || i === 1 || i === 2)) {
        continue;
      }
      expect(board.gameBoard[i][j].shipId).toBe(null);
    }
  }
  expect(board.gameBoard[0][5].shipId).toBe(3);
  expect(board.gameBoard[1][5].shipId).toBe(3);
  expect(board.gameBoard[2][5].shipId).toBe(3);
});

test('ships created from shipFactory, test existence of properties', () => {
  for (let i = 0; i < board.ships.length; i++) {
    expect(Object.keys(board.ships[i])).toEqual([
      'id',
      'length',
      'health',
      'coords',
      'hit',
      'isSunk',
    ]);
  }
});

test('array of missed shots', () => {
  board.receiveAttack([5, 5]);
  board.receiveAttack([3, 2]);
  board.receiveAttack([7, 4]);
  expect(board.misses).toEqual([
    [5, 5],
    [3, 2],
    [7, 4],
  ]);
});

test('receiveAttack on empty tile', () => {
  board.receiveAttack([5, 5]);
  expect(board.gameBoard[5][5].hit).toBe(true);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i === 5 && j === 5) {
        continue;
      }
      expect(board.gameBoard[i][j].hit).toBe(false);
    }
  }
});

test('receiveAttack on ship', () => {
  board.placeShip(3, [1, 0], 'x');
  board.receiveAttack([1, 0]);
  board.receiveAttack([2, 0]);
  expect(board.gameBoard[1][0].hit).toBe(true);
  expect(board.gameBoard[2][0].hit).toBe(true);
});

test('receiveAttack and sink', () => {
  board.placeShip(4, [1, 0], 'y');
  board.placeShip(3, [6, 0], 'x');
  board.receiveAttack([1, 0]);
  board.receiveAttack([1, 1]);
  board.receiveAttack([6, 0]);
  expect(board.ships[4].isSunk()).toBe(true);
  expect(board.ships[3].isSunk()).toBe(false);
});
