import * as game from './game';
import * as helpers from './helpers';
import * as shipBuilder from './shipBuilder';

const initBoardEvents = () => {
  const compCells = document.querySelectorAll('#comp-board .board-cell');
  compCells.forEach((cell) => {
    cell.addEventListener('click', (e) => {
      const coord = helpers.getCellInfo(e.target);
      game.receivePlayerMove(coord);
    });
  });
};

const initGameButtons = () => {
  const restartBtn = document.querySelector('#restart-btn');
  restartBtn.addEventListener('click', game.newGame);
  const startBtn = document.querySelector('#start-btn');
  startBtn.addEventListener('click', game.startGame);
  const rotateBtn = document.querySelector('#rotate-ship');
  rotateBtn.addEventListener('click', shipBuilder.switchAxis);
};

const initShipPlacement = () => {
  const playerBoard = document.querySelector('#player-board');
  playerBoard.addEventListener('mouseover', (e) => {
    const nextShip = game.getNextShip();
    shipBuilder.previewShip(e, nextShip);
  });
  playerBoard.addEventListener('mouseout', shipBuilder.clearPreview);
  playerBoard.addEventListener('click', game.placeShip);
};

export { initBoardEvents, initGameButtons, initShipPlacement };
