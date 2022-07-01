import playerFactory from './player-factory';
import * as dom from './dom';
import * as helpers from './helpers';

const players = {
  p1: null,
  com: null,
};

const startGame = () => {
  players.p1 = playerFactory('', 1, true, true);
  players.com = playerFactory('', 2, false, false);
  dom.createBoard(players.p1, players.com);
};

const playComMove = async () => {
  const { p1, com } = players;
  const randomMove = await helpers.getRandomMove(com);
  com.makeMove(randomMove, p1.board);
  dom.updateBoard(p1);
  dom.toggleEvents();
};

const receiveMove = (coord) => {
  const { p1, com } = players;
  if (helpers.alreadyPlayed(p1, coord)) return;
  p1.makeMove(coord, com.board);
  dom.updateBoard(com);
  playComMove(p1, com);
  dom.toggleEvents();
};

export { startGame, receiveMove };
