/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/modules/botLogic.js":
/*!*********************************!*\
  !*** ./src/modules/botLogic.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "autoAttack": () => (/* binding */ autoAttack),
/* harmony export */   "autoPlace": () => (/* binding */ autoPlace)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/modules/helpers.js");
/* harmony import */ var _shipBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shipBuilder */ "./src/modules/shipBuilder.js");



// Random move (attack)
const autoAttack = async (player) => {
  let randomMove = _helpers__WEBPACK_IMPORTED_MODULE_0__.getRandomTile();
  while (_helpers__WEBPACK_IMPORTED_MODULE_0__.alreadyPlayed(player, randomMove)) {
    randomMove = _helpers__WEBPACK_IMPORTED_MODULE_0__.getRandomTile();
  }
  await _helpers__WEBPACK_IMPORTED_MODULE_0__.timeout(400);
  return randomMove;
};

/* Random ship placement */
/* Returns a random startingIndex & axis (to place a ship) that will fit within 
  10x10 board */
const getValidStart = (player, length) => {
  let startIndex;
  let axis;
  let shipFits = false;
  while (!shipFits) {
    const randomIndex = _helpers__WEBPACK_IMPORTED_MODULE_0__.getRandomEmpty(player);
    const randomAxis = _helpers__WEBPACK_IMPORTED_MODULE_0__.getRandomAxis();
    shipFits = _shipBuilder__WEBPACK_IMPORTED_MODULE_1__.doesShipFit(length, randomAxis, randomIndex);
    startIndex = randomIndex;
    axis = randomAxis;
  }
  return [startIndex, axis];
};

/* Generates a random ship position that passes checks:
  1. ship of length a, placed on axis b will fit within the 10x10 board
  2. ship does not overlap with an already placed ship */
const randomShip = (player, length) => {
  let start;
  let axis;
  let valid = false;
  while (!valid) {
    const [randomIndex, randomAxis] = getValidStart(player, length);
    const ship = _shipBuilder__WEBPACK_IMPORTED_MODULE_1__.buildShip(randomIndex, randomAxis, length);
    valid = _shipBuilder__WEBPACK_IMPORTED_MODULE_1__.noOverlap(ship, player);
    start = randomIndex;
    axis = randomAxis;
  }
  return [start, axis];
};

const autoPlace = (player, shipsSoFar = 0) => {
  const ships = [5, 4, 3, 3, 2];

  for (let i = shipsSoFar; i < ships.length; i++) {
    const length = ships[i];
    const ship = randomShip(player, length);
    player.board.placeShip(length, ...ship);
  }
};




/***/ }),

/***/ "./src/modules/dom.js":
/*!****************************!*\
  !*** ./src/modules/dom.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "announceGameOver": () => (/* binding */ announceGameOver),
/* harmony export */   "clearUI": () => (/* binding */ clearUI),
/* harmony export */   "createBoards": () => (/* binding */ createBoards),
/* harmony export */   "disableBoardFuncs": () => (/* binding */ disableBoardFuncs),
/* harmony export */   "disableEvents": () => (/* binding */ disableEvents),
/* harmony export */   "readyGame": () => (/* binding */ readyGame),
/* harmony export */   "renderShips": () => (/* binding */ renderShips),
/* harmony export */   "toggleBtns": () => (/* binding */ toggleBtns),
/* harmony export */   "updateBoard": () => (/* binding */ updateBoard)
/* harmony export */ });
const gameboards = document.querySelectorAll('.board');
const playerBoard = document.querySelector('#player-board');
const comBoard = document.querySelector('#com-board');
const gameInfo = document.querySelector('#game-info');

const updateShipCount = (player) => {
  const thisBoard = player.isHuman ? playerBoard : comBoard;
  const shipCounter = thisBoard.previousElementSibling;
  const shipsRemaining = player.board.shipsRemaining();

  shipCounter.textContent = `Ships remaining: ${shipsRemaining}`;
};

const createBoards = () => {
  gameboards.forEach((board) => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const boardCell = document.createElement('div');

        boardCell.classList.add('board-cell');
        boardCell.dataset.x = j;
        boardCell.dataset.y = i;
        board.appendChild(boardCell);
      }
    }
  });
};

const renderShips = (player) => {
  const board = player.isHuman ? playerBoard : comBoard;
  const { ships } = player.board;
  const coords = ships.map((ship) => ship.coords);

  for (let i = 0; i < coords.length; i++) {
    for (let j = 0; j < coords[i].length; j++) {
      const [x, y] = [coords[i][j][0], coords[i][j][1]];
      const thisCell = board.querySelector(`[data-x='${x}'][data-y='${y}']`);
      thisCell.classList.add('ship');
    }
  }
  updateShipCount(player);
};

const updateBoard = (player) => {
  const thisBoard = player.isHuman ? playerBoard : comBoard;
  const { board } = player;
  const { tiles } = board;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < Object.keys(tiles[i]).length; j++) {
      const thisTile = tiles[i][j];
      const hasShip = board.hasShip(i, j);
      if (thisTile.hit) {
        const thisCell = thisBoard.querySelector(
          `[data-x='${i}'][data-y='${j}']`
        );
        if (hasShip) {
          thisCell.classList.add('hit');
        } else {
          thisCell.classList.add('miss');
        }
      }
    }
  }
  updateShipCount(player);
};

const styleGameOver = (bool) => {
  if (bool) {
    gameboards.forEach((board) => board.classList.add('game-over'));
  } else {
    gameboards.forEach((board) => board.classList.remove('game-over'));
  }
};

const clearUI = (...players) => {
  gameboards.forEach((board) => {
    const cells = board.querySelectorAll('.board-cell');
    cells.forEach((cell) => {
      cell.classList.remove('miss', 'hit', 'ship');
    });
  });
  players.forEach((player) => updateShipCount(player));
  styleGameOver(false);
};

const announceGameOver = (winner) => {
  const winMessage =
    winner.num === 1
      ? 'Congratulations! You win!'
      : 'Game over ... Computer wins!';

  gameInfo.textContent = winMessage;
  styleGameOver(true);
};

const disableEvents = (bool, board) => {
  const thisBoard = board === 'com' ? comBoard : playerBoard;
  if (bool) {
    thisBoard.classList.add('no-events');
  } else {
    thisBoard.classList.remove('no-events');
  }
};

const toggleBtns = (button, state) => {
  const startBtn = document.querySelector('#start-btn');
  const restartBtn = document.querySelector('#restart-btn');

  if (button === 'start') {
    if (state) {
      startBtn.setAttribute('disabled', '');
    } else {
      startBtn.removeAttribute('disabled');
    }
  }

  if (button === 'restart') {
    if (state) {
      restartBtn.textContent = 'New game';
    } else {
      restartBtn.textContent = 'Restart';
    }
  }
};

const readyGame = (length) => {
  if (length === 5) {
    toggleBtns('start', false);
  } else {
    toggleBtns('start', true);
  }
};

const disableBoardFuncs = (bool) => {
  const boardFuncs = document.querySelectorAll('.board-funcs');
  if (bool) {
    boardFuncs.forEach((button) => button.setAttribute('disabled', ''));
  } else {
    boardFuncs.forEach((button) => button.removeAttribute('disabled'));
  }
};




/***/ }),

/***/ "./src/modules/eventController.js":
/*!****************************************!*\
  !*** ./src/modules/eventController.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initBoardEvents": () => (/* binding */ initBoardEvents),
/* harmony export */   "initGameButtons": () => (/* binding */ initGameButtons),
/* harmony export */   "initShipPlacement": () => (/* binding */ initShipPlacement)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/modules/game.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/modules/helpers.js");
/* harmony import */ var _shipBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shipBuilder */ "./src/modules/shipBuilder.js");




const initBoardEvents = () => {
  const comCells = document.querySelectorAll('#com-board .board-cell');
  comCells.forEach((cell) => {
    cell.addEventListener('click', (e) => {
      const coord = _helpers__WEBPACK_IMPORTED_MODULE_1__.getCellInfo(e.target);
      _game__WEBPACK_IMPORTED_MODULE_0__.receivePlayerMove(coord);
    });
  });
};

const initGameButtons = () => {
  const restartBtn = document.querySelector('#restart-btn');
  restartBtn.addEventListener('click', _game__WEBPACK_IMPORTED_MODULE_0__.newGame);

  const startBtn = document.querySelector('#start-btn');
  startBtn.addEventListener('click', _game__WEBPACK_IMPORTED_MODULE_0__.startGame);

  const autoBtn = document.querySelector('#auto-ship');
  autoBtn.addEventListener('click', _game__WEBPACK_IMPORTED_MODULE_0__.autoPlacePlayer);

  const rotateBtn = document.querySelector('#rotate');
  rotateBtn.addEventListener('click', _shipBuilder__WEBPACK_IMPORTED_MODULE_2__.switchAxis);

  const undoBtn = document.querySelector('#undo-ship');
  undoBtn.addEventListener('click', _game__WEBPACK_IMPORTED_MODULE_0__.undoShip);

  const resetBtn = document.querySelector('#reset-ship');
  resetBtn.addEventListener('click', _game__WEBPACK_IMPORTED_MODULE_0__.newGame);
};

const initShipPlacement = () => {
  const playerBoard = document.querySelector('#player-board');
  playerBoard.addEventListener('mouseover', (e) => {
    const shipsPlaced = _game__WEBPACK_IMPORTED_MODULE_0__.getShipsPlaced();
    const nextShip = _helpers__WEBPACK_IMPORTED_MODULE_1__.nextShipLength(shipsPlaced);
    _shipBuilder__WEBPACK_IMPORTED_MODULE_2__.previewShip(e, nextShip);
  });
  playerBoard.addEventListener('mouseout', _shipBuilder__WEBPACK_IMPORTED_MODULE_2__.clearPreview);
  playerBoard.addEventListener('click', _game__WEBPACK_IMPORTED_MODULE_0__.placeShip);
};




/***/ }),

/***/ "./src/modules/game.js":
/*!*****************************!*\
  !*** ./src/modules/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "autoPlacePlayer": () => (/* binding */ autoPlacePlayer),
/* harmony export */   "getShipsPlaced": () => (/* binding */ getShipsPlaced),
/* harmony export */   "newGame": () => (/* binding */ newGame),
/* harmony export */   "placeShip": () => (/* binding */ placeShip),
/* harmony export */   "receivePlayerMove": () => (/* binding */ receivePlayerMove),
/* harmony export */   "startGame": () => (/* binding */ startGame),
/* harmony export */   "undoShip": () => (/* binding */ undoShip)
/* harmony export */ });
/* harmony import */ var _playerFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./playerFactory */ "./src/modules/playerFactory.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/modules/dom.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./src/modules/helpers.js");
/* harmony import */ var _shipBuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shipBuilder */ "./src/modules/shipBuilder.js");
/* harmony import */ var _botLogic__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./botLogic */ "./src/modules/botLogic.js");






const players = {
  p1: null,
  com: null,
};

const checkGameState = (player) => player.board.allShipsSunk();

const newGame = () => {
  players.p1 = (0,_playerFactory__WEBPACK_IMPORTED_MODULE_0__["default"])(1, true);
  players.com = (0,_playerFactory__WEBPACK_IMPORTED_MODULE_0__["default"])(2, false);

  _dom__WEBPACK_IMPORTED_MODULE_1__.clearUI(players.p1, players.com);
  _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('start', true);
  _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('restart', false);
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'com');
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'player');
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableBoardFuncs(false);
};

const startGame = () => {
  _botLogic__WEBPACK_IMPORTED_MODULE_4__.autoPlace(players.com);
  _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('start', true);
  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(players.com);
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'player');
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'com');
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableBoardFuncs(true);
};

const endGame = (winner) => {
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'com');
  _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('restart', true);
  _dom__WEBPACK_IMPORTED_MODULE_1__.announceGameOver(winner);
};

const playComMove = async () => {
  const { p1, com } = players;
  const comAttack = await _botLogic__WEBPACK_IMPORTED_MODULE_4__.autoAttack(com);

  com.makeMove(comAttack, p1.board);
  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(p1);

  const winState = checkGameState(p1);
  if (winState) {
    endGame(com);
  } else {
    _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'com');
  }
};

const receivePlayerMove = (coord) => {
  const { p1, com } = players;
  if (_helpers__WEBPACK_IMPORTED_MODULE_2__.alreadyPlayed(p1, coord)) return;
  p1.makeMove(coord, com.board);
  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(com);

  const winState = checkGameState(com);
  if (winState) {
    endGame(p1);
  } else {
    playComMove(p1, com);
  }
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'com');
};

const getShipsPlaced = () => players.p1.board.ships.length;

const placeShip = (e) => {
  const { p1 } = players;
  const shipsPlacedStart = getShipsPlaced();

  if (e.target.classList.contains('board') || shipsPlacedStart >= 5) {
    return;
  }

  const startIndex = _helpers__WEBPACK_IMPORTED_MODULE_2__.getCellInfo(e.target);
  const nextShip = _helpers__WEBPACK_IMPORTED_MODULE_2__.nextShipLength(shipsPlacedStart);
  const axis = _shipBuilder__WEBPACK_IMPORTED_MODULE_3__.getAxis();
  const shipValid = _shipBuilder__WEBPACK_IMPORTED_MODULE_3__.isShipValid(p1, startIndex, axis, nextShip);

  if (shipValid) {
    p1.board.placeShip(nextShip, startIndex, axis);
    _shipBuilder__WEBPACK_IMPORTED_MODULE_3__.clearPreview();
    _dom__WEBPACK_IMPORTED_MODULE_1__.renderShips(p1);

    _dom__WEBPACK_IMPORTED_MODULE_1__.readyGame(getShipsPlaced());
  }
};

const autoPlacePlayer = () => {
  const { p1 } = players;
  const shipsPlaced = getShipsPlaced();

  _botLogic__WEBPACK_IMPORTED_MODULE_4__.autoPlace(p1, shipsPlaced);
  _dom__WEBPACK_IMPORTED_MODULE_1__.renderShips(p1);
  _dom__WEBPACK_IMPORTED_MODULE_1__.readyGame(getShipsPlaced());
};

const undoShip = () => {
  const { p1 } = players;
  if (p1.board.ships.length === 0) return;
  p1.board.removeLastShip();

  _dom__WEBPACK_IMPORTED_MODULE_1__.clearUI(p1);
  _dom__WEBPACK_IMPORTED_MODULE_1__.renderShips(p1);
  _dom__WEBPACK_IMPORTED_MODULE_1__.readyGame(getShipsPlaced());
};




/***/ }),

/***/ "./src/modules/gameboardFactory.js":
/*!*****************************************!*\
  !*** ./src/modules/gameboardFactory.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ gameboardFactory)
/* harmony export */ });
/* harmony import */ var _shipFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shipFactory */ "./src/modules/shipFactory.js");


function gameboardFactory() {
  const createBoard = () => {
    const gameboard = new Array(10);
    for (let i = 0; i < 10; i++) {
      gameboard[i] = {};
      for (let j = 0; j < 10; j++) {
        gameboard[i][j] = {
          hit: false,
          shipId: null,
        };
      }
    }
    return gameboard;
  };

  const tiles = createBoard();

  const ships = [];

  const mapShipId = (length) => {
    let id;
    switch (length) {
      case 5:
        id = 0;
        break;
      case 4:
        id = 1;
        break;
      case 2:
        id = 4;
        break;
      case 3:
        id = ships.some((ship) => ship.id === 2) ? 3 : 2;
        break;
      // No default
    }
    return id;
  };

  const placeShip = (length, [x, y], axis) => {
    const shipId = mapShipId(length);
    const newShip = (0,_shipFactory__WEBPACK_IMPORTED_MODULE_0__["default"])(shipId, length);
    ships.push(newShip);
    if (axis === 'x') {
      // Place horizontally
      for (let i = 0; i < newShip.length; i++) {
        newShip.coords.push([x, y]);
        tiles[x][y].shipId = newShip.id;
        x += 1;
      }
    }
    if (axis === 'y') {
      // Place vertically
      for (let i = 0; i < newShip.length; i++) {
        newShip.coords.push([x, y]);
        tiles[x][y].shipId = newShip.id;
        y += 1;
      }
    }
  };

  const removeLastShip = () => {
    const [ship] = ships.splice(ships.length - 1, 1);
    for (let i = 0; i < ship.coords.length; i++) {
      const [x, y] = ship.coords[i];
      tiles[x][y].shipId = null;
    }
  };

  const hasShip = (x, y) => tiles[x][y].shipId !== null;

  const findShip = (id) => {
    let thisShip;
    for (let i = 0; i < ships.length; i++) {
      if (ships[i].id === id) {
        thisShip = ships[i];
      }
    }
    return thisShip;
  };

  const receiveAttack = (target) => {
    const [x, y] = target;
    const thisTile = tiles[x][y];
    if (thisTile.hit) return;

    if (hasShip(x, y)) {
      const thisShip = findShip(thisTile.shipId);
      for (let i = 0; i < thisShip.coords.length; i++) {
        if (
          thisShip.coords[i].every((value, index) => value === target[index])
        ) {
          thisShip.health[i] = true;
        }
      }
    }
    thisTile.hit = true;
  };

  const shipsRemaining = () => {
    const filterShips = ships.filter((ship) => ship.isSunk() === false);
    return filterShips.length;
  };

  const allShipsSunk = () => {
    const sunkShips = shipsRemaining();
    return sunkShips === 0;
  };

  return {
    tiles,
    ships,
    placeShip,
    hasShip,
    receiveAttack,
    shipsRemaining,
    allShipsSunk,
    removeLastShip,
  };
}


/***/ }),

/***/ "./src/modules/helpers.js":
/*!********************************!*\
  !*** ./src/modules/helpers.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "alreadyPlayed": () => (/* binding */ alreadyPlayed),
/* harmony export */   "getCellInfo": () => (/* binding */ getCellInfo),
/* harmony export */   "getRandomAxis": () => (/* binding */ getRandomAxis),
/* harmony export */   "getRandomEmpty": () => (/* binding */ getRandomEmpty),
/* harmony export */   "getRandomTile": () => (/* binding */ getRandomTile),
/* harmony export */   "nextShipLength": () => (/* binding */ nextShipLength),
/* harmony export */   "timeout": () => (/* binding */ timeout)
/* harmony export */ });
const getCellInfo = (target) => {
  return [Number(target.dataset.x), Number(target.dataset.y)];
};

const alreadyPlayed = (player, target) => {
  const previousMoves = player.moves;
  for (let i = 0; i < previousMoves.length; i++) {
    if (previousMoves[i].every((value, index) => value === target[index])) {
      return true;
    }
  }
  return false;
};

const timeout = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const getRandomTile = () => {
  const random = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ];
  return random;
};

const getEmptyTiles = (player) => {
  const { board } = player;
  const { tiles } = board;
  const emptyTiles = [];
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < Object.keys(tiles[i]).length; j++) {
      const hasShip = board.hasShip(i, j);
      if (!hasShip) {
        const coord = [i, j];
        emptyTiles.push(coord);
      }
    }
  }
  return emptyTiles;
};

const getRandomEmpty = (player) => {
  const emptyTiles = getEmptyTiles(player);

  return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
};

const nextShipLength = (numShipsPlaced) => {
  switch (numShipsPlaced) {
    case 0:
      return 5;
    case 1:
      return 4;
    case 2:
      return 3;
    case 3:
      return 3;
    case 4:
      return 2;
    default:
      return null;
  }
};

const getRandomAxis = () => ['x', 'y'][Math.floor(Math.random() * 2)];




/***/ }),

/***/ "./src/modules/playerFactory.js":
/*!**************************************!*\
  !*** ./src/modules/playerFactory.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ playerFactory)
/* harmony export */ });
/* harmony import */ var _gameboardFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboardFactory */ "./src/modules/gameboardFactory.js");


function playerFactory(num, human) {
  const gameboard = (0,_gameboardFactory__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const moves = [];
  const makeMove = (target, enemyBoard) => {
    enemyBoard.receiveAttack(target);
    moves.push(target);
  };

  return {
    get num() {
      return num;
    },
    get board() {
      return gameboard;
    },
    get isHuman() {
      return human;
    },
    get moves() {
      return moves;
    },
    makeMove,
  };
}


/***/ }),

/***/ "./src/modules/shipBuilder.js":
/*!************************************!*\
  !*** ./src/modules/shipBuilder.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildShip": () => (/* binding */ buildShip),
/* harmony export */   "clearPreview": () => (/* binding */ clearPreview),
/* harmony export */   "doesShipFit": () => (/* binding */ doesShipFit),
/* harmony export */   "getAxis": () => (/* binding */ getAxis),
/* harmony export */   "isShipValid": () => (/* binding */ isShipValid),
/* harmony export */   "noOverlap": () => (/* binding */ noOverlap),
/* harmony export */   "previewShip": () => (/* binding */ previewShip),
/* harmony export */   "switchAxis": () => (/* binding */ switchAxis)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/modules/helpers.js");


const playerBoard = document.querySelector('#player-board');

// Ship rotation where x = place horizontally, y = place vertically
const axes = {
  x: true,
  y: false,
};

const getAxis = () => {
  const keys = Object.keys(axes);
  return keys.filter((key) => axes[key] === true)[0];
};

const switchAxis = () => {
  axes.x = !axes.x;
  axes.y = !axes.x;
};

// Returns array of [x, y] coords of a ship of length, built on axis, at start index
const buildShip = (start, axis, length) => {
  const [x, y] = start;
  const shipCoords = [];

  if (axis === 'x') {
    for (let i = 0; i < length; i++) {
      shipCoords.push([i + x, y]);
    }
  }

  if (axis === 'y') {
    for (let i = 0; i < length; i++) {
      shipCoords.push([x, i + y]);
    }
  }

  return shipCoords;
};

/* Valid checks for ship object on board object */
//  Check if ship of length & axis fits within 10x10 gameboard boundaries
const doesShipFit = (length, axis, startIndex) => {
  const [x, y] = startIndex;
  if (axis === 'x') {
    return x + length - 1 <= 9;
  }
  if (axis === 'y') {
    return y + length - 1 <= 9;
  }
  return false;
};

// Checks ship does not overlap with another
const noOverlap = (ship, player) => {
  const { board } = player;
  for (let i = 0; i < ship.length; i++) {
    const [x, y] = ship[i];
    if (board.hasShip(x, y) === true) {
      return false;
    }
  }
  return true;
};

const isShipValid = (player, start, axis, length) => {
  const shipFits = doesShipFit(length, axis, start);

  if (shipFits) {
    const ship = buildShip(start, axis, length);
    if (noOverlap(ship, player)) {
      return true;
    }
  }
  return false;
};

/* Previewing ship placement on DOM */
const isPreviewValid = (coords, length) => {
  const isWithinBounds = coords.length === length;
  const noOtherShips = coords.every(
    (coord) => !coord.classList.contains('ship')
  );
  return isWithinBounds && noOtherShips;
};

const buildPreview = (start, length, axis, board) => {
  const [x, y] = start;
  const shipCoords = [];

  if (axis === 'x') {
    for (let i = 0; i < length; i++) {
      // >9 = out of bounds
      if (i + x > 9) break;
      const nextCell = board.querySelector(
        `[data-x='${i + x}'][data-y='${y}']`
      );
      shipCoords.push(nextCell);
    }
  }

  if (axis === 'y') {
    for (let i = 0; i < length; i++) {
      // >9 = out of bounds
      if (i + y > 9) break;

      const nextCell = board.querySelector(
        `[data-x='${x}'][data-y='${i + y}']`
      );
      shipCoords.push(nextCell);
    }
  }

  return shipCoords;
};

const previewShip = (e, length) => {
  if (e.target.classList.contains('board') || length === null) return;

  const startingIndex = _helpers__WEBPACK_IMPORTED_MODULE_0__.getCellInfo(e.target);
  const axis = getAxis();
  const shipCoords = buildPreview(startingIndex, length, axis, playerBoard);
  const validPreview = isPreviewValid(shipCoords, length);

  if (validPreview) {
    shipCoords.forEach((cell) => cell.classList.add('ship-preview'));
  } else {
    shipCoords.forEach((cell) => cell.classList.add('invalid'));
  }
};

const clearPreview = () => {
  const cells = playerBoard.querySelectorAll('.board-cell');
  cells.forEach((cell) => cell.classList.remove('ship-preview', 'invalid'));
};




/***/ }),

/***/ "./src/modules/shipFactory.js":
/*!************************************!*\
  !*** ./src/modules/shipFactory.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ shipFactory)
/* harmony export */ });
function shipFactory(id, length) {
  const createHealth = (size) => {
    const array = [...Array(size).keys()];
    const health = array.reduce((prev, curr) => {
      prev[curr] = false;
      return prev;
    }, {});
    return health;
  };

  const coords = [];

  const health = createHealth(length);
  // health = { where bool represents hit/no hit
  //   0: false,
  //   1: false,
  //   2: false,
  // }
  const hit = (index) => {
    health[index] = true;
  };

  const isSunk = () => {
    return Object.values(health).every((index) => index === true);
  };

  return {
    id,
    length,
    health,
    coords,
    hit,
    isSunk,
  };
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _modules_game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/game */ "./src/modules/game.js");
/* harmony import */ var _modules_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/dom */ "./src/modules/dom.js");
/* harmony import */ var _modules_eventController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/eventController */ "./src/modules/eventController.js");





_modules_dom__WEBPACK_IMPORTED_MODULE_2__.createBoards();
_modules_game__WEBPACK_IMPORTED_MODULE_1__.newGame();

_modules_eventController__WEBPACK_IMPORTED_MODULE_3__.initBoardEvents();
_modules_eventController__WEBPACK_IMPORTED_MODULE_3__.initGameButtons();
_modules_eventController__WEBPACK_IMPORTED_MODULE_3__.initShipPlacement();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9ib3RMb2dpYy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZG9tLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9ldmVudENvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3BsYXllckZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXBCdWlsZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgKiBhcyBzaGlwQnVpbGRlciBmcm9tICcuL3NoaXBCdWlsZGVyJztcblxuLy8gUmFuZG9tIG1vdmUgKGF0dGFjaylcbmNvbnN0IGF1dG9BdHRhY2sgPSBhc3luYyAocGxheWVyKSA9PiB7XG4gIGxldCByYW5kb21Nb3ZlID0gaGVscGVycy5nZXRSYW5kb21UaWxlKCk7XG4gIHdoaWxlIChoZWxwZXJzLmFscmVhZHlQbGF5ZWQocGxheWVyLCByYW5kb21Nb3ZlKSkge1xuICAgIHJhbmRvbU1vdmUgPSBoZWxwZXJzLmdldFJhbmRvbVRpbGUoKTtcbiAgfVxuICBhd2FpdCBoZWxwZXJzLnRpbWVvdXQoNDAwKTtcbiAgcmV0dXJuIHJhbmRvbU1vdmU7XG59O1xuXG4vKiBSYW5kb20gc2hpcCBwbGFjZW1lbnQgKi9cbi8qIFJldHVybnMgYSByYW5kb20gc3RhcnRpbmdJbmRleCAmIGF4aXMgKHRvIHBsYWNlIGEgc2hpcCkgdGhhdCB3aWxsIGZpdCB3aXRoaW4gXG4gIDEweDEwIGJvYXJkICovXG5jb25zdCBnZXRWYWxpZFN0YXJ0ID0gKHBsYXllciwgbGVuZ3RoKSA9PiB7XG4gIGxldCBzdGFydEluZGV4O1xuICBsZXQgYXhpcztcbiAgbGV0IHNoaXBGaXRzID0gZmFsc2U7XG4gIHdoaWxlICghc2hpcEZpdHMpIHtcbiAgICBjb25zdCByYW5kb21JbmRleCA9IGhlbHBlcnMuZ2V0UmFuZG9tRW1wdHkocGxheWVyKTtcbiAgICBjb25zdCByYW5kb21BeGlzID0gaGVscGVycy5nZXRSYW5kb21BeGlzKCk7XG4gICAgc2hpcEZpdHMgPSBzaGlwQnVpbGRlci5kb2VzU2hpcEZpdChsZW5ndGgsIHJhbmRvbUF4aXMsIHJhbmRvbUluZGV4KTtcbiAgICBzdGFydEluZGV4ID0gcmFuZG9tSW5kZXg7XG4gICAgYXhpcyA9IHJhbmRvbUF4aXM7XG4gIH1cbiAgcmV0dXJuIFtzdGFydEluZGV4LCBheGlzXTtcbn07XG5cbi8qIEdlbmVyYXRlcyBhIHJhbmRvbSBzaGlwIHBvc2l0aW9uIHRoYXQgcGFzc2VzIGNoZWNrczpcbiAgMS4gc2hpcCBvZiBsZW5ndGggYSwgcGxhY2VkIG9uIGF4aXMgYiB3aWxsIGZpdCB3aXRoaW4gdGhlIDEweDEwIGJvYXJkXG4gIDIuIHNoaXAgZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFuIGFscmVhZHkgcGxhY2VkIHNoaXAgKi9cbmNvbnN0IHJhbmRvbVNoaXAgPSAocGxheWVyLCBsZW5ndGgpID0+IHtcbiAgbGV0IHN0YXJ0O1xuICBsZXQgYXhpcztcbiAgbGV0IHZhbGlkID0gZmFsc2U7XG4gIHdoaWxlICghdmFsaWQpIHtcbiAgICBjb25zdCBbcmFuZG9tSW5kZXgsIHJhbmRvbUF4aXNdID0gZ2V0VmFsaWRTdGFydChwbGF5ZXIsIGxlbmd0aCk7XG4gICAgY29uc3Qgc2hpcCA9IHNoaXBCdWlsZGVyLmJ1aWxkU2hpcChyYW5kb21JbmRleCwgcmFuZG9tQXhpcywgbGVuZ3RoKTtcbiAgICB2YWxpZCA9IHNoaXBCdWlsZGVyLm5vT3ZlcmxhcChzaGlwLCBwbGF5ZXIpO1xuICAgIHN0YXJ0ID0gcmFuZG9tSW5kZXg7XG4gICAgYXhpcyA9IHJhbmRvbUF4aXM7XG4gIH1cbiAgcmV0dXJuIFtzdGFydCwgYXhpc107XG59O1xuXG5jb25zdCBhdXRvUGxhY2UgPSAocGxheWVyLCBzaGlwc1NvRmFyID0gMCkgPT4ge1xuICBjb25zdCBzaGlwcyA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICBmb3IgKGxldCBpID0gc2hpcHNTb0ZhcjsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gc2hpcHNbaV07XG4gICAgY29uc3Qgc2hpcCA9IHJhbmRvbVNoaXAocGxheWVyLCBsZW5ndGgpO1xuICAgIHBsYXllci5ib2FyZC5wbGFjZVNoaXAobGVuZ3RoLCAuLi5zaGlwKTtcbiAgfVxufTtcblxuZXhwb3J0IHsgYXV0b0F0dGFjaywgYXV0b1BsYWNlIH07XG4iLCJjb25zdCBnYW1lYm9hcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkJyk7XG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcbmNvbnN0IGNvbUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbS1ib2FyZCcpO1xuY29uc3QgZ2FtZUluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ2FtZS1pbmZvJyk7XG5cbmNvbnN0IHVwZGF0ZVNoaXBDb3VudCA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbUJvYXJkO1xuICBjb25zdCBzaGlwQ291bnRlciA9IHRoaXNCb2FyZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICBjb25zdCBzaGlwc1JlbWFpbmluZyA9IHBsYXllci5ib2FyZC5zaGlwc1JlbWFpbmluZygpO1xuXG4gIHNoaXBDb3VudGVyLnRleHRDb250ZW50ID0gYFNoaXBzIHJlbWFpbmluZzogJHtzaGlwc1JlbWFpbmluZ31gO1xufTtcblxuY29uc3QgY3JlYXRlQm9hcmRzID0gKCkgPT4ge1xuICBnYW1lYm9hcmRzLmZvckVhY2goKGJvYXJkKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgY29uc3QgYm9hcmRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgYm9hcmRDZWxsLmNsYXNzTGlzdC5hZGQoJ2JvYXJkLWNlbGwnKTtcbiAgICAgICAgYm9hcmRDZWxsLmRhdGFzZXQueCA9IGo7XG4gICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnkgPSBpO1xuICAgICAgICBib2FyZC5hcHBlbmRDaGlsZChib2FyZENlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5jb25zdCByZW5kZXJTaGlwcyA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBwbGF5ZXIuaXNIdW1hbiA/IHBsYXllckJvYXJkIDogY29tQm9hcmQ7XG4gIGNvbnN0IHsgc2hpcHMgfSA9IHBsYXllci5ib2FyZDtcbiAgY29uc3QgY29vcmRzID0gc2hpcHMubWFwKChzaGlwKSA9PiBzaGlwLmNvb3Jkcyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvb3Jkc1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgW3gsIHldID0gW2Nvb3Jkc1tpXVtqXVswXSwgY29vcmRzW2ldW2pdWzFdXTtcbiAgICAgIGNvbnN0IHRoaXNDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihgW2RhdGEteD0nJHt4fSddW2RhdGEteT0nJHt5fSddYCk7XG4gICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgfVxuICB9XG4gIHVwZGF0ZVNoaXBDb3VudChwbGF5ZXIpO1xufTtcblxuY29uc3QgdXBkYXRlQm9hcmQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IHBsYXllci5pc0h1bWFuID8gcGxheWVyQm9hcmQgOiBjb21Cb2FyZDtcbiAgY29uc3QgeyBib2FyZCB9ID0gcGxheWVyO1xuICBjb25zdCB7IHRpbGVzIH0gPSBib2FyZDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgT2JqZWN0LmtleXModGlsZXNbaV0pLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB0aGlzVGlsZSA9IHRpbGVzW2ldW2pdO1xuICAgICAgY29uc3QgaGFzU2hpcCA9IGJvYXJkLmhhc1NoaXAoaSwgaik7XG4gICAgICBpZiAodGhpc1RpbGUuaGl0KSB7XG4gICAgICAgIGNvbnN0IHRoaXNDZWxsID0gdGhpc0JvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgYFtkYXRhLXg9JyR7aX0nXVtkYXRhLXk9JyR7an0nXWBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGhhc1NoaXApIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdXBkYXRlU2hpcENvdW50KHBsYXllcik7XG59O1xuXG5jb25zdCBzdHlsZUdhbWVPdmVyID0gKGJvb2wpID0+IHtcbiAgaWYgKGJvb2wpIHtcbiAgICBnYW1lYm9hcmRzLmZvckVhY2goKGJvYXJkKSA9PiBib2FyZC5jbGFzc0xpc3QuYWRkKCdnYW1lLW92ZXInKSk7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4gYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnZ2FtZS1vdmVyJykpO1xuICB9XG59O1xuXG5jb25zdCBjbGVhclVJID0gKC4uLnBsYXllcnMpID0+IHtcbiAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4ge1xuICAgIGNvbnN0IGNlbGxzID0gYm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ21pc3MnLCAnaGl0JywgJ3NoaXAnKTtcbiAgICB9KTtcbiAgfSk7XG4gIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB1cGRhdGVTaGlwQ291bnQocGxheWVyKSk7XG4gIHN0eWxlR2FtZU92ZXIoZmFsc2UpO1xufTtcblxuY29uc3QgYW5ub3VuY2VHYW1lT3ZlciA9ICh3aW5uZXIpID0+IHtcbiAgY29uc3Qgd2luTWVzc2FnZSA9XG4gICAgd2lubmVyLm51bSA9PT0gMVxuICAgICAgPyAnQ29uZ3JhdHVsYXRpb25zISBZb3Ugd2luISdcbiAgICAgIDogJ0dhbWUgb3ZlciAuLi4gQ29tcHV0ZXIgd2lucyEnO1xuXG4gIGdhbWVJbmZvLnRleHRDb250ZW50ID0gd2luTWVzc2FnZTtcbiAgc3R5bGVHYW1lT3Zlcih0cnVlKTtcbn07XG5cbmNvbnN0IGRpc2FibGVFdmVudHMgPSAoYm9vbCwgYm9hcmQpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gYm9hcmQgPT09ICdjb20nID8gY29tQm9hcmQgOiBwbGF5ZXJCb2FyZDtcbiAgaWYgKGJvb2wpIHtcbiAgICB0aGlzQm9hcmQuY2xhc3NMaXN0LmFkZCgnbm8tZXZlbnRzJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpc0JvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ25vLWV2ZW50cycpO1xuICB9XG59O1xuXG5jb25zdCB0b2dnbGVCdG5zID0gKGJ1dHRvbiwgc3RhdGUpID0+IHtcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnQtYnRuJyk7XG4gIGNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzdGFydC1idG4nKTtcblxuICBpZiAoYnV0dG9uID09PSAnc3RhcnQnKSB7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICBzdGFydEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGJ1dHRvbiA9PT0gJ3Jlc3RhcnQnKSB7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICByZXN0YXJ0QnRuLnRleHRDb250ZW50ID0gJ05ldyBnYW1lJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdGFydEJ0bi50ZXh0Q29udGVudCA9ICdSZXN0YXJ0JztcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHJlYWR5R2FtZSA9IChsZW5ndGgpID0+IHtcbiAgaWYgKGxlbmd0aCA9PT0gNSkge1xuICAgIHRvZ2dsZUJ0bnMoJ3N0YXJ0JywgZmFsc2UpO1xuICB9IGVsc2Uge1xuICAgIHRvZ2dsZUJ0bnMoJ3N0YXJ0JywgdHJ1ZSk7XG4gIH1cbn07XG5cbmNvbnN0IGRpc2FibGVCb2FyZEZ1bmNzID0gKGJvb2wpID0+IHtcbiAgY29uc3QgYm9hcmRGdW5jcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1mdW5jcycpO1xuICBpZiAoYm9vbCkge1xuICAgIGJvYXJkRnVuY3MuZm9yRWFjaCgoYnV0dG9uKSA9PiBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKSk7XG4gIH0gZWxzZSB7XG4gICAgYm9hcmRGdW5jcy5mb3JFYWNoKChidXR0b24pID0+IGJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpO1xuICB9XG59O1xuXG5leHBvcnQge1xuICBjcmVhdGVCb2FyZHMsXG4gIGNsZWFyVUksXG4gIHJlbmRlclNoaXBzLFxuICB1cGRhdGVCb2FyZCxcbiAgZGlzYWJsZUV2ZW50cyxcbiAgYW5ub3VuY2VHYW1lT3ZlcixcbiAgdG9nZ2xlQnRucyxcbiAgcmVhZHlHYW1lLFxuICBkaXNhYmxlQm9hcmRGdW5jcyxcbn07XG4iLCJpbXBvcnQgKiBhcyBnYW1lIGZyb20gJy4vZ2FtZSc7XG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgKiBhcyBzaGlwQnVpbGRlciBmcm9tICcuL3NoaXBCdWlsZGVyJztcblxuY29uc3QgaW5pdEJvYXJkRXZlbnRzID0gKCkgPT4ge1xuICBjb25zdCBjb21DZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjb20tYm9hcmQgLmJvYXJkLWNlbGwnKTtcbiAgY29tQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBoZWxwZXJzLmdldENlbGxJbmZvKGUudGFyZ2V0KTtcbiAgICAgIGdhbWUucmVjZWl2ZVBsYXllck1vdmUoY29vcmQpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbmNvbnN0IGluaXRHYW1lQnV0dG9ucyA9ICgpID0+IHtcbiAgY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXN0YXJ0LWJ0bicpO1xuICByZXN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5uZXdHYW1lKTtcblxuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdGFydC1idG4nKTtcbiAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLnN0YXJ0R2FtZSk7XG5cbiAgY29uc3QgYXV0b0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhdXRvLXNoaXAnKTtcbiAgYXV0b0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUuYXV0b1BsYWNlUGxheWVyKTtcblxuICBjb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm90YXRlJyk7XG4gIHJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNoaXBCdWlsZGVyLnN3aXRjaEF4aXMpO1xuXG4gIGNvbnN0IHVuZG9CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdW5kby1zaGlwJyk7XG4gIHVuZG9CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLnVuZG9TaGlwKTtcblxuICBjb25zdCByZXNldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXNldC1zaGlwJyk7XG4gIHJlc2V0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5uZXdHYW1lKTtcbn07XG5cbmNvbnN0IGluaXRTaGlwUGxhY2VtZW50ID0gKCkgPT4ge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcbiAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCBzaGlwc1BsYWNlZCA9IGdhbWUuZ2V0U2hpcHNQbGFjZWQoKTtcbiAgICBjb25zdCBuZXh0U2hpcCA9IGhlbHBlcnMubmV4dFNoaXBMZW5ndGgoc2hpcHNQbGFjZWQpO1xuICAgIHNoaXBCdWlsZGVyLnByZXZpZXdTaGlwKGUsIG5leHRTaGlwKTtcbiAgfSk7XG4gIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0Jywgc2hpcEJ1aWxkZXIuY2xlYXJQcmV2aWV3KTtcbiAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLnBsYWNlU2hpcCk7XG59O1xuXG5leHBvcnQgeyBpbml0Qm9hcmRFdmVudHMsIGluaXRHYW1lQnV0dG9ucywgaW5pdFNoaXBQbGFjZW1lbnQgfTtcbiIsImltcG9ydCBwbGF5ZXJGYWN0b3J5IGZyb20gJy4vcGxheWVyRmFjdG9yeSc7XG5pbXBvcnQgKiBhcyBkb20gZnJvbSAnLi9kb20nO1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgc2hpcEJ1aWxkZXIgZnJvbSAnLi9zaGlwQnVpbGRlcic7XG5pbXBvcnQgKiBhcyBib3RMb2dpYyBmcm9tICcuL2JvdExvZ2ljJztcblxuY29uc3QgcGxheWVycyA9IHtcbiAgcDE6IG51bGwsXG4gIGNvbTogbnVsbCxcbn07XG5cbmNvbnN0IGNoZWNrR2FtZVN0YXRlID0gKHBsYXllcikgPT4gcGxheWVyLmJvYXJkLmFsbFNoaXBzU3VuaygpO1xuXG5jb25zdCBuZXdHYW1lID0gKCkgPT4ge1xuICBwbGF5ZXJzLnAxID0gcGxheWVyRmFjdG9yeSgxLCB0cnVlKTtcbiAgcGxheWVycy5jb20gPSBwbGF5ZXJGYWN0b3J5KDIsIGZhbHNlKTtcblxuICBkb20uY2xlYXJVSShwbGF5ZXJzLnAxLCBwbGF5ZXJzLmNvbSk7XG4gIGRvbS50b2dnbGVCdG5zKCdzdGFydCcsIHRydWUpO1xuICBkb20udG9nZ2xlQnRucygncmVzdGFydCcsIGZhbHNlKTtcbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSwgJ2NvbScpO1xuICBkb20uZGlzYWJsZUV2ZW50cyhmYWxzZSwgJ3BsYXllcicpO1xuICBkb20uZGlzYWJsZUJvYXJkRnVuY3MoZmFsc2UpO1xufTtcblxuY29uc3Qgc3RhcnRHYW1lID0gKCkgPT4ge1xuICBib3RMb2dpYy5hdXRvUGxhY2UocGxheWVycy5jb20pO1xuICBkb20udG9nZ2xlQnRucygnc3RhcnQnLCB0cnVlKTtcbiAgZG9tLnVwZGF0ZUJvYXJkKHBsYXllcnMuY29tKTtcbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSwgJ3BsYXllcicpO1xuICBkb20uZGlzYWJsZUV2ZW50cyhmYWxzZSwgJ2NvbScpO1xuICBkb20uZGlzYWJsZUJvYXJkRnVuY3ModHJ1ZSk7XG59O1xuXG5jb25zdCBlbmRHYW1lID0gKHdpbm5lcikgPT4ge1xuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlLCAnY29tJyk7XG4gIGRvbS50b2dnbGVCdG5zKCdyZXN0YXJ0JywgdHJ1ZSk7XG4gIGRvbS5hbm5vdW5jZUdhbWVPdmVyKHdpbm5lcik7XG59O1xuXG5jb25zdCBwbGF5Q29tTW92ZSA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBjb25zdCBjb21BdHRhY2sgPSBhd2FpdCBib3RMb2dpYy5hdXRvQXR0YWNrKGNvbSk7XG5cbiAgY29tLm1ha2VNb3ZlKGNvbUF0dGFjaywgcDEuYm9hcmQpO1xuICBkb20udXBkYXRlQm9hcmQocDEpO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUocDEpO1xuICBpZiAod2luU3RhdGUpIHtcbiAgICBlbmRHYW1lKGNvbSk7XG4gIH0gZWxzZSB7XG4gICAgZG9tLmRpc2FibGVFdmVudHMoZmFsc2UsICdjb20nKTtcbiAgfVxufTtcblxuY29uc3QgcmVjZWl2ZVBsYXllck1vdmUgPSAoY29vcmQpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBpZiAoaGVscGVycy5hbHJlYWR5UGxheWVkKHAxLCBjb29yZCkpIHJldHVybjtcbiAgcDEubWFrZU1vdmUoY29vcmQsIGNvbS5ib2FyZCk7XG4gIGRvbS51cGRhdGVCb2FyZChjb20pO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUoY29tKTtcbiAgaWYgKHdpblN0YXRlKSB7XG4gICAgZW5kR2FtZShwMSk7XG4gIH0gZWxzZSB7XG4gICAgcGxheUNvbU1vdmUocDEsIGNvbSk7XG4gIH1cbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSwgJ2NvbScpO1xufTtcblxuY29uc3QgZ2V0U2hpcHNQbGFjZWQgPSAoKSA9PiBwbGF5ZXJzLnAxLmJvYXJkLnNoaXBzLmxlbmd0aDtcblxuY29uc3QgcGxhY2VTaGlwID0gKGUpID0+IHtcbiAgY29uc3QgeyBwMSB9ID0gcGxheWVycztcbiAgY29uc3Qgc2hpcHNQbGFjZWRTdGFydCA9IGdldFNoaXBzUGxhY2VkKCk7XG5cbiAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYm9hcmQnKSB8fCBzaGlwc1BsYWNlZFN0YXJ0ID49IDUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGFydEluZGV4ID0gaGVscGVycy5nZXRDZWxsSW5mbyhlLnRhcmdldCk7XG4gIGNvbnN0IG5leHRTaGlwID0gaGVscGVycy5uZXh0U2hpcExlbmd0aChzaGlwc1BsYWNlZFN0YXJ0KTtcbiAgY29uc3QgYXhpcyA9IHNoaXBCdWlsZGVyLmdldEF4aXMoKTtcbiAgY29uc3Qgc2hpcFZhbGlkID0gc2hpcEJ1aWxkZXIuaXNTaGlwVmFsaWQocDEsIHN0YXJ0SW5kZXgsIGF4aXMsIG5leHRTaGlwKTtcblxuICBpZiAoc2hpcFZhbGlkKSB7XG4gICAgcDEuYm9hcmQucGxhY2VTaGlwKG5leHRTaGlwLCBzdGFydEluZGV4LCBheGlzKTtcbiAgICBzaGlwQnVpbGRlci5jbGVhclByZXZpZXcoKTtcbiAgICBkb20ucmVuZGVyU2hpcHMocDEpO1xuXG4gICAgZG9tLnJlYWR5R2FtZShnZXRTaGlwc1BsYWNlZCgpKTtcbiAgfVxufTtcblxuY29uc3QgYXV0b1BsYWNlUGxheWVyID0gKCkgPT4ge1xuICBjb25zdCB7IHAxIH0gPSBwbGF5ZXJzO1xuICBjb25zdCBzaGlwc1BsYWNlZCA9IGdldFNoaXBzUGxhY2VkKCk7XG5cbiAgYm90TG9naWMuYXV0b1BsYWNlKHAxLCBzaGlwc1BsYWNlZCk7XG4gIGRvbS5yZW5kZXJTaGlwcyhwMSk7XG4gIGRvbS5yZWFkeUdhbWUoZ2V0U2hpcHNQbGFjZWQoKSk7XG59O1xuXG5jb25zdCB1bmRvU2hpcCA9ICgpID0+IHtcbiAgY29uc3QgeyBwMSB9ID0gcGxheWVycztcbiAgaWYgKHAxLmJvYXJkLnNoaXBzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICBwMS5ib2FyZC5yZW1vdmVMYXN0U2hpcCgpO1xuXG4gIGRvbS5jbGVhclVJKHAxKTtcbiAgZG9tLnJlbmRlclNoaXBzKHAxKTtcbiAgZG9tLnJlYWR5R2FtZShnZXRTaGlwc1BsYWNlZCgpKTtcbn07XG5cbmV4cG9ydCB7XG4gIG5ld0dhbWUsXG4gIHN0YXJ0R2FtZSxcbiAgcmVjZWl2ZVBsYXllck1vdmUsXG4gIHBsYWNlU2hpcCxcbiAgZ2V0U2hpcHNQbGFjZWQsXG4gIGF1dG9QbGFjZVBsYXllcixcbiAgdW5kb1NoaXAsXG59O1xuIiwiaW1wb3J0IHNoaXBGYWN0b3J5IGZyb20gJy4vc2hpcEZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnYW1lYm9hcmRGYWN0b3J5KCkge1xuICBjb25zdCBjcmVhdGVCb2FyZCA9ICgpID0+IHtcbiAgICBjb25zdCBnYW1lYm9hcmQgPSBuZXcgQXJyYXkoMTApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZ2FtZWJvYXJkW2ldID0ge307XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgZ2FtZWJvYXJkW2ldW2pdID0ge1xuICAgICAgICAgIGhpdDogZmFsc2UsXG4gICAgICAgICAgc2hpcElkOiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2FtZWJvYXJkO1xuICB9O1xuXG4gIGNvbnN0IHRpbGVzID0gY3JlYXRlQm9hcmQoKTtcblxuICBjb25zdCBzaGlwcyA9IFtdO1xuXG4gIGNvbnN0IG1hcFNoaXBJZCA9IChsZW5ndGgpID0+IHtcbiAgICBsZXQgaWQ7XG4gICAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICAgIGNhc2UgNTpcbiAgICAgICAgaWQgPSAwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgaWQgPSAxO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaWQgPSA0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaWQgPSBzaGlwcy5zb21lKChzaGlwKSA9PiBzaGlwLmlkID09PSAyKSA/IDMgOiAyO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIE5vIGRlZmF1bHRcbiAgICB9XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IChsZW5ndGgsIFt4LCB5XSwgYXhpcykgPT4ge1xuICAgIGNvbnN0IHNoaXBJZCA9IG1hcFNoaXBJZChsZW5ndGgpO1xuICAgIGNvbnN0IG5ld1NoaXAgPSBzaGlwRmFjdG9yeShzaGlwSWQsIGxlbmd0aCk7XG4gICAgc2hpcHMucHVzaChuZXdTaGlwKTtcbiAgICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgICAvLyBQbGFjZSBob3Jpem9udGFsbHlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBuZXdTaGlwLmNvb3Jkcy5wdXNoKFt4LCB5XSk7XG4gICAgICAgIHRpbGVzW3hdW3ldLnNoaXBJZCA9IG5ld1NoaXAuaWQ7XG4gICAgICAgIHggKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgICAgLy8gUGxhY2UgdmVydGljYWxseVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5ld1NoaXAuY29vcmRzLnB1c2goW3gsIHldKTtcbiAgICAgICAgdGlsZXNbeF1beV0uc2hpcElkID0gbmV3U2hpcC5pZDtcbiAgICAgICAgeSArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW1vdmVMYXN0U2hpcCA9ICgpID0+IHtcbiAgICBjb25zdCBbc2hpcF0gPSBzaGlwcy5zcGxpY2Uoc2hpcHMubGVuZ3RoIC0gMSwgMSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmNvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgW3gsIHldID0gc2hpcC5jb29yZHNbaV07XG4gICAgICB0aWxlc1t4XVt5XS5zaGlwSWQgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYXNTaGlwID0gKHgsIHkpID0+IHRpbGVzW3hdW3ldLnNoaXBJZCAhPT0gbnVsbDtcblxuICBjb25zdCBmaW5kU2hpcCA9IChpZCkgPT4ge1xuICAgIGxldCB0aGlzU2hpcDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2hpcHNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgIHRoaXNTaGlwID0gc2hpcHNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzU2hpcDtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKHRhcmdldCkgPT4ge1xuICAgIGNvbnN0IFt4LCB5XSA9IHRhcmdldDtcbiAgICBjb25zdCB0aGlzVGlsZSA9IHRpbGVzW3hdW3ldO1xuICAgIGlmICh0aGlzVGlsZS5oaXQpIHJldHVybjtcblxuICAgIGlmIChoYXNTaGlwKHgsIHkpKSB7XG4gICAgICBjb25zdCB0aGlzU2hpcCA9IGZpbmRTaGlwKHRoaXNUaWxlLnNoaXBJZCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXNTaGlwLmNvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpc1NoaXAuY29vcmRzW2ldLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSB0YXJnZXRbaW5kZXhdKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzU2hpcC5oZWFsdGhbaV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXNUaWxlLmhpdCA9IHRydWU7XG4gIH07XG5cbiAgY29uc3Qgc2hpcHNSZW1haW5pbmcgPSAoKSA9PiB7XG4gICAgY29uc3QgZmlsdGVyU2hpcHMgPSBzaGlwcy5maWx0ZXIoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkgPT09IGZhbHNlKTtcbiAgICByZXR1cm4gZmlsdGVyU2hpcHMubGVuZ3RoO1xuICB9O1xuXG4gIGNvbnN0IGFsbFNoaXBzU3VuayA9ICgpID0+IHtcbiAgICBjb25zdCBzdW5rU2hpcHMgPSBzaGlwc1JlbWFpbmluZygpO1xuICAgIHJldHVybiBzdW5rU2hpcHMgPT09IDA7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB0aWxlcyxcbiAgICBzaGlwcyxcbiAgICBwbGFjZVNoaXAsXG4gICAgaGFzU2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIHNoaXBzUmVtYWluaW5nLFxuICAgIGFsbFNoaXBzU3VuayxcbiAgICByZW1vdmVMYXN0U2hpcCxcbiAgfTtcbn1cbiIsImNvbnN0IGdldENlbGxJbmZvID0gKHRhcmdldCkgPT4ge1xuICByZXR1cm4gW051bWJlcih0YXJnZXQuZGF0YXNldC54KSwgTnVtYmVyKHRhcmdldC5kYXRhc2V0LnkpXTtcbn07XG5cbmNvbnN0IGFscmVhZHlQbGF5ZWQgPSAocGxheWVyLCB0YXJnZXQpID0+IHtcbiAgY29uc3QgcHJldmlvdXNNb3ZlcyA9IHBsYXllci5tb3ZlcztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aW91c01vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHByZXZpb3VzTW92ZXNbaV0uZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHRhcmdldFtpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgdGltZW91dCA9IChtcykgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKTtcbiAgfSk7XG59O1xuXG5jb25zdCBnZXRSYW5kb21UaWxlID0gKCkgPT4ge1xuICBjb25zdCByYW5kb20gPSBbXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLFxuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgXTtcbiAgcmV0dXJuIHJhbmRvbTtcbn07XG5cbmNvbnN0IGdldEVtcHR5VGlsZXMgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHsgYm9hcmQgfSA9IHBsYXllcjtcbiAgY29uc3QgeyB0aWxlcyB9ID0gYm9hcmQ7XG4gIGNvbnN0IGVtcHR5VGlsZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgT2JqZWN0LmtleXModGlsZXNbaV0pLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBoYXNTaGlwID0gYm9hcmQuaGFzU2hpcChpLCBqKTtcbiAgICAgIGlmICghaGFzU2hpcCkge1xuICAgICAgICBjb25zdCBjb29yZCA9IFtpLCBqXTtcbiAgICAgICAgZW1wdHlUaWxlcy5wdXNoKGNvb3JkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVtcHR5VGlsZXM7XG59O1xuXG5jb25zdCBnZXRSYW5kb21FbXB0eSA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgZW1wdHlUaWxlcyA9IGdldEVtcHR5VGlsZXMocGxheWVyKTtcblxuICByZXR1cm4gZW1wdHlUaWxlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBlbXB0eVRpbGVzLmxlbmd0aCldO1xufTtcblxuY29uc3QgbmV4dFNoaXBMZW5ndGggPSAobnVtU2hpcHNQbGFjZWQpID0+IHtcbiAgc3dpdGNoIChudW1TaGlwc1BsYWNlZCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiA1O1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiA0O1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiAyO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuY29uc3QgZ2V0UmFuZG9tQXhpcyA9ICgpID0+IFsneCcsICd5J11bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMildO1xuXG5leHBvcnQge1xuICBnZXRDZWxsSW5mbyxcbiAgYWxyZWFkeVBsYXllZCxcbiAgdGltZW91dCxcbiAgZ2V0UmFuZG9tVGlsZSxcbiAgZ2V0UmFuZG9tRW1wdHksXG4gIG5leHRTaGlwTGVuZ3RoLFxuICBnZXRSYW5kb21BeGlzLFxufTtcbiIsImltcG9ydCBnYW1lYm9hcmRGYWN0b3J5IGZyb20gJy4vZ2FtZWJvYXJkRmFjdG9yeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBsYXllckZhY3RvcnkobnVtLCBodW1hbikge1xuICBjb25zdCBnYW1lYm9hcmQgPSBnYW1lYm9hcmRGYWN0b3J5KCk7XG4gIGNvbnN0IG1vdmVzID0gW107XG4gIGNvbnN0IG1ha2VNb3ZlID0gKHRhcmdldCwgZW5lbXlCb2FyZCkgPT4ge1xuICAgIGVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayh0YXJnZXQpO1xuICAgIG1vdmVzLnB1c2godGFyZ2V0KTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGdldCBudW0oKSB7XG4gICAgICByZXR1cm4gbnVtO1xuICAgIH0sXG4gICAgZ2V0IGJvYXJkKCkge1xuICAgICAgcmV0dXJuIGdhbWVib2FyZDtcbiAgICB9LFxuICAgIGdldCBpc0h1bWFuKCkge1xuICAgICAgcmV0dXJuIGh1bWFuO1xuICAgIH0sXG4gICAgZ2V0IG1vdmVzKCkge1xuICAgICAgcmV0dXJuIG1vdmVzO1xuICAgIH0sXG4gICAgbWFrZU1vdmUsXG4gIH07XG59XG4iLCJpbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5cbmNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXllci1ib2FyZCcpO1xuXG4vLyBTaGlwIHJvdGF0aW9uIHdoZXJlIHggPSBwbGFjZSBob3Jpem9udGFsbHksIHkgPSBwbGFjZSB2ZXJ0aWNhbGx5XG5jb25zdCBheGVzID0ge1xuICB4OiB0cnVlLFxuICB5OiBmYWxzZSxcbn07XG5cbmNvbnN0IGdldEF4aXMgPSAoKSA9PiB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhheGVzKTtcbiAgcmV0dXJuIGtleXMuZmlsdGVyKChrZXkpID0+IGF4ZXNba2V5XSA9PT0gdHJ1ZSlbMF07XG59O1xuXG5jb25zdCBzd2l0Y2hBeGlzID0gKCkgPT4ge1xuICBheGVzLnggPSAhYXhlcy54O1xuICBheGVzLnkgPSAhYXhlcy54O1xufTtcblxuLy8gUmV0dXJucyBhcnJheSBvZiBbeCwgeV0gY29vcmRzIG9mIGEgc2hpcCBvZiBsZW5ndGgsIGJ1aWx0IG9uIGF4aXMsIGF0IHN0YXJ0IGluZGV4XG5jb25zdCBidWlsZFNoaXAgPSAoc3RhcnQsIGF4aXMsIGxlbmd0aCkgPT4ge1xuICBjb25zdCBbeCwgeV0gPSBzdGFydDtcbiAgY29uc3Qgc2hpcENvb3JkcyA9IFtdO1xuXG4gIGlmIChheGlzID09PSAneCcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBzaGlwQ29vcmRzLnB1c2goW2kgKyB4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHNoaXBDb29yZHMucHVzaChbeCwgaSArIHldKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc2hpcENvb3Jkcztcbn07XG5cbi8qIFZhbGlkIGNoZWNrcyBmb3Igc2hpcCBvYmplY3Qgb24gYm9hcmQgb2JqZWN0ICovXG4vLyAgQ2hlY2sgaWYgc2hpcCBvZiBsZW5ndGggJiBheGlzIGZpdHMgd2l0aGluIDEweDEwIGdhbWVib2FyZCBib3VuZGFyaWVzXG5jb25zdCBkb2VzU2hpcEZpdCA9IChsZW5ndGgsIGF4aXMsIHN0YXJ0SW5kZXgpID0+IHtcbiAgY29uc3QgW3gsIHldID0gc3RhcnRJbmRleDtcbiAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgIHJldHVybiB4ICsgbGVuZ3RoIC0gMSA8PSA5O1xuICB9XG4gIGlmIChheGlzID09PSAneScpIHtcbiAgICByZXR1cm4geSArIGxlbmd0aCAtIDEgPD0gOTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBDaGVja3Mgc2hpcCBkb2VzIG5vdCBvdmVybGFwIHdpdGggYW5vdGhlclxuY29uc3Qgbm9PdmVybGFwID0gKHNoaXAsIHBsYXllcikgPT4ge1xuICBjb25zdCB7IGJvYXJkIH0gPSBwbGF5ZXI7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IFt4LCB5XSA9IHNoaXBbaV07XG4gICAgaWYgKGJvYXJkLmhhc1NoaXAoeCwgeSkgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5jb25zdCBpc1NoaXBWYWxpZCA9IChwbGF5ZXIsIHN0YXJ0LCBheGlzLCBsZW5ndGgpID0+IHtcbiAgY29uc3Qgc2hpcEZpdHMgPSBkb2VzU2hpcEZpdChsZW5ndGgsIGF4aXMsIHN0YXJ0KTtcblxuICBpZiAoc2hpcEZpdHMpIHtcbiAgICBjb25zdCBzaGlwID0gYnVpbGRTaGlwKHN0YXJ0LCBheGlzLCBsZW5ndGgpO1xuICAgIGlmIChub092ZXJsYXAoc2hpcCwgcGxheWVyKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qIFByZXZpZXdpbmcgc2hpcCBwbGFjZW1lbnQgb24gRE9NICovXG5jb25zdCBpc1ByZXZpZXdWYWxpZCA9IChjb29yZHMsIGxlbmd0aCkgPT4ge1xuICBjb25zdCBpc1dpdGhpbkJvdW5kcyA9IGNvb3Jkcy5sZW5ndGggPT09IGxlbmd0aDtcbiAgY29uc3Qgbm9PdGhlclNoaXBzID0gY29vcmRzLmV2ZXJ5KFxuICAgIChjb29yZCkgPT4gIWNvb3JkLmNsYXNzTGlzdC5jb250YWlucygnc2hpcCcpXG4gICk7XG4gIHJldHVybiBpc1dpdGhpbkJvdW5kcyAmJiBub090aGVyU2hpcHM7XG59O1xuXG5jb25zdCBidWlsZFByZXZpZXcgPSAoc3RhcnQsIGxlbmd0aCwgYXhpcywgYm9hcmQpID0+IHtcbiAgY29uc3QgW3gsIHldID0gc3RhcnQ7XG4gIGNvbnN0IHNoaXBDb29yZHMgPSBbXTtcblxuICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgLy8gPjkgPSBvdXQgb2YgYm91bmRzXG4gICAgICBpZiAoaSArIHggPiA5KSBicmVhaztcbiAgICAgIGNvbnN0IG5leHRDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7aSArIHh9J11bZGF0YS15PScke3l9J11gXG4gICAgICApO1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKG5leHRDZWxsKTtcbiAgICB9XG4gIH1cblxuICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgLy8gPjkgPSBvdXQgb2YgYm91bmRzXG4gICAgICBpZiAoaSArIHkgPiA5KSBicmVhaztcblxuICAgICAgY29uc3QgbmV4dENlbGwgPSBib2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEteD0nJHt4fSddW2RhdGEteT0nJHtpICsgeX0nXWBcbiAgICAgICk7XG4gICAgICBzaGlwQ29vcmRzLnB1c2gobmV4dENlbGwpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzaGlwQ29vcmRzO1xufTtcblxuY29uc3QgcHJldmlld1NoaXAgPSAoZSwgbGVuZ3RoKSA9PiB7XG4gIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2JvYXJkJykgfHwgbGVuZ3RoID09PSBudWxsKSByZXR1cm47XG5cbiAgY29uc3Qgc3RhcnRpbmdJbmRleCA9IGhlbHBlcnMuZ2V0Q2VsbEluZm8oZS50YXJnZXQpO1xuICBjb25zdCBheGlzID0gZ2V0QXhpcygpO1xuICBjb25zdCBzaGlwQ29vcmRzID0gYnVpbGRQcmV2aWV3KHN0YXJ0aW5nSW5kZXgsIGxlbmd0aCwgYXhpcywgcGxheWVyQm9hcmQpO1xuICBjb25zdCB2YWxpZFByZXZpZXcgPSBpc1ByZXZpZXdWYWxpZChzaGlwQ29vcmRzLCBsZW5ndGgpO1xuXG4gIGlmICh2YWxpZFByZXZpZXcpIHtcbiAgICBzaGlwQ29vcmRzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcC1wcmV2aWV3JykpO1xuICB9IGVsc2Uge1xuICAgIHNoaXBDb29yZHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJykpO1xuICB9XG59O1xuXG5jb25zdCBjbGVhclByZXZpZXcgPSAoKSA9PiB7XG4gIGNvbnN0IGNlbGxzID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwLXByZXZpZXcnLCAnaW52YWxpZCcpKTtcbn07XG5cbmV4cG9ydCB7XG4gIGJ1aWxkU2hpcCxcbiAgbm9PdmVybGFwLFxuICBkb2VzU2hpcEZpdCxcbiAgZ2V0QXhpcyxcbiAgc3dpdGNoQXhpcyxcbiAgcHJldmlld1NoaXAsXG4gIGNsZWFyUHJldmlldyxcbiAgaXNTaGlwVmFsaWQsXG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2hpcEZhY3RvcnkoaWQsIGxlbmd0aCkge1xuICBjb25zdCBjcmVhdGVIZWFsdGggPSAoc2l6ZSkgPT4ge1xuICAgIGNvbnN0IGFycmF5ID0gWy4uLkFycmF5KHNpemUpLmtleXMoKV07XG4gICAgY29uc3QgaGVhbHRoID0gYXJyYXkucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgICBwcmV2W2N1cnJdID0gZmFsc2U7XG4gICAgICByZXR1cm4gcHJldjtcbiAgICB9LCB7fSk7XG4gICAgcmV0dXJuIGhlYWx0aDtcbiAgfTtcblxuICBjb25zdCBjb29yZHMgPSBbXTtcblxuICBjb25zdCBoZWFsdGggPSBjcmVhdGVIZWFsdGgobGVuZ3RoKTtcbiAgLy8gaGVhbHRoID0geyB3aGVyZSBib29sIHJlcHJlc2VudHMgaGl0L25vIGhpdFxuICAvLyAgIDA6IGZhbHNlLFxuICAvLyAgIDE6IGZhbHNlLFxuICAvLyAgIDI6IGZhbHNlLFxuICAvLyB9XG4gIGNvbnN0IGhpdCA9IChpbmRleCkgPT4ge1xuICAgIGhlYWx0aFtpbmRleF0gPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9ICgpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhoZWFsdGgpLmV2ZXJ5KChpbmRleCkgPT4gaW5kZXggPT09IHRydWUpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaWQsXG4gICAgbGVuZ3RoLFxuICAgIGhlYWx0aCxcbiAgICBjb29yZHMsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5pbXBvcnQgKiBhcyBnYW1lIGZyb20gJy4vbW9kdWxlcy9nYW1lJztcbmltcG9ydCAqIGFzIGRvbSBmcm9tICcuL21vZHVsZXMvZG9tJztcbmltcG9ydCAqIGFzIGV2ZW50Q29udHJvbGxlciBmcm9tICcuL21vZHVsZXMvZXZlbnRDb250cm9sbGVyJztcblxuZG9tLmNyZWF0ZUJvYXJkcygpO1xuZ2FtZS5uZXdHYW1lKCk7XG5cbmV2ZW50Q29udHJvbGxlci5pbml0Qm9hcmRFdmVudHMoKTtcbmV2ZW50Q29udHJvbGxlci5pbml0R2FtZUJ1dHRvbnMoKTtcbmV2ZW50Q29udHJvbGxlci5pbml0U2hpcFBsYWNlbWVudCgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9