import * as game from './game';
import * as helpers from './helpers';
import * as shipBuilder from './shipBuilder';

const initBoardEvents = () => {
  const comCells = document.querySelectorAll('#com-board .board-cell');
  comCells.forEach((cell) => {
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

  const autoBtn = document.querySelector('#auto-ship');
  autoBtn.addEventListener('click', game.autoPlacePlayer);

  const rotateBtn = document.querySelector('#rotate');
  rotateBtn.addEventListener('click', shipBuilder.switchAxis);

  const undoBtn = document.querySelector('#undo-ship');
  undoBtn.addEventListener('click', game.undoShip);

  const resetBtn = document.querySelector('#reset-ship');
  resetBtn.addEventListener('click', game.newGame);
};

const initShipPlacement = () => {
  const playerBoard = document.querySelector('#player-board');
  playerBoard.addEventListener('mouseover', (e) => {
    const shipsPlaced = game.getShipsPlaced();
    const nextShip = helpers.nextShipLength(shipsPlaced);
    shipBuilder.previewShip(e, nextShip);
  });
  playerBoard.addEventListener('mouseout', shipBuilder.clearPreview);
  playerBoard.addEventListener('click', game.placeShip);
};

export { initBoardEvents, initGameButtons, initShipPlacement };
