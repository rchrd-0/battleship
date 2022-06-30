import * as game from './game';
import * as helpers from './helpers';

const initBoardEvents = () => {
  const playerCells = document.querySelectorAll('#comp-board .board-cell');
  playerCells.forEach((cell) => {
    cell.addEventListener('click', (e) => {
      const [opponent, coord] = helpers.getCellInfo(e.target);
      game.receiveMove(opponent, coord);
    });
  });
};

export { initBoardEvents };
