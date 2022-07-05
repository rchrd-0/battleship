import * as game from './game';
import * as helpers from './helpers';

const initBoardEvents = () => {
  const playerCells = document.querySelectorAll('#comp-board .board-cell');
  playerCells.forEach((cell) => {
    cell.addEventListener('click', (e) => {
      const coord = helpers.getCellInfo(e.target);
      game.receiveMove(coord);
    });
  });
};

const initGameButtons = () => {
  const restartBtn = document.querySelector('#restart-btn');
  restartBtn.addEventListener('click', game.newGame);
};

const initShipPlacement = () => {
  // const playerBoard = document.querySelector('#player-board');
  // playerBoard.addEventListener('mouseover', (e) => {
  //   if (!e.target.classList.contains('board-cell')) return;

  // })
}

export { initBoardEvents, initGameButtons, initShipPlacement };
