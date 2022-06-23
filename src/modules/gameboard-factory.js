import shipFactory from './ship-factory';
// receiveAttack()
// gridTile = {
//   coords: x, y
//   hit: false,
//   shipId: null
// }

export default function gameBoardFactory() {
  const createBoard = () => {
    const gameBoard = new Array(10);
    for (let i = 0; i < 10; i++) {
      gameBoard[i] = {};
      for (let j = 0; j < 10; j++) {
        gameBoard[i][j] = {
          hit: false,
          shipId: null,
        };
      }
    }
    return gameBoard;
  };

  const gameBoard = createBoard();
  const ships = [
    shipFactory(0, 5),
    shipFactory(1, 4),
    shipFactory(2, 3),
    shipFactory(3, 3),
    shipFactory(4, 2),
  ];
  const placeShip = (ship, [x, y], axis) => {
    if (axis === 'x') {
      for (let i = 0; i < ship.length; i++) {
        gameBoard[x][y].shipId = ship.id;
        y += 1;
      }
    }
    if (axis === 'y') {
      for (let i = 0; i < ship.length; i++) {
        gameBoard[x][y].shipId = ship.id;
        x += 1;
      }
    }
  };

  return { gameBoard, ships, placeShip };
}
