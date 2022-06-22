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
  const placeShip = (ship, index, axis) => {
    if (axis === 'x') {
      const x = index[0];
      let y = index[1];
      for (let i = 0; i < ship.length; i++) {
        gameBoard[x][y].shipId = ship.id;
        y += 1;
      }
    }
    if (axis === 'y') {
      let x = index[0];
      const y = index[1];
      for (let i = 0; i < ship.length; i++) {
        gameBoard[x][y].shipId = ship.id;
        x += 1;
      }
    }
  };

  return { gameBoard, placeShip };
}
