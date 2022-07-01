import shipFactory from './ship-factory';

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
  // const misses = [];
  const tiles = createBoard();
  const ships = [];
  const placeShip = (length, [x, y], axis) => {
    const newShip = shipFactory(ships.length, length);
    ships.push(newShip);
    if (axis === 'x') {
      // Place horizontally
      for (let i = 0; i < newShip.length; i++) {
        newShip.coords.push([x, y]);
        tiles[x][y].shipId = newShip.id;
        x += 1;
      }
    }
    if (axis === 'y') {
      // Place vertically
      for (let i = 0; i < newShip.length; i++) {
        newShip.coords.push([x, y]);
        tiles[x][y].shipId = newShip.id;
        y += 1;
      }
    }
  };
  const hasShip = (tile) => tile.shipId !== null;
  const findShip = (id) => {
    let thisShip;
    for (let i = 0; i < ships.length; i++) {
      if (ships[i].id === id) {
        thisShip = ships[i];
      }
    }
    return thisShip;
  };
  const receiveAttack = (target) => {
    const [x, y] = target;
    const thisTile = tiles[x][y];
    if (thisTile.hit) return;

    // if (!hasShip(thisTile)) {
    //   misses.push(target);
    // }
    if (hasShip(thisTile)) {
      const thisShip = findShip(thisTile.shipId);
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
  const shipsRemaining = () => {
    const filterShips = ships.filter((ship) => ship.isSunk() === false);
    return filterShips.length;
  };
  const allShipsSunk = () => {
    const sunkShips = ships.filter((ship) => ship.isSunk() === true);
    return sunkShips.length > 0;
  };
  return {
    tiles,
    ships,
    placeShip,
    receiveAttack,
    shipsRemaining,
    allShipsSunk,
  };
}
