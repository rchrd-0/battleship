import * as game from './game';
import * as helpers from './helpers';
import * as shipPlacement from './shipPlacement';

const initBoardEvents = () => {
  const compCells = document.querySelectorAll('#comp-board .board-cell');
  compCells.forEach((cell) => {
    cell.addEventListener('click', (e) => {
      const coord = helpers.getCellInfo(e.target);
      game.receiveMove(coord);
    });
  });
};

const initGameButtons = () => {
  // const restartBtn = document.querySelector('#restart-btn');
  // restartBtn.addEventListener('click', game.newGame);
};

const initShipPlacement = () => {
  const playerBoard = document.querySelector('#player-board');

  // mouseover => renderPreview
  // mouseout => clearPreview
  // click => placeShip -- valid??
  playerBoard.addEventListener('mouseover', shipPlacement.previewShip);
};

export { initBoardEvents, initGameButtons, initShipPlacement };
