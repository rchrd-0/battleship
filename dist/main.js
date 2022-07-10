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

  const shipKeys = Object.keys(ships);
  shipKeys.forEach((key) => {
    const ship = ships[key];
    const { id } = ship;
    const { coords } = ship;
    for (let i = 0; i < coords.length; i++) {
      const [x, y] = coords[i];
      const thisCell = board.querySelector(`[data-x='${x}'][data-y='${y}']`);
      thisCell.classList.add('ship');
      thisCell.dataset.shipId = id;
    }
  });
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
      cell.removeAttribute('data-ship-id');
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

const undoShip = () => {
  const { p1 } = players;
  if (p1.board.ships.length === 0) return;
  p1.board.removeLastShip();

  _dom__WEBPACK_IMPORTED_MODULE_1__.clearUI(p1);
  _dom__WEBPACK_IMPORTED_MODULE_1__.renderShips(p1);
  _dom__WEBPACK_IMPORTED_MODULE_1__.readyGame(getShipsPlaced());
};

const autoPlacePlayer = () => {
  const { p1 } = players;
  const shipsPlaced = getShipsPlaced();

  _botLogic__WEBPACK_IMPORTED_MODULE_4__.autoPlace(p1, shipsPlaced);
  _dom__WEBPACK_IMPORTED_MODULE_1__.renderShips(p1);
  _dom__WEBPACK_IMPORTED_MODULE_1__.readyGame(getShipsPlaced());

  if (shipsPlaced === 5) {
    for (let i = 0; i < 5; i++) {
      undoShip();
    }
    autoPlacePlayer();
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FDTnFCO0FBQ2tCO0FBQ0Y7QUFDd0I7O0FBRTdELHNEQUFnQjtBQUNoQixrREFBWTs7QUFFWixxRUFBK0I7QUFDL0IscUVBQStCO0FBQy9CLHVFQUFpQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzP2UzMjAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2JvdExvZ2ljLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2V2ZW50Q29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvaGVscGVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcEJ1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXBGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCAqIGFzIHNoaXBCdWlsZGVyIGZyb20gJy4vc2hpcEJ1aWxkZXInO1xuXG4vLyBSYW5kb20gbW92ZSAoYXR0YWNrKVxuY29uc3QgYXV0b0F0dGFjayA9IGFzeW5jIChwbGF5ZXIpID0+IHtcbiAgbGV0IHJhbmRvbU1vdmUgPSBoZWxwZXJzLmdldFJhbmRvbVRpbGUoKTtcbiAgd2hpbGUgKGhlbHBlcnMuYWxyZWFkeVBsYXllZChwbGF5ZXIsIHJhbmRvbU1vdmUpKSB7XG4gICAgcmFuZG9tTW92ZSA9IGhlbHBlcnMuZ2V0UmFuZG9tVGlsZSgpO1xuICB9XG4gIGF3YWl0IGhlbHBlcnMudGltZW91dCg0MDApO1xuICByZXR1cm4gcmFuZG9tTW92ZTtcbn07XG5cbi8qIFJhbmRvbSBzaGlwIHBsYWNlbWVudCAqL1xuLyogUmV0dXJucyBhIHJhbmRvbSBzdGFydGluZ0luZGV4ICYgYXhpcyAodG8gcGxhY2UgYSBzaGlwKSB0aGF0IHdpbGwgZml0IHdpdGhpbiBcbiAgMTB4MTAgYm9hcmQgKi9cbmNvbnN0IGdldFZhbGlkU3RhcnQgPSAocGxheWVyLCBsZW5ndGgpID0+IHtcbiAgbGV0IHN0YXJ0SW5kZXg7XG4gIGxldCBheGlzO1xuICBsZXQgc2hpcEZpdHMgPSBmYWxzZTtcbiAgd2hpbGUgKCFzaGlwRml0cykge1xuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gaGVscGVycy5nZXRSYW5kb21FbXB0eShwbGF5ZXIpO1xuICAgIGNvbnN0IHJhbmRvbUF4aXMgPSBoZWxwZXJzLmdldFJhbmRvbUF4aXMoKTtcbiAgICBzaGlwRml0cyA9IHNoaXBCdWlsZGVyLmRvZXNTaGlwRml0KGxlbmd0aCwgcmFuZG9tQXhpcywgcmFuZG9tSW5kZXgpO1xuICAgIHN0YXJ0SW5kZXggPSByYW5kb21JbmRleDtcbiAgICBheGlzID0gcmFuZG9tQXhpcztcbiAgfVxuICByZXR1cm4gW3N0YXJ0SW5kZXgsIGF4aXNdO1xufTtcblxuLyogR2VuZXJhdGVzIGEgcmFuZG9tIHNoaXAgcG9zaXRpb24gdGhhdCBwYXNzZXMgY2hlY2tzOlxuICAxLiBzaGlwIG9mIGxlbmd0aCBhLCBwbGFjZWQgb24gYXhpcyBiIHdpbGwgZml0IHdpdGhpbiB0aGUgMTB4MTAgYm9hcmRcbiAgMi4gc2hpcCBkb2VzIG5vdCBvdmVybGFwIHdpdGggYW4gYWxyZWFkeSBwbGFjZWQgc2hpcCAqL1xuY29uc3QgcmFuZG9tU2hpcCA9IChwbGF5ZXIsIGxlbmd0aCkgPT4ge1xuICBsZXQgc3RhcnQ7XG4gIGxldCBheGlzO1xuICBsZXQgdmFsaWQgPSBmYWxzZTtcbiAgd2hpbGUgKCF2YWxpZCkge1xuICAgIGNvbnN0IFtyYW5kb21JbmRleCwgcmFuZG9tQXhpc10gPSBnZXRWYWxpZFN0YXJ0KHBsYXllciwgbGVuZ3RoKTtcbiAgICBjb25zdCBzaGlwID0gc2hpcEJ1aWxkZXIuYnVpbGRTaGlwKHJhbmRvbUluZGV4LCByYW5kb21BeGlzLCBsZW5ndGgpO1xuICAgIHZhbGlkID0gc2hpcEJ1aWxkZXIubm9PdmVybGFwKHNoaXAsIHBsYXllcik7XG4gICAgc3RhcnQgPSByYW5kb21JbmRleDtcbiAgICBheGlzID0gcmFuZG9tQXhpcztcbiAgfVxuICByZXR1cm4gW3N0YXJ0LCBheGlzXTtcbn07XG5cbmNvbnN0IGF1dG9QbGFjZSA9IChwbGF5ZXIsIHNoaXBzU29GYXIgPSAwKSA9PiB7XG4gIGNvbnN0IHNoaXBzID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gIGZvciAobGV0IGkgPSBzaGlwc1NvRmFyOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBsZW5ndGggPSBzaGlwc1tpXTtcbiAgICBjb25zdCBzaGlwID0gcmFuZG9tU2hpcChwbGF5ZXIsIGxlbmd0aCk7XG4gICAgcGxheWVyLmJvYXJkLnBsYWNlU2hpcChsZW5ndGgsIC4uLnNoaXApO1xuICB9XG59O1xuXG5leHBvcnQgeyBhdXRvQXR0YWNrLCBhdXRvUGxhY2UgfTtcbiIsImNvbnN0IGdhbWVib2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQnKTtcbmNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXllci1ib2FyZCcpO1xuY29uc3QgY29tQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29tLWJvYXJkJyk7XG5jb25zdCBnYW1lSW5mbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lLWluZm8nKTtcblxuY29uc3QgdXBkYXRlU2hpcENvdW50ID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB0aGlzQm9hcmQgPSBwbGF5ZXIuaXNIdW1hbiA/IHBsYXllckJvYXJkIDogY29tQm9hcmQ7XG4gIGNvbnN0IHNoaXBDb3VudGVyID0gdGhpc0JvYXJkLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gIGNvbnN0IHNoaXBzUmVtYWluaW5nID0gcGxheWVyLmJvYXJkLnNoaXBzUmVtYWluaW5nKCk7XG5cbiAgc2hpcENvdW50ZXIudGV4dENvbnRlbnQgPSBgU2hpcHMgcmVtYWluaW5nOiAke3NoaXBzUmVtYWluaW5nfWA7XG59O1xuXG5jb25zdCBjcmVhdGVCb2FyZHMgPSAoKSA9PiB7XG4gIGdhbWVib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBjb25zdCBib2FyZENlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgXG4gICAgICAgIGJvYXJkQ2VsbC5jbGFzc0xpc3QuYWRkKCdib2FyZC1jZWxsJyk7XG4gICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnggPSBqO1xuICAgICAgICBib2FyZENlbGwuZGF0YXNldC55ID0gaTtcbiAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRDZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3QgcmVuZGVyU2hpcHMgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IGJvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbUJvYXJkO1xuICBjb25zdCB7IHNoaXBzIH0gPSBwbGF5ZXIuYm9hcmQ7XG5cbiAgY29uc3Qgc2hpcEtleXMgPSBPYmplY3Qua2V5cyhzaGlwcyk7XG4gIHNoaXBLZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBzaGlwc1trZXldO1xuICAgIGNvbnN0IHsgaWQgfSA9IHNoaXA7XG4gICAgY29uc3QgeyBjb29yZHMgfSA9IHNoaXA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IGNvb3Jkc1tpXTtcbiAgICAgIGNvbnN0IHRoaXNDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihgW2RhdGEteD0nJHt4fSddW2RhdGEteT0nJHt5fSddYCk7XG4gICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgICB0aGlzQ2VsbC5kYXRhc2V0LnNoaXBJZCA9IGlkO1xuICAgIH1cbiAgfSk7XG4gIHVwZGF0ZVNoaXBDb3VudChwbGF5ZXIpO1xufTtcblxuY29uc3QgdXBkYXRlQm9hcmQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IHBsYXllci5pc0h1bWFuID8gcGxheWVyQm9hcmQgOiBjb21Cb2FyZDtcbiAgY29uc3QgeyBib2FyZCB9ID0gcGxheWVyO1xuICBjb25zdCB7IHRpbGVzIH0gPSBib2FyZDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgT2JqZWN0LmtleXModGlsZXNbaV0pLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB0aGlzVGlsZSA9IHRpbGVzW2ldW2pdO1xuICAgICAgY29uc3QgaGFzU2hpcCA9IGJvYXJkLmhhc1NoaXAoaSwgaik7XG4gICAgICBpZiAodGhpc1RpbGUuaGl0KSB7XG4gICAgICAgIGNvbnN0IHRoaXNDZWxsID0gdGhpc0JvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgYFtkYXRhLXg9JyR7aX0nXVtkYXRhLXk9JyR7an0nXWBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGhhc1NoaXApIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdXBkYXRlU2hpcENvdW50KHBsYXllcik7XG59O1xuXG5jb25zdCBzdHlsZUdhbWVPdmVyID0gKGJvb2wpID0+IHtcbiAgaWYgKGJvb2wpIHtcbiAgICBnYW1lYm9hcmRzLmZvckVhY2goKGJvYXJkKSA9PiBib2FyZC5jbGFzc0xpc3QuYWRkKCdnYW1lLW92ZXInKSk7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4gYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnZ2FtZS1vdmVyJykpO1xuICB9XG59O1xuXG5jb25zdCBjbGVhclVJID0gKC4uLnBsYXllcnMpID0+IHtcbiAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4ge1xuICAgIGNvbnN0IGNlbGxzID0gYm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ21pc3MnLCAnaGl0JywgJ3NoaXAnKTtcbiAgICAgIGNlbGwucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNoaXAtaWQnKTtcbiAgICB9KTtcbiAgfSk7XG4gIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB1cGRhdGVTaGlwQ291bnQocGxheWVyKSk7XG4gIHN0eWxlR2FtZU92ZXIoZmFsc2UpO1xufTtcblxuY29uc3QgYW5ub3VuY2VHYW1lT3ZlciA9ICh3aW5uZXIpID0+IHtcbiAgY29uc3Qgd2luTWVzc2FnZSA9XG4gICAgd2lubmVyLm51bSA9PT0gMVxuICAgICAgPyAnQ29uZ3JhdHVsYXRpb25zISBZb3Ugd2luISdcbiAgICAgIDogJ0dhbWUgb3ZlciAuLi4gQ29tcHV0ZXIgd2lucyEnO1xuXG4gIGdhbWVJbmZvLnRleHRDb250ZW50ID0gd2luTWVzc2FnZTtcbiAgc3R5bGVHYW1lT3Zlcih0cnVlKTtcbn07XG5cbmNvbnN0IGRpc2FibGVFdmVudHMgPSAoYm9vbCwgYm9hcmQpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gYm9hcmQgPT09ICdjb20nID8gY29tQm9hcmQgOiBwbGF5ZXJCb2FyZDtcbiAgaWYgKGJvb2wpIHtcbiAgICB0aGlzQm9hcmQuY2xhc3NMaXN0LmFkZCgnbm8tZXZlbnRzJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpc0JvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ25vLWV2ZW50cycpO1xuICB9XG59O1xuXG5jb25zdCB0b2dnbGVCdG5zID0gKGJ1dHRvbiwgc3RhdGUpID0+IHtcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnQtYnRuJyk7XG4gIGNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzdGFydC1idG4nKTtcblxuICBpZiAoYnV0dG9uID09PSAnc3RhcnQnKSB7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICBzdGFydEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGJ1dHRvbiA9PT0gJ3Jlc3RhcnQnKSB7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICByZXN0YXJ0QnRuLnRleHRDb250ZW50ID0gJ05ldyBnYW1lJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdGFydEJ0bi50ZXh0Q29udGVudCA9ICdSZXN0YXJ0JztcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHJlYWR5R2FtZSA9IChsZW5ndGgpID0+IHtcbiAgaWYgKGxlbmd0aCA9PT0gNSkge1xuICAgIHRvZ2dsZUJ0bnMoJ3N0YXJ0JywgZmFsc2UpO1xuICB9IGVsc2Uge1xuICAgIHRvZ2dsZUJ0bnMoJ3N0YXJ0JywgdHJ1ZSk7XG4gIH1cbn07XG5cbmNvbnN0IGRpc2FibGVCb2FyZEZ1bmNzID0gKGJvb2wpID0+IHtcbiAgY29uc3QgYm9hcmRGdW5jcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1mdW5jcycpO1xuICBpZiAoYm9vbCkge1xuICAgIGJvYXJkRnVuY3MuZm9yRWFjaCgoYnV0dG9uKSA9PiBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKSk7XG4gIH0gZWxzZSB7XG4gICAgYm9hcmRGdW5jcy5mb3JFYWNoKChidXR0b24pID0+IGJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpO1xuICB9XG59O1xuXG5leHBvcnQge1xuICBjcmVhdGVCb2FyZHMsXG4gIGNsZWFyVUksXG4gIHJlbmRlclNoaXBzLFxuICB1cGRhdGVCb2FyZCxcbiAgZGlzYWJsZUV2ZW50cyxcbiAgYW5ub3VuY2VHYW1lT3ZlcixcbiAgdG9nZ2xlQnRucyxcbiAgcmVhZHlHYW1lLFxuICBkaXNhYmxlQm9hcmRGdW5jcyxcbn07XG4iLCJpbXBvcnQgKiBhcyBnYW1lIGZyb20gJy4vZ2FtZSc7XG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgKiBhcyBzaGlwQnVpbGRlciBmcm9tICcuL3NoaXBCdWlsZGVyJztcblxuY29uc3QgaW5pdEJvYXJkRXZlbnRzID0gKCkgPT4ge1xuICBjb25zdCBjb21DZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjb20tYm9hcmQgLmJvYXJkLWNlbGwnKTtcbiAgY29tQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBoZWxwZXJzLmdldENlbGxJbmZvKGUudGFyZ2V0KTtcbiAgICAgIGdhbWUucmVjZWl2ZVBsYXllck1vdmUoY29vcmQpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbmNvbnN0IGluaXRHYW1lQnV0dG9ucyA9ICgpID0+IHtcbiAgY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXN0YXJ0LWJ0bicpO1xuICByZXN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5uZXdHYW1lKTtcblxuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdGFydC1idG4nKTtcbiAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLnN0YXJ0R2FtZSk7XG5cbiAgY29uc3QgYXV0b0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhdXRvLXNoaXAnKTtcbiAgYXV0b0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUuYXV0b1BsYWNlUGxheWVyKTtcblxuICBjb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm90YXRlJyk7XG4gIHJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNoaXBCdWlsZGVyLnN3aXRjaEF4aXMpO1xuXG4gIGNvbnN0IHVuZG9CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdW5kby1zaGlwJyk7XG4gIHVuZG9CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLnVuZG9TaGlwKTtcblxuICBjb25zdCByZXNldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXNldC1zaGlwJyk7XG4gIHJlc2V0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5uZXdHYW1lKTtcbn07XG5cbmNvbnN0IGluaXRTaGlwUGxhY2VtZW50ID0gKCkgPT4ge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcbiAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCBzaGlwc1BsYWNlZCA9IGdhbWUuZ2V0U2hpcHNQbGFjZWQoKTtcbiAgICBjb25zdCBuZXh0U2hpcCA9IGhlbHBlcnMubmV4dFNoaXBMZW5ndGgoc2hpcHNQbGFjZWQpO1xuICAgIHNoaXBCdWlsZGVyLnByZXZpZXdTaGlwKGUsIG5leHRTaGlwKTtcbiAgfSk7XG4gIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0Jywgc2hpcEJ1aWxkZXIuY2xlYXJQcmV2aWV3KTtcbiAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLnBsYWNlU2hpcCk7XG59O1xuXG5leHBvcnQgeyBpbml0Qm9hcmRFdmVudHMsIGluaXRHYW1lQnV0dG9ucywgaW5pdFNoaXBQbGFjZW1lbnQgfTtcbiIsImltcG9ydCBwbGF5ZXJGYWN0b3J5IGZyb20gJy4vcGxheWVyRmFjdG9yeSc7XG5pbXBvcnQgKiBhcyBkb20gZnJvbSAnLi9kb20nO1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgc2hpcEJ1aWxkZXIgZnJvbSAnLi9zaGlwQnVpbGRlcic7XG5pbXBvcnQgKiBhcyBib3RMb2dpYyBmcm9tICcuL2JvdExvZ2ljJztcblxuY29uc3QgcGxheWVycyA9IHtcbiAgcDE6IG51bGwsXG4gIGNvbTogbnVsbCxcbn07XG5cbmNvbnN0IGNoZWNrR2FtZVN0YXRlID0gKHBsYXllcikgPT4gcGxheWVyLmJvYXJkLmFsbFNoaXBzU3VuaygpO1xuXG5jb25zdCBuZXdHYW1lID0gKCkgPT4ge1xuICBwbGF5ZXJzLnAxID0gcGxheWVyRmFjdG9yeSgxLCB0cnVlKTtcbiAgcGxheWVycy5jb20gPSBwbGF5ZXJGYWN0b3J5KDIsIGZhbHNlKTtcblxuICBkb20uY2xlYXJVSShwbGF5ZXJzLnAxLCBwbGF5ZXJzLmNvbSk7XG4gIGRvbS50b2dnbGVCdG5zKCdzdGFydCcsIHRydWUpO1xuICBkb20udG9nZ2xlQnRucygncmVzdGFydCcsIGZhbHNlKTtcbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSwgJ2NvbScpO1xuICBkb20uZGlzYWJsZUV2ZW50cyhmYWxzZSwgJ3BsYXllcicpO1xuICBkb20uZGlzYWJsZUJvYXJkRnVuY3MoZmFsc2UpO1xufTtcblxuY29uc3Qgc3RhcnRHYW1lID0gKCkgPT4ge1xuICBib3RMb2dpYy5hdXRvUGxhY2UocGxheWVycy5jb20pO1xuICBkb20udG9nZ2xlQnRucygnc3RhcnQnLCB0cnVlKTtcbiAgZG9tLnVwZGF0ZUJvYXJkKHBsYXllcnMuY29tKTtcbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSwgJ3BsYXllcicpO1xuICBkb20uZGlzYWJsZUV2ZW50cyhmYWxzZSwgJ2NvbScpO1xuICBkb20uZGlzYWJsZUJvYXJkRnVuY3ModHJ1ZSk7XG59O1xuXG5jb25zdCBlbmRHYW1lID0gKHdpbm5lcikgPT4ge1xuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlLCAnY29tJyk7XG4gIGRvbS50b2dnbGVCdG5zKCdyZXN0YXJ0JywgdHJ1ZSk7XG4gIGRvbS5hbm5vdW5jZUdhbWVPdmVyKHdpbm5lcik7XG59O1xuXG5jb25zdCBwbGF5Q29tTW92ZSA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBjb25zdCBjb21BdHRhY2sgPSBhd2FpdCBib3RMb2dpYy5hdXRvQXR0YWNrKGNvbSk7XG5cbiAgY29tLm1ha2VNb3ZlKGNvbUF0dGFjaywgcDEuYm9hcmQpO1xuICBkb20udXBkYXRlQm9hcmQocDEpO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUocDEpO1xuICBpZiAod2luU3RhdGUpIHtcbiAgICBlbmRHYW1lKGNvbSk7XG4gIH0gZWxzZSB7XG4gICAgZG9tLmRpc2FibGVFdmVudHMoZmFsc2UsICdjb20nKTtcbiAgfVxufTtcblxuY29uc3QgcmVjZWl2ZVBsYXllck1vdmUgPSAoY29vcmQpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBpZiAoaGVscGVycy5hbHJlYWR5UGxheWVkKHAxLCBjb29yZCkpIHJldHVybjtcbiAgcDEubWFrZU1vdmUoY29vcmQsIGNvbS5ib2FyZCk7XG4gIGRvbS51cGRhdGVCb2FyZChjb20pO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUoY29tKTtcbiAgaWYgKHdpblN0YXRlKSB7XG4gICAgZW5kR2FtZShwMSk7XG4gIH0gZWxzZSB7XG4gICAgcGxheUNvbU1vdmUocDEsIGNvbSk7XG4gIH1cbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSwgJ2NvbScpO1xufTtcblxuY29uc3QgZ2V0U2hpcHNQbGFjZWQgPSAoKSA9PiBwbGF5ZXJzLnAxLmJvYXJkLnNoaXBzLmxlbmd0aDtcblxuY29uc3QgcGxhY2VTaGlwID0gKGUpID0+IHtcbiAgY29uc3QgeyBwMSB9ID0gcGxheWVycztcbiAgY29uc3Qgc2hpcHNQbGFjZWRTdGFydCA9IGdldFNoaXBzUGxhY2VkKCk7XG5cbiAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYm9hcmQnKSB8fCBzaGlwc1BsYWNlZFN0YXJ0ID49IDUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGFydEluZGV4ID0gaGVscGVycy5nZXRDZWxsSW5mbyhlLnRhcmdldCk7XG4gIGNvbnN0IG5leHRTaGlwID0gaGVscGVycy5uZXh0U2hpcExlbmd0aChzaGlwc1BsYWNlZFN0YXJ0KTtcbiAgY29uc3QgYXhpcyA9IHNoaXBCdWlsZGVyLmdldEF4aXMoKTtcbiAgY29uc3Qgc2hpcFZhbGlkID0gc2hpcEJ1aWxkZXIuaXNTaGlwVmFsaWQocDEsIHN0YXJ0SW5kZXgsIGF4aXMsIG5leHRTaGlwKTtcblxuICBpZiAoc2hpcFZhbGlkKSB7XG4gICAgcDEuYm9hcmQucGxhY2VTaGlwKG5leHRTaGlwLCBzdGFydEluZGV4LCBheGlzKTtcbiAgICBzaGlwQnVpbGRlci5jbGVhclByZXZpZXcoKTtcbiAgICBkb20ucmVuZGVyU2hpcHMocDEpO1xuXG4gICAgZG9tLnJlYWR5R2FtZShnZXRTaGlwc1BsYWNlZCgpKTtcbiAgfVxufTtcblxuY29uc3QgdW5kb1NoaXAgPSAoKSA9PiB7XG4gIGNvbnN0IHsgcDEgfSA9IHBsYXllcnM7XG4gIGlmIChwMS5ib2FyZC5zaGlwcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgcDEuYm9hcmQucmVtb3ZlTGFzdFNoaXAoKTtcblxuICBkb20uY2xlYXJVSShwMSk7XG4gIGRvbS5yZW5kZXJTaGlwcyhwMSk7XG4gIGRvbS5yZWFkeUdhbWUoZ2V0U2hpcHNQbGFjZWQoKSk7XG59O1xuXG5jb25zdCBhdXRvUGxhY2VQbGF5ZXIgPSAoKSA9PiB7XG4gIGNvbnN0IHsgcDEgfSA9IHBsYXllcnM7XG4gIGNvbnN0IHNoaXBzUGxhY2VkID0gZ2V0U2hpcHNQbGFjZWQoKTtcblxuICBib3RMb2dpYy5hdXRvUGxhY2UocDEsIHNoaXBzUGxhY2VkKTtcbiAgZG9tLnJlbmRlclNoaXBzKHAxKTtcbiAgZG9tLnJlYWR5R2FtZShnZXRTaGlwc1BsYWNlZCgpKTtcblxuICBpZiAoc2hpcHNQbGFjZWQgPT09IDUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgdW5kb1NoaXAoKTtcbiAgICB9XG4gICAgYXV0b1BsYWNlUGxheWVyKCk7XG4gIH1cbn07XG5cblxuXG5leHBvcnQge1xuICBuZXdHYW1lLFxuICBzdGFydEdhbWUsXG4gIHJlY2VpdmVQbGF5ZXJNb3ZlLFxuICBwbGFjZVNoaXAsXG4gIGdldFNoaXBzUGxhY2VkLFxuICBhdXRvUGxhY2VQbGF5ZXIsXG4gIHVuZG9TaGlwLFxufTtcbiIsImltcG9ydCBzaGlwRmFjdG9yeSBmcm9tICcuL3NoaXBGYWN0b3J5JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2FtZWJvYXJkRmFjdG9yeSgpIHtcbiAgY29uc3QgY3JlYXRlQm9hcmQgPSAoKSA9PiB7XG4gICAgY29uc3QgZ2FtZWJvYXJkID0gbmV3IEFycmF5KDEwKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIGdhbWVib2FyZFtpXSA9IHt9O1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIGdhbWVib2FyZFtpXVtqXSA9IHtcbiAgICAgICAgICBoaXQ6IGZhbHNlLFxuICAgICAgICAgIHNoaXBJZDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdhbWVib2FyZDtcbiAgfTtcblxuICBjb25zdCB0aWxlcyA9IGNyZWF0ZUJvYXJkKCk7XG5cbiAgY29uc3Qgc2hpcHMgPSBbXTtcblxuICBjb25zdCBtYXBTaGlwSWQgPSAobGVuZ3RoKSA9PiB7XG4gICAgbGV0IGlkO1xuICAgIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgICBjYXNlIDU6XG4gICAgICAgIGlkID0gMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIGlkID0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGlkID0gNDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGlkID0gc2hpcHMuc29tZSgoc2hpcCkgPT4gc2hpcC5pZCA9PT0gMikgPyAzIDogMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBObyBkZWZhdWx0XG4gICAgfVxuICAgIHJldHVybiBpZDtcbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAobGVuZ3RoLCBbeCwgeV0sIGF4aXMpID0+IHtcbiAgICBjb25zdCBzaGlwSWQgPSBtYXBTaGlwSWQobGVuZ3RoKTtcbiAgICBjb25zdCBuZXdTaGlwID0gc2hpcEZhY3Rvcnkoc2hpcElkLCBsZW5ndGgpO1xuICAgIHNoaXBzLnB1c2gobmV3U2hpcCk7XG4gICAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgICAgLy8gUGxhY2UgaG9yaXpvbnRhbGx5XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1NoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmV3U2hpcC5jb29yZHMucHVzaChbeCwgeV0pO1xuICAgICAgICB0aWxlc1t4XVt5XS5zaGlwSWQgPSBuZXdTaGlwLmlkO1xuICAgICAgICB4ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChheGlzID09PSAneScpIHtcbiAgICAgIC8vIFBsYWNlIHZlcnRpY2FsbHlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBuZXdTaGlwLmNvb3Jkcy5wdXNoKFt4LCB5XSk7XG4gICAgICAgIHRpbGVzW3hdW3ldLnNoaXBJZCA9IG5ld1NoaXAuaWQ7XG4gICAgICAgIHkgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlTGFzdFNoaXAgPSAoKSA9PiB7XG4gICAgY29uc3QgW3NoaXBdID0gc2hpcHMuc3BsaWNlKHNoaXBzLmxlbmd0aCAtIDEsIDEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5jb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IHNoaXAuY29vcmRzW2ldO1xuICAgICAgdGlsZXNbeF1beV0uc2hpcElkID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFzU2hpcCA9ICh4LCB5KSA9PiB0aWxlc1t4XVt5XS5zaGlwSWQgIT09IG51bGw7XG5cbiAgY29uc3QgZmluZFNoaXAgPSAoaWQpID0+IHtcbiAgICBsZXQgdGhpc1NoaXA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNoaXBzW2ldLmlkID09PSBpZCkge1xuICAgICAgICB0aGlzU2hpcCA9IHNoaXBzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1NoaXA7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9ICh0YXJnZXQpID0+IHtcbiAgICBjb25zdCBbeCwgeV0gPSB0YXJnZXQ7XG4gICAgY29uc3QgdGhpc1RpbGUgPSB0aWxlc1t4XVt5XTtcbiAgICBpZiAodGhpc1RpbGUuaGl0KSByZXR1cm47XG5cbiAgICBpZiAoaGFzU2hpcCh4LCB5KSkge1xuICAgICAgY29uc3QgdGhpc1NoaXAgPSBmaW5kU2hpcCh0aGlzVGlsZS5zaGlwSWQpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzU2hpcC5jb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXNTaGlwLmNvb3Jkc1tpXS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZSA9PT0gdGFyZ2V0W2luZGV4XSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpc1NoaXAuaGVhbHRoW2ldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzVGlsZS5oaXQgPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHNoaXBzUmVtYWluaW5nID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpbHRlclNoaXBzID0gc2hpcHMuZmlsdGVyKChzaGlwKSA9PiBzaGlwLmlzU3VuaygpID09PSBmYWxzZSk7XG4gICAgcmV0dXJuIGZpbHRlclNoaXBzLmxlbmd0aDtcbiAgfTtcblxuICBjb25zdCBhbGxTaGlwc1N1bmsgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3Vua1NoaXBzID0gc2hpcHNSZW1haW5pbmcoKTtcbiAgICByZXR1cm4gc3Vua1NoaXBzID09PSAwO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdGlsZXMsXG4gICAgc2hpcHMsXG4gICAgcGxhY2VTaGlwLFxuICAgIGhhc1NoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBzaGlwc1JlbWFpbmluZyxcbiAgICBhbGxTaGlwc1N1bmssXG4gICAgcmVtb3ZlTGFzdFNoaXAsXG4gIH07XG59XG4iLCJjb25zdCBnZXRDZWxsSW5mbyA9ICh0YXJnZXQpID0+IHtcbiAgcmV0dXJuIFtOdW1iZXIodGFyZ2V0LmRhdGFzZXQueCksIE51bWJlcih0YXJnZXQuZGF0YXNldC55KV07XG59O1xuXG5jb25zdCBhbHJlYWR5UGxheWVkID0gKHBsYXllciwgdGFyZ2V0KSA9PiB7XG4gIGNvbnN0IHByZXZpb3VzTW92ZXMgPSBwbGF5ZXIubW92ZXM7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNNb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwcmV2aW91c01vdmVzW2ldLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSB0YXJnZXRbaW5kZXhdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IHRpbWVvdXQgPSAobXMpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XG4gIH0pO1xufTtcblxuY29uc3QgZ2V0UmFuZG9tVGlsZSA9ICgpID0+IHtcbiAgY29uc3QgcmFuZG9tID0gW1xuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gIF07XG4gIHJldHVybiByYW5kb207XG59O1xuXG5jb25zdCBnZXRFbXB0eVRpbGVzID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB7IGJvYXJkIH0gPSBwbGF5ZXI7XG4gIGNvbnN0IHsgdGlsZXMgfSA9IGJvYXJkO1xuICBjb25zdCBlbXB0eVRpbGVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IE9iamVjdC5rZXlzKHRpbGVzW2ldKS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgaGFzU2hpcCA9IGJvYXJkLmhhc1NoaXAoaSwgaik7XG4gICAgICBpZiAoIWhhc1NoaXApIHtcbiAgICAgICAgY29uc3QgY29vcmQgPSBbaSwgal07XG4gICAgICAgIGVtcHR5VGlsZXMucHVzaChjb29yZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBlbXB0eVRpbGVzO1xufTtcblxuY29uc3QgZ2V0UmFuZG9tRW1wdHkgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IGVtcHR5VGlsZXMgPSBnZXRFbXB0eVRpbGVzKHBsYXllcik7XG5cbiAgcmV0dXJuIGVtcHR5VGlsZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZW1wdHlUaWxlcy5sZW5ndGgpXTtcbn07XG5cbmNvbnN0IG5leHRTaGlwTGVuZ3RoID0gKG51bVNoaXBzUGxhY2VkKSA9PiB7XG4gIHN3aXRjaCAobnVtU2hpcHNQbGFjZWQpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gNTtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gNDtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gMztcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gMztcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gMjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbmNvbnN0IGdldFJhbmRvbUF4aXMgPSAoKSA9PiBbJ3gnLCAneSddW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpXTtcblxuZXhwb3J0IHtcbiAgZ2V0Q2VsbEluZm8sXG4gIGFscmVhZHlQbGF5ZWQsXG4gIHRpbWVvdXQsXG4gIGdldFJhbmRvbVRpbGUsXG4gIGdldFJhbmRvbUVtcHR5LFxuICBuZXh0U2hpcExlbmd0aCxcbiAgZ2V0UmFuZG9tQXhpcyxcbn07XG4iLCJpbXBvcnQgZ2FtZWJvYXJkRmFjdG9yeSBmcm9tICcuL2dhbWVib2FyZEZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbGF5ZXJGYWN0b3J5KG51bSwgaHVtYW4pIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZWJvYXJkRmFjdG9yeSgpO1xuICBjb25zdCBtb3ZlcyA9IFtdO1xuICBjb25zdCBtYWtlTW92ZSA9ICh0YXJnZXQsIGVuZW15Qm9hcmQpID0+IHtcbiAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2sodGFyZ2V0KTtcbiAgICBtb3Zlcy5wdXNoKHRhcmdldCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgbnVtKCkge1xuICAgICAgcmV0dXJuIG51bTtcbiAgICB9LFxuICAgIGdldCBib2FyZCgpIHtcbiAgICAgIHJldHVybiBnYW1lYm9hcmQ7XG4gICAgfSxcbiAgICBnZXQgaXNIdW1hbigpIHtcbiAgICAgIHJldHVybiBodW1hbjtcbiAgICB9LFxuICAgIGdldCBtb3ZlcygpIHtcbiAgICAgIHJldHVybiBtb3ZlcztcbiAgICB9LFxuICAgIG1ha2VNb3ZlLFxuICB9O1xufVxuIiwiaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuXG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcblxuLy8gU2hpcCByb3RhdGlvbiB3aGVyZSB4ID0gcGxhY2UgaG9yaXpvbnRhbGx5LCB5ID0gcGxhY2UgdmVydGljYWxseVxuY29uc3QgYXhlcyA9IHtcbiAgeDogdHJ1ZSxcbiAgeTogZmFsc2UsXG59O1xuXG5jb25zdCBnZXRBeGlzID0gKCkgPT4ge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYXhlcyk7XG4gIHJldHVybiBrZXlzLmZpbHRlcigoa2V5KSA9PiBheGVzW2tleV0gPT09IHRydWUpWzBdO1xufTtcblxuY29uc3Qgc3dpdGNoQXhpcyA9ICgpID0+IHtcbiAgYXhlcy54ID0gIWF4ZXMueDtcbiAgYXhlcy55ID0gIWF4ZXMueDtcbn07XG5cbi8vIFJldHVybnMgYXJyYXkgb2YgW3gsIHldIGNvb3JkcyBvZiBhIHNoaXAgb2YgbGVuZ3RoLCBidWlsdCBvbiBheGlzLCBhdCBzdGFydCBpbmRleFxuY29uc3QgYnVpbGRTaGlwID0gKHN0YXJ0LCBheGlzLCBsZW5ndGgpID0+IHtcbiAgY29uc3QgW3gsIHldID0gc3RhcnQ7XG4gIGNvbnN0IHNoaXBDb29yZHMgPSBbXTtcblxuICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKFtpICsgeCwgeV0pO1xuICAgIH1cbiAgfVxuXG4gIGlmIChheGlzID09PSAneScpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBzaGlwQ29vcmRzLnB1c2goW3gsIGkgKyB5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNoaXBDb29yZHM7XG59O1xuXG4vKiBWYWxpZCBjaGVja3MgZm9yIHNoaXAgb2JqZWN0IG9uIGJvYXJkIG9iamVjdCAqL1xuLy8gIENoZWNrIGlmIHNoaXAgb2YgbGVuZ3RoICYgYXhpcyBmaXRzIHdpdGhpbiAxMHgxMCBnYW1lYm9hcmQgYm91bmRhcmllc1xuY29uc3QgZG9lc1NoaXBGaXQgPSAobGVuZ3RoLCBheGlzLCBzdGFydEluZGV4KSA9PiB7XG4gIGNvbnN0IFt4LCB5XSA9IHN0YXJ0SW5kZXg7XG4gIGlmIChheGlzID09PSAneCcpIHtcbiAgICByZXR1cm4geCArIGxlbmd0aCAtIDEgPD0gOTtcbiAgfVxuICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgcmV0dXJuIHkgKyBsZW5ndGggLSAxIDw9IDk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gQ2hlY2tzIHNoaXAgZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFub3RoZXJcbmNvbnN0IG5vT3ZlcmxhcCA9IChzaGlwLCBwbGF5ZXIpID0+IHtcbiAgY29uc3QgeyBib2FyZCB9ID0gcGxheWVyO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBbeCwgeV0gPSBzaGlwW2ldO1xuICAgIGlmIChib2FyZC5oYXNTaGlwKHgsIHkpID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuY29uc3QgaXNTaGlwVmFsaWQgPSAocGxheWVyLCBzdGFydCwgYXhpcywgbGVuZ3RoKSA9PiB7XG4gIGNvbnN0IHNoaXBGaXRzID0gZG9lc1NoaXBGaXQobGVuZ3RoLCBheGlzLCBzdGFydCk7XG5cbiAgaWYgKHNoaXBGaXRzKSB7XG4gICAgY29uc3Qgc2hpcCA9IGJ1aWxkU2hpcChzdGFydCwgYXhpcywgbGVuZ3RoKTtcbiAgICBpZiAobm9PdmVybGFwKHNoaXAsIHBsYXllcikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKiBQcmV2aWV3aW5nIHNoaXAgcGxhY2VtZW50IG9uIERPTSAqL1xuY29uc3QgaXNQcmV2aWV3VmFsaWQgPSAoY29vcmRzLCBsZW5ndGgpID0+IHtcbiAgY29uc3QgaXNXaXRoaW5Cb3VuZHMgPSBjb29yZHMubGVuZ3RoID09PSBsZW5ndGg7XG4gIGNvbnN0IG5vT3RoZXJTaGlwcyA9IGNvb3Jkcy5ldmVyeShcbiAgICAoY29vcmQpID0+ICFjb29yZC5jbGFzc0xpc3QuY29udGFpbnMoJ3NoaXAnKVxuICApO1xuICByZXR1cm4gaXNXaXRoaW5Cb3VuZHMgJiYgbm9PdGhlclNoaXBzO1xufTtcblxuY29uc3QgYnVpbGRQcmV2aWV3ID0gKHN0YXJ0LCBsZW5ndGgsIGF4aXMsIGJvYXJkKSA9PiB7XG4gIGNvbnN0IFt4LCB5XSA9IHN0YXJ0O1xuICBjb25zdCBzaGlwQ29vcmRzID0gW107XG5cbiAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vID45ID0gb3V0IG9mIGJvdW5kc1xuICAgICAgaWYgKGkgKyB4ID4gOSkgYnJlYWs7XG4gICAgICBjb25zdCBuZXh0Q2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS14PScke2kgKyB4fSddW2RhdGEteT0nJHt5fSddYFxuICAgICAgKTtcbiAgICAgIHNoaXBDb29yZHMucHVzaChuZXh0Q2VsbCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vID45ID0gb3V0IG9mIGJvdW5kc1xuICAgICAgaWYgKGkgKyB5ID4gOSkgYnJlYWs7XG5cbiAgICAgIGNvbnN0IG5leHRDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7eH0nXVtkYXRhLXk9JyR7aSArIHl9J11gXG4gICAgICApO1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKG5leHRDZWxsKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc2hpcENvb3Jkcztcbn07XG5cbmNvbnN0IHByZXZpZXdTaGlwID0gKGUsIGxlbmd0aCkgPT4ge1xuICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdib2FyZCcpIHx8IGxlbmd0aCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gIGNvbnN0IHN0YXJ0aW5nSW5kZXggPSBoZWxwZXJzLmdldENlbGxJbmZvKGUudGFyZ2V0KTtcbiAgY29uc3QgYXhpcyA9IGdldEF4aXMoKTtcbiAgY29uc3Qgc2hpcENvb3JkcyA9IGJ1aWxkUHJldmlldyhzdGFydGluZ0luZGV4LCBsZW5ndGgsIGF4aXMsIHBsYXllckJvYXJkKTtcbiAgY29uc3QgdmFsaWRQcmV2aWV3ID0gaXNQcmV2aWV3VmFsaWQoc2hpcENvb3JkcywgbGVuZ3RoKTtcblxuICBpZiAodmFsaWRQcmV2aWV3KSB7XG4gICAgc2hpcENvb3Jkcy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAtcHJldmlldycpKTtcbiAgfSBlbHNlIHtcbiAgICBzaGlwQ29vcmRzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgnaW52YWxpZCcpKTtcbiAgfVxufTtcblxuY29uc3QgY2xlYXJQcmV2aWV3ID0gKCkgPT4ge1xuICBjb25zdCBjZWxscyA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnc2hpcC1wcmV2aWV3JywgJ2ludmFsaWQnKSk7XG59O1xuXG5leHBvcnQge1xuICBidWlsZFNoaXAsXG4gIG5vT3ZlcmxhcCxcbiAgZG9lc1NoaXBGaXQsXG4gIGdldEF4aXMsXG4gIHN3aXRjaEF4aXMsXG4gIHByZXZpZXdTaGlwLFxuICBjbGVhclByZXZpZXcsXG4gIGlzU2hpcFZhbGlkLFxufTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNoaXBGYWN0b3J5KGlkLCBsZW5ndGgpIHtcbiAgY29uc3QgY3JlYXRlSGVhbHRoID0gKHNpemUpID0+IHtcbiAgICBjb25zdCBhcnJheSA9IFsuLi5BcnJheShzaXplKS5rZXlzKCldO1xuICAgIGNvbnN0IGhlYWx0aCA9IGFycmF5LnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgcHJldltjdXJyXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwge30pO1xuICAgIHJldHVybiBoZWFsdGg7XG4gIH07XG5cbiAgY29uc3QgY29vcmRzID0gW107XG5cbiAgY29uc3QgaGVhbHRoID0gY3JlYXRlSGVhbHRoKGxlbmd0aCk7XG4gIC8vIGhlYWx0aCA9IHsgd2hlcmUgYm9vbCByZXByZXNlbnRzIGhpdC9ubyBoaXRcbiAgLy8gICAwOiBmYWxzZSxcbiAgLy8gICAxOiBmYWxzZSxcbiAgLy8gICAyOiBmYWxzZSxcbiAgLy8gfVxuICBjb25zdCBoaXQgPSAoaW5kZXgpID0+IHtcbiAgICBoZWFsdGhbaW5kZXhdID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoaGVhbHRoKS5ldmVyeSgoaW5kZXgpID0+IGluZGV4ID09PSB0cnVlKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIGxlbmd0aCxcbiAgICBoZWFsdGgsXG4gICAgY29vcmRzLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gIH07XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9zdHlsZS5jc3MnO1xuaW1wb3J0ICogYXMgZ2FtZSBmcm9tICcuL21vZHVsZXMvZ2FtZSc7XG5pbXBvcnQgKiBhcyBkb20gZnJvbSAnLi9tb2R1bGVzL2RvbSc7XG5pbXBvcnQgKiBhcyBldmVudENvbnRyb2xsZXIgZnJvbSAnLi9tb2R1bGVzL2V2ZW50Q29udHJvbGxlcic7XG5cbmRvbS5jcmVhdGVCb2FyZHMoKTtcbmdhbWUubmV3R2FtZSgpO1xuXG5ldmVudENvbnRyb2xsZXIuaW5pdEJvYXJkRXZlbnRzKCk7XG5ldmVudENvbnRyb2xsZXIuaW5pdEdhbWVCdXR0b25zKCk7XG5ldmVudENvbnRyb2xsZXIuaW5pdFNoaXBQbGFjZW1lbnQoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==