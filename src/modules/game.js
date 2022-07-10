import playerFactory from './playerFactory';
import * as dom from './dom';
import * as helpers from './helpers';
import * as shipBuilder from './shipBuilder';
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
  dom.toggleStart(true);
  dom.disableEvents(true, 'com');
  dom.disableEvents(false, 'player');
  dom.disableBoardFuncs(false);
  dom.gameMessage('setup', players.p1.board.ships.length);
  dom.hideShipCount(true);
};

const startGame = () => {
  botLogic.autoPlace(players.com);

  dom.toggleStart(true);
  dom.updateBoard(players.com);
  dom.disableEvents(true, 'player');
  dom.disableEvents(false, 'com');
  dom.disableBoardFuncs(true);
  dom.gameMessage('p1Turn');
  dom.hideShipCount(false);
};

const endGame = (winner) => {
  dom.disableEvents(true, 'com');
  dom.announceGameOver(winner);
};

const playComMove = async () => {
  const { p1, com } = players;
  const comAttack = await botLogic.autoAttack(com);

  com.makeMove(comAttack, p1.board);
  dom.updateBoard(p1);

  const winState = checkGameState(p1);
  if (winState) {
    endGame(com);
  } else {
    dom.disableEvents(false, 'com');
    dom.gameMessage('p1Turn');
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
    dom.gameMessage('comTurn');
  }
  dom.disableEvents(true, 'com');
};

const getShipsPlaced = () => players.p1.board.ships.length;

const placeShip = (e) => {
  const { p1 } = players;
  const shipsPlacedStart = getShipsPlaced();

  if (e.target.classList.contains('board') || shipsPlacedStart >= 5) {
    return;
  }

  const startIndex = helpers.getCellInfo(e.target);
  const nextShip = helpers.nextShipLength(shipsPlacedStart);
  const axis = shipBuilder.getAxis();
  const shipValid = shipBuilder.isShipValid(p1, startIndex, axis, nextShip);

  if (shipValid) {
    p1.board.placeShip(nextShip, startIndex, axis);
    shipBuilder.clearPreview();
    dom.renderShips(p1);

    const shipsPlacedEnd = getShipsPlaced();
    dom.readyGame(shipsPlacedEnd);
  }
};

const undoShip = () => {
  const { p1 } = players;
  if (p1.board.ships.length === 0) return;
  p1.board.removeLastShip();

  dom.clearUI(p1);
  dom.renderShips(p1);
  dom.readyGame(getShipsPlaced());
};

const autoPlacePlayer = () => {
  const { p1 } = players;
  const shipsPlaced = getShipsPlaced();

  botLogic.autoPlace(p1, shipsPlaced);
  dom.renderShips(p1);
  dom.readyGame(getShipsPlaced());

  if (shipsPlaced === 5) {
    for (let i = 0; i < 5; i++) {
      undoShip();
    }
    autoPlacePlayer();
  }
};

export {
  newGame,
  startGame,
  receivePlayerMove,
  placeShip,
  getShipsPlaced,
  autoPlacePlayer,
  undoShip,
};
