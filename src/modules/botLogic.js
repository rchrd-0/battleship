import * as helpers from './helpers';

const getRandomTile = () => {
  const random = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ];
  return random;
};

const getRandomMove = async (comp) => {
  let randomMove = getRandomTile();
  while (helpers.alreadyPlayed(comp, randomMove)) {
    randomMove = getRandomTile();
  }
  await helpers.timeout(400);
  return randomMove;
};

const getEmptyTiles = (comp) => {
  const { board } = comp;
  const { tiles } = board;
  const emptyTiles = [];
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < Object.keys(tiles[i]).length; j++) {
      const hasShip = board.hasShip(i, j);
      if (!hasShip) {
        const coord = [i, j];
        emptyTiles.push(coord);
      }
    }
  }
  return emptyTiles;
};

const buildShip = (start, axis, length) => {
  const [x, y] = start;
  const allCoords = [];

  if (axis === 'x') {
    for (let i = 0; i < length; i++) {
      allCoords.push([i + x, y]);
    }
  }

  if (axis === 'y') {
    for (let i = 0; i < length; i++) {
      allCoords.push([x, i + y]);
    }
  }

  return allCoords;
};

const shipFits = (length, axis, coord) => {
  const [x, y] = coord;
  if (axis === 'x') {
    return x + length - 1 <= 9;
  }
  if (axis === 'y') {
    return y + length - 1 <= 9;
  }
  return false;
};

const noOverlap = (ship, comp) => {
  const { board } = comp;
  for (let i = 0; i < ship.length; i++) {
    const [x, y] = ship[i];
    if (board.hasShip(x, y)) {
      return false;
    }
  }
  return true;
};

const getRandomEmpty = (comp) => {
  const emptyTiles = getEmptyTiles(comp);

  return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
};

const getValidStart = (comp, length, axis) => {
  let validStart = getRandomEmpty(comp);

  while (shipFits(length, axis, validStart) === false) {
    validStart = getRandomEmpty(comp);
  }

  return validStart;
};

const randomShip = (comp, length) => {
  const axes = ['x', 'y'];
  const randomAxis = axes[Math.floor(Math.random() * axes.length)];

  let startIndex = getValidStart(comp, length, randomAxis);
  let ship = buildShip(startIndex, randomAxis, length);

  while (noOverlap(ship, comp) === false) {
    startIndex = getValidStart(comp, length, randomAxis);
    ship = buildShip(startIndex, randomAxis, length);
  }

  return [ship[0], randomAxis];
};

const placeShips = (comp) => {
  const shipLengths = [5, 4, 3, 3, 2];
  shipLengths.forEach((ship) => {
    const [start, axis] = randomShip(comp, ship);
    comp.board.placeShip(ship, start, axis);
  });
};

export { getRandomMove, placeShips };
