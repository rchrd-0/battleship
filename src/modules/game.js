import playerFactory from './player-factory';
import * as dom from './dom';
import * as helpers from './helpers'

const players = {
  p1: null,
  com: null,
};

const startGame = () => {
  players.p1 = playerFactory('', 1, true, true);
  players.com = playerFactory('', 2, false, false);
  dom.createBoard(players.p1, players.com);
}

const receiveMove = (target, coord) => {
  const playing = (target === 'p1') ? players.com : players.p1
  const enemy = players[target];
  if (helpers.alreadyPlayed(playing, coord)) return
  playing.makeMove(coord, enemy.board)
  dom.updateBoard(enemy)
}

export { startGame, receiveMove };
