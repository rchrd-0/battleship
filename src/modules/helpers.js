const getCellInfo = (target) => {
  return [Number(target.dataset.x), Number(target.dataset.y)];
};

const alreadyPlayed = (player, target) => {
  const previousMoves = player.moves;
  for (let i = 0; i < previousMoves.length; i++) {
    if (previousMoves[i].every((value, index) => value === target[index])) {
      return true;
    }
  }
  return false;
};

const getAdjacentTiles = (tile) => {
  const [x, y] = tile;
  const adjacentTiles = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ];
  return adjacentTiles.filter((adjacent) => {
    const [a, b] = adjacent;
    return a >= 0 && a <= 9 && b >= 0 && b <= 9;
  });
};

const timeout = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const getRandomTile = () => {
  const random = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ];
  return random;
};

const getEmptyTiles = (player) => {
  const { board } = player;
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

const getRandomEmpty = (player) => {
  const emptyTiles = getEmptyTiles(player);

  return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
};

const nextShipLength = (numShipsPlaced) => {
  switch (numShipsPlaced) {
    case 0:
      return 5;
    case 1:
      return 4;
    case 2:
      return 3;
    case 3:
      return 3;
    case 4:
      return 2;
    default:
      return null;
  }
};

const getRandomAxis = () => ['x', 'y'][Math.floor(Math.random() * 2)];

export {
  getCellInfo,
  alreadyPlayed,
  timeout,
  getRandomTile,
  getRandomEmpty,
  nextShipLength,
  getRandomAxis,
  getAdjacentTiles,
};
