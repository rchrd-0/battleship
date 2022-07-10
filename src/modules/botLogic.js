import * as helpers from './helpers';
import * as shipBuilder from './shipBuilder';

const findSmartishMoves = (com, player) => {
  const previousHits = com.moves.filter(([x, y]) => {
    return player.board.tiles[x][y].shipId !== null;
  });

  const adjacentTiles = [];
  for (let i = 0; i < previousHits.length; i++) {
    const tile = previousHits[i];
    const output = helpers.getAdjacentTiles(tile);
    for (let j = 0; j < output.length; j++) {
      adjacentTiles.push(output[j]);
    }
  }

  return adjacentTiles.filter(([x, y]) => {
    return player.board.tiles[x][y].hit === false;
  });
};

const autoAttack = async (com, player) => {
  const smartishMoves = findSmartishMoves(com, player);
  let move;
  if (smartishMoves.length > 0) {
    move = smartishMoves[Math.floor(Math.random() * smartishMoves.length)];
  } else {
    let randomMove = helpers.getRandomTile();
    while (helpers.alreadyPlayed(com, randomMove)) {
      randomMove = helpers.getRandomTile();
    }
    move = randomMove;
  }
  await helpers.timeout(400);
  return move;
};

/* Random ship placement */
/* Returns a random startingIndex & axis (to place a ship) that will fit within 
  10x10 board */
const getValidStart = (player, length) => {
  let startIndex;
  let axis;
  let shipFits = false;
  while (!shipFits) {
    const randomIndex = helpers.getRandomEmpty(player);
    const randomAxis = helpers.getRandomAxis();
    shipFits = shipBuilder.doesShipFit(length, randomAxis, randomIndex);
    startIndex = randomIndex;
    axis = randomAxis;
  }
  return [startIndex, axis];
};

/* Generates a random ship position that passes checks:
  1. ship of length a, placed on axis b will fit within the 10x10 board
  2. ship does not overlap with an already placed ship */
const randomShip = (player, length) => {
  let start;
  let axis;
  let valid = false;
  while (!valid) {
    const [randomIndex, randomAxis] = getValidStart(player, length);
    const ship = shipBuilder.buildShip(randomIndex, randomAxis, length);
    valid = shipBuilder.noOverlap(ship, player);
    start = randomIndex;
    axis = randomAxis;
  }
  return [start, axis];
};

const autoPlace = (player, shipsSoFar = 0) => {
  const ships = [5, 4, 3, 3, 2];

  for (let i = shipsSoFar; i < ships.length; i++) {
    const length = ships[i];
    const ship = randomShip(player, length);
    player.board.placeShip(length, ...ship);
  }
};

export { autoAttack, autoPlace };
