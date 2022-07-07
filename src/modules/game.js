import playerFactory from './playerFactory';
import * as dom from './dom';
import * as helpers from './helpers';
import * as shipPlacement from './shipPlacement';
import * as botLogic from './botLogic';

const players = {
  p1: null,
  com: null,
};

const checkGameState = (player) => player.board.allShipsSunk();

const newGame = () => {
  players.p1 = playerFactory(1, true);
  players.com = playerFactory(2, false);

  dom.clearUI(players.p1, players.com);
  dom.toggleBtns('start', true);
  dom.toggleBtns('restart', false);
  dom.disableEvents(true, 'comp');
  dom.disableEvents(false, 'player');
};

const startGame = () => {
  botLogic.placeShips(players.com);
  dom.toggleBtns('start', true);
  dom.updateBoard(players.com);
  dom.disableEvents(true, 'player');
  dom.disableEvents(false, 'comp');

  // Remove
  dom.renderShips(players.com);
};

const endGame = (winner) => {
  dom.disableEvents(true, 'comp');
  dom.toggleBtns('restart', true);
  dom.announceGameOver(winner);
};

const playComMove = async () => {
  const { p1, com } = players;
  const randomMove = await botLogic.getRandomMove(com);

  com.makeMove(randomMove, p1.board);
  dom.updateBoard(p1);

  const winState = checkGameState(p1);
  if (winState) {
    endGame(com);
  } else {
    dom.disableEvents(false, 'comp');
  }
};

const receivePlayerMove = (coord) => {
  const { p1, com } = players;
  if (helpers.alreadyPlayed(p1, coord)) return;
  p1.makeMove(coord, com.board);
  dom.updateBoard(com);

  const winState = checkGameState(com);
  if (winState) {
    endGame(p1);
  } else {
    playComMove(p1, com);
  }
  dom.disableEvents(true, 'comp');
};

const getNextShip = () => {
  const shipsPlaced = players.p1.board.ships.length;
  return helpers.nextShipLength(shipsPlaced);
};

const placeShip = (e) => {
  const { p1 } = players;
  if (e.target.classList.contains('board') || p1.board.ships.length === null) {
    return;
  }

  const startIndex = helpers.getCellInfo(e.target);
  const allNodes = shipPlacement.getPreview();
  const length = getNextShip();
  const axis = shipPlacement.getAxis();

  if (shipPlacement.isValid(allNodes, length)) {
    p1.board.placeShip(length, startIndex, axis);
    shipPlacement.clearPreview();
    dom.renderShips(p1);

    if (p1.board.ships.length === 5) {
      dom.toggleBtns('start', false);
    }
  }
};

export {
  newGame,
  startGame,
  receivePlayerMove,
  placeShip,
  getNextShip,
  players,
};
