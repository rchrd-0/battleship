import * as helpers from './helpers';

const generateRandom = () => {
  const random = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ];
  return random;
};

const getRandomMove = async (player) => {
  let randomMove = generateRandom();
  while (helpers.alreadyPlayed(player, randomMove)) {
    randomMove = generateRandom();
  }
  await helpers.timeout(400);
  return randomMove;
};

const placeShips = () => {
  
}

export { getRandomMove };
