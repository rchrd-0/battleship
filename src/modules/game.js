import playerFactory from './player-factory';
import * as dom from './dom'

const players = {
  p1: null,
  com: null,
};

function startGame() {
  players.p1 = playerFactory('', 1, true);
  players.com = playerFactory('', 2, false);
  dom.renderBoard(players.p1, players.com);
}

export { players, startGame };
