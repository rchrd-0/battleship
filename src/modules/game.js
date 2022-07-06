import playerFactory from './playerFactory';
import * as dom from './dom';
import * as helpers from './helpers';
import * as shipPlacement from './shipPlacement';

const players = {
  p1: null,
  com: null,
};

const checkGameState = (player) => player.board.allShipsSunk();

const newGame = () => {
  // Clean up board
  dom.clearUI();
  // Create new player objects
  players.p1 = playerFactory(1, true);
  players.com = playerFactory(2, false);
  // Disable computer events
  dom.disableEvents(true);
  // Enable player events
  dom.disableEvents(false, 'player');
  // Start ship placement

  // Enable start game button
};

const startGame = () => {
  // players.p1 = playerFactory(1, true);
  // players.com = playerFactory(2, false);

  players.com.board.placeShip(2, [0, 0], 'x');
  players.p1.board.placeShip(9, [0, 0], 'x');

  dom.updateBoard(players.p1);
  dom.updateBoard(players.com);
  dom.disableEvents(false);
  dom.renderShips(players.p1);
};

const endGame = (winner) => {
  dom.disableEvents(true);
  dom.announceGameOver(winner);
};

const playComMove = async () => {
  const { p1, com } = players;
  const randomMove = await helpers.getRandomMove(com);

  com.makeMove(randomMove, p1.board);
  dom.updateBoard(p1);

  const winState = checkGameState(p1);
  if (winState) {
    endGame(com);
  } else {
    dom.disableEvents(false);
  }
};

const receivePlayerMove = (coord) => {
  const { p1, com } = players;
  if (helpers.alreadyPlayed(p1, coord)) return;
  p1.makeMove(coord, com.board);
  dom.updateBoard(com);

  const winState = checkGameState(com);
  if (winState) {
    endGame(p1);
  } else {
    playComMove(p1, com);
  }
  dom.disableEvents(true);
};

const getNextShip = () => {
  const shipsPlaced = players.p1.board.ships.length;
  return helpers.nextShipLength(shipsPlaced);
};

const placeShip = (e) => {
  const { p1 } = players;
  if (p1.board.ships.length === null) return;

  const target = helpers.getCellInfo(e.target);
  const length = getNextShip();
  const axis = shipPlacement.getAxis();

  p1.board.placeShip(length, target, axis);
  dom.renderShips(p1);
};

export { newGame, startGame, receivePlayerMove, placeShip, getNextShip };
