import playerFactory from './player-factory';
import * as dom from './dom'

const players = {
  p1: null,
  com: null,
};

function startGame() {
  const p1 = playerFactory('', 1, true);
  const computer = playerFactory('', 2, false);
  players.p1 = p1;
  players.com = computer;
  dom.renderBoard(players.p1, players.com);
}

export { players, startGame };
