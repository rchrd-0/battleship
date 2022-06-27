import playerFactory from './player-factory';
import { renderBoard } from './dom';

const players = {
  player: null,
  computer: null,
};

function startGame() {
  const p1 = playerFactory('', 1, true);
  const computer = playerFactory('', 2, false);
  players.player = p1;
  players.computer = computer;
  renderBoard(p1);
  renderBoard(computer);
}

export { players, startGame };
