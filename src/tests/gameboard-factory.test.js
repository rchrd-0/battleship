import gameBoardFactory from "../modules/gameboard-factory";

let board;
let ship;
beforeEach(() => {
  board = gameBoardFactory();
  ship = {id: 99, length: 3}
})

test("place ship; horizontal x", () => {
  board.placeShip(ship, [0, 5], 'x');
  expect(board.gameBoard[0][5].shipId).toEqual(ship.id);
  expect(board.gameBoard[0][6].shipId).toEqual(ship.id);
  expect(board.gameBoard[0][7].shipId).toEqual(ship.id);
})

test("place ship; vertical y", () => {
  board.placeShip(ship, [0, 5], 'y');
  expect(board.gameBoard[0][5].shipId).toEqual(ship.id);
  expect(board.gameBoard[1][5].shipId).toEqual(ship.id);
  expect(board.gameBoard[2][5].shipId).toEqual(ship.id);
})