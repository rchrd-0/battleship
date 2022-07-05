import playerFactory from './player-factory';
import * as dom from './dom';
import * as helpers from './helpers';

const players = {
  p1: null,
  com: null,
};

const startGame = () => {
  players.p1 = playerFactory(1, true);
  players.com = playerFactory(2, false);

  players.com.board.placeShip(2, [0, 0], 'x');
  players.p1.board.placeShip(9, [0, 0], 'x');

  dom.updateBoard(players.p1)
  dom.updateBoard(players.com)

  dom.disableEvents(false);
  dom.renderShips(players.p1);
};

const checkGameState = (player) => player.board.allShipsSunk();

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

const receiveMove = (coord) => {
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

export { startGame, receiveMove };