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
  const misses = [];
  const gameBoard = createBoard();
  const ships = [
    shipFactory(0, 5),
    shipFactory(1, 4),
    shipFactory(2, 3),
    shipFactory(3, 3),
    shipFactory(4, 2),
  ];
  const placeShip = (shipId, [x, y], axis) => {
    const ship = ships[shipId];
    if (axis === 'x') {
      // Place horizontally
      for (let i = 0; i < ship.length; i++) {
        ship.coords.push([x, y]);
        gameBoard[x][y].shipId = ship.id;
        x += 1;
      }
    }
    if (axis === 'y') {
      // Place vertically
      for (let i = 0; i < ship.length; i++) {
        ship.coords.push([x, y]);
        gameBoard[x][y].shipId = ship.id;
        y += 1;
      }
    }
  };
  const hasShip = (tile) => tile.shipId !== null;
  const receiveAttack = (target) => {
    const [x, y] = target;
    const thisTile = gameBoard[x][y];
    if (thisTile.hit) return;
    if (!hasShip(thisTile)) {
      misses.push(target);
    } else if (hasShip(thisTile)) {
      const thisShip = ships[thisTile.shipId];
      for (let i = 0; i < thisShip.coords.length; i++) {
        if (
          thisShip.coords[i].every((value, index) => value === target[index])
        ) {
          thisShip.health[i] = true;
        }
      }
    }
    thisTile.hit = true;
  };
  return { gameBoard, misses, ships, placeShip, receiveAttack };
}
