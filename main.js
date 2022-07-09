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

  const rotateBtn = document.querySelector('#rotate-ship');
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
};

const startGame = () => {
  _botLogic__WEBPACK_IMPORTED_MODULE_4__.autoPlace(players.com);
  _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('start', true);
  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(players.com);
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'player');
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'com');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFlBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE1BQU0sYUFBYSxFQUFFO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixFQUFFLGFBQWEsTUFBTTtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsd0JBQXdCLGlEQUFtQjtBQUMzQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBV0U7Ozs7Ozs7Ozs7Ozs7OztBQ2pKYTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNsQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ05xQjtBQUNrQjtBQUNGO0FBQ3dCOztBQUU3RCxzREFBZ0I7QUFDaEIsa0RBQVk7O0FBRVoscUVBQStCO0FBQy9CLHFFQUErQjtBQUMvQix1RUFBaUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvYm90TG9naWMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZXZlbnRDb250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lYm9hcmRGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9oZWxwZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXJGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgc2hpcEJ1aWxkZXIgZnJvbSAnLi9zaGlwQnVpbGRlcic7XG5cbi8vIFJhbmRvbSBtb3ZlIChhdHRhY2spXG5jb25zdCBhdXRvQXR0YWNrID0gYXN5bmMgKHBsYXllcikgPT4ge1xuICBsZXQgcmFuZG9tTW92ZSA9IGhlbHBlcnMuZ2V0UmFuZG9tVGlsZSgpO1xuICB3aGlsZSAoaGVscGVycy5hbHJlYWR5UGxheWVkKHBsYXllciwgcmFuZG9tTW92ZSkpIHtcbiAgICByYW5kb21Nb3ZlID0gaGVscGVycy5nZXRSYW5kb21UaWxlKCk7XG4gIH1cbiAgYXdhaXQgaGVscGVycy50aW1lb3V0KDQwMCk7XG4gIHJldHVybiByYW5kb21Nb3ZlO1xufTtcblxuLyogUmFuZG9tIHNoaXAgcGxhY2VtZW50ICovXG4vKiBSZXR1cm5zIGEgcmFuZG9tIHN0YXJ0aW5nSW5kZXggJiBheGlzICh0byBwbGFjZSBhIHNoaXApIHRoYXQgd2lsbCBmaXQgd2l0aGluIFxuICAxMHgxMCBib2FyZCAqL1xuY29uc3QgZ2V0VmFsaWRTdGFydCA9IChwbGF5ZXIsIGxlbmd0aCkgPT4ge1xuICBsZXQgc3RhcnRJbmRleDtcbiAgbGV0IGF4aXM7XG4gIGxldCBzaGlwRml0cyA9IGZhbHNlO1xuICB3aGlsZSAoIXNoaXBGaXRzKSB7XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBoZWxwZXJzLmdldFJhbmRvbUVtcHR5KHBsYXllcik7XG4gICAgY29uc3QgcmFuZG9tQXhpcyA9IGhlbHBlcnMuZ2V0UmFuZG9tQXhpcygpO1xuICAgIHNoaXBGaXRzID0gc2hpcEJ1aWxkZXIuZG9lc1NoaXBGaXQobGVuZ3RoLCByYW5kb21BeGlzLCByYW5kb21JbmRleCk7XG4gICAgc3RhcnRJbmRleCA9IHJhbmRvbUluZGV4O1xuICAgIGF4aXMgPSByYW5kb21BeGlzO1xuICB9XG4gIHJldHVybiBbc3RhcnRJbmRleCwgYXhpc107XG59O1xuXG4vKiBHZW5lcmF0ZXMgYSByYW5kb20gc2hpcCBwb3NpdGlvbiB0aGF0IHBhc3NlcyBjaGVja3M6XG4gIDEuIHNoaXAgb2YgbGVuZ3RoIGEsIHBsYWNlZCBvbiBheGlzIGIgd2lsbCBmaXQgd2l0aGluIHRoZSAxMHgxMCBib2FyZFxuICAyLiBzaGlwIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbiBhbHJlYWR5IHBsYWNlZCBzaGlwICovXG5jb25zdCByYW5kb21TaGlwID0gKHBsYXllciwgbGVuZ3RoKSA9PiB7XG4gIGxldCBzdGFydDtcbiAgbGV0IGF4aXM7XG4gIGxldCB2YWxpZCA9IGZhbHNlO1xuICB3aGlsZSAoIXZhbGlkKSB7XG4gICAgY29uc3QgW3JhbmRvbUluZGV4LCByYW5kb21BeGlzXSA9IGdldFZhbGlkU3RhcnQocGxheWVyLCBsZW5ndGgpO1xuICAgIGNvbnN0IHNoaXAgPSBzaGlwQnVpbGRlci5idWlsZFNoaXAocmFuZG9tSW5kZXgsIHJhbmRvbUF4aXMsIGxlbmd0aCk7XG4gICAgdmFsaWQgPSBzaGlwQnVpbGRlci5ub092ZXJsYXAoc2hpcCwgcGxheWVyKTtcbiAgICBzdGFydCA9IHJhbmRvbUluZGV4O1xuICAgIGF4aXMgPSByYW5kb21BeGlzO1xuICB9XG4gIHJldHVybiBbc3RhcnQsIGF4aXNdO1xufTtcblxuY29uc3QgYXV0b1BsYWNlID0gKHBsYXllciwgc2hpcHNTb0ZhciA9IDApID0+IHtcbiAgY29uc3Qgc2hpcHMgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgZm9yIChsZXQgaSA9IHNoaXBzU29GYXI7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGxlbmd0aCA9IHNoaXBzW2ldO1xuICAgIGNvbnN0IHNoaXAgPSByYW5kb21TaGlwKHBsYXllciwgbGVuZ3RoKTtcbiAgICBwbGF5ZXIuYm9hcmQucGxhY2VTaGlwKGxlbmd0aCwgLi4uc2hpcCk7XG4gIH1cbn07XG5cbmV4cG9ydCB7IGF1dG9BdHRhY2ssIGF1dG9QbGFjZSB9O1xuIiwiY29uc3QgZ2FtZWJvYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZCcpO1xuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyLWJvYXJkJyk7XG5jb25zdCBjb21Cb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb20tYm9hcmQnKTtcbmNvbnN0IGdhbWVJbmZvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhbWUtaW5mbycpO1xuXG5jb25zdCB1cGRhdGVTaGlwQ291bnQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IHBsYXllci5pc0h1bWFuID8gcGxheWVyQm9hcmQgOiBjb21Cb2FyZDtcbiAgY29uc3Qgc2hpcENvdW50ZXIgPSB0aGlzQm9hcmQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgY29uc3Qgc2hpcHNSZW1haW5pbmcgPSBwbGF5ZXIuYm9hcmQuc2hpcHNSZW1haW5pbmcoKTtcblxuICBzaGlwQ291bnRlci50ZXh0Q29udGVudCA9IGBTaGlwcyByZW1haW5pbmc6ICR7c2hpcHNSZW1haW5pbmd9YDtcbn07XG5cbmNvbnN0IGNyZWF0ZUJvYXJkcyA9ICgpID0+IHtcbiAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGJvYXJkQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIGJvYXJkQ2VsbC5jbGFzc0xpc3QuYWRkKCdib2FyZC1jZWxsJyk7XG4gICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnggPSBqO1xuICAgICAgICBib2FyZENlbGwuZGF0YXNldC55ID0gaTtcbiAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRDZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3QgcmVuZGVyU2hpcHMgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IGJvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbUJvYXJkO1xuICBjb25zdCB7IHNoaXBzIH0gPSBwbGF5ZXIuYm9hcmQ7XG4gIGNvbnN0IGNvb3JkcyA9IHNoaXBzLm1hcCgoc2hpcCkgPT4gc2hpcC5jb29yZHMpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb29yZHNbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IFtjb29yZHNbaV1bal1bMF0sIGNvb3Jkc1tpXVtqXVsxXV07XG4gICAgICBjb25zdCB0aGlzQ2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXg9JyR7eH0nXVtkYXRhLXk9JyR7eX0nXWApO1xuICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgIH1cbiAgfVxuICB1cGRhdGVTaGlwQ291bnQocGxheWVyKTtcbn07XG5cbmNvbnN0IHVwZGF0ZUJvYXJkID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB0aGlzQm9hcmQgPSBwbGF5ZXIuaXNIdW1hbiA/IHBsYXllckJvYXJkIDogY29tQm9hcmQ7XG4gIGNvbnN0IHsgYm9hcmQgfSA9IHBsYXllcjtcbiAgY29uc3QgeyB0aWxlcyB9ID0gYm9hcmQ7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IE9iamVjdC5rZXlzKHRpbGVzW2ldKS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdGhpc1RpbGUgPSB0aWxlc1tpXVtqXTtcbiAgICAgIGNvbnN0IGhhc1NoaXAgPSBib2FyZC5oYXNTaGlwKGksIGopO1xuICAgICAgaWYgKHRoaXNUaWxlLmhpdCkge1xuICAgICAgICBjb25zdCB0aGlzQ2VsbCA9IHRoaXNCb2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGBbZGF0YS14PScke2l9J11bZGF0YS15PScke2p9J11gXG4gICAgICAgICk7XG4gICAgICAgIGlmIChoYXNTaGlwKSB7XG4gICAgICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHVwZGF0ZVNoaXBDb3VudChwbGF5ZXIpO1xufTtcblxuY29uc3Qgc3R5bGVHYW1lT3ZlciA9IChib29sKSA9PiB7XG4gIGlmIChib29sKSB7XG4gICAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4gYm9hcmQuY2xhc3NMaXN0LmFkZCgnZ2FtZS1vdmVyJykpO1xuICB9IGVsc2Uge1xuICAgIGdhbWVib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IGJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ2dhbWUtb3ZlcicpKTtcbiAgfVxufTtcblxuY29uc3QgY2xlYXJVSSA9ICguLi5wbGF5ZXJzKSA9PiB7XG4gIGdhbWVib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IHtcbiAgICBjb25zdCBjZWxscyA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdtaXNzJywgJ2hpdCcsICdzaGlwJyk7XG4gICAgfSk7XG4gIH0pO1xuICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4gdXBkYXRlU2hpcENvdW50KHBsYXllcikpO1xuICBzdHlsZUdhbWVPdmVyKGZhbHNlKTtcbn07XG5cbmNvbnN0IGFubm91bmNlR2FtZU92ZXIgPSAod2lubmVyKSA9PiB7XG4gIGNvbnN0IHdpbk1lc3NhZ2UgPVxuICAgIHdpbm5lci5udW0gPT09IDFcbiAgICAgID8gJ0NvbmdyYXR1bGF0aW9ucyEgWW91IHdpbiEnXG4gICAgICA6ICdHYW1lIG92ZXIgLi4uIENvbXB1dGVyIHdpbnMhJztcblxuICBnYW1lSW5mby50ZXh0Q29udGVudCA9IHdpbk1lc3NhZ2U7XG4gIHN0eWxlR2FtZU92ZXIodHJ1ZSk7XG59O1xuXG5jb25zdCBkaXNhYmxlRXZlbnRzID0gKGJvb2wsIGJvYXJkKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IGJvYXJkID09PSAnY29tJyA/IGNvbUJvYXJkIDogcGxheWVyQm9hcmQ7XG4gIGlmIChib29sKSB7XG4gICAgdGhpc0JvYXJkLmNsYXNzTGlzdC5hZGQoJ25vLWV2ZW50cycpO1xuICB9IGVsc2Uge1xuICAgIHRoaXNCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKCduby1ldmVudHMnKTtcbiAgfVxufTtcblxuY29uc3QgdG9nZ2xlQnRucyA9IChidXR0b24sIHN0YXRlKSA9PiB7XG4gIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0YXJ0LWJ0bicpO1xuICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc3RhcnQtYnRuJyk7XG5cbiAgaWYgKGJ1dHRvbiA9PT0gJ3N0YXJ0Jykge1xuICAgIGlmIChzdGF0ZSkge1xuICAgICAgc3RhcnRCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRCdG4ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChidXR0b24gPT09ICdyZXN0YXJ0Jykge1xuICAgIGlmIChzdGF0ZSkge1xuICAgICAgcmVzdGFydEJ0bi50ZXh0Q29udGVudCA9ICdOZXcgZ2FtZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3RhcnRCdG4udGV4dENvbnRlbnQgPSAnUmVzdGFydCc7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCByZWFkeUdhbWUgPSAobGVuZ3RoKSA9PiB7XG4gIGlmIChsZW5ndGggPT09IDUpIHtcbiAgICB0b2dnbGVCdG5zKCdzdGFydCcsIGZhbHNlKTtcbiAgfSBlbHNlIHtcbiAgICB0b2dnbGVCdG5zKCdzdGFydCcsIHRydWUpO1xuICB9XG59O1xuXG5leHBvcnQge1xuICBjcmVhdGVCb2FyZHMsXG4gIGNsZWFyVUksXG4gIHJlbmRlclNoaXBzLFxuICB1cGRhdGVCb2FyZCxcbiAgZGlzYWJsZUV2ZW50cyxcbiAgYW5ub3VuY2VHYW1lT3ZlcixcbiAgdG9nZ2xlQnRucyxcbiAgcmVhZHlHYW1lLFxufTtcbiIsImltcG9ydCAqIGFzIGdhbWUgZnJvbSAnLi9nYW1lJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCAqIGFzIHNoaXBCdWlsZGVyIGZyb20gJy4vc2hpcEJ1aWxkZXInO1xuXG5jb25zdCBpbml0Qm9hcmRFdmVudHMgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbUNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2NvbS1ib2FyZCAuYm9hcmQtY2VsbCcpO1xuICBjb21DZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGhlbHBlcnMuZ2V0Q2VsbEluZm8oZS50YXJnZXQpO1xuICAgICAgZ2FtZS5yZWNlaXZlUGxheWVyTW92ZShjb29yZCk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuY29uc3QgaW5pdEdhbWVCdXR0b25zID0gKCkgPT4ge1xuICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc3RhcnQtYnRuJyk7XG4gIHJlc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLm5ld0dhbWUpO1xuXG4gIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0YXJ0LWJ0bicpO1xuICBzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUuc3RhcnRHYW1lKTtcblxuICBjb25zdCBhdXRvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2F1dG8tc2hpcCcpO1xuICBhdXRvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5hdXRvUGxhY2VQbGF5ZXIpO1xuXG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb3RhdGUtc2hpcCcpO1xuICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzaGlwQnVpbGRlci5zd2l0Y2hBeGlzKTtcblxuICBjb25zdCB1bmRvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VuZG8tc2hpcCcpO1xuICB1bmRvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS51bmRvU2hpcCk7XG5cbiAgY29uc3QgcmVzZXRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzZXQtc2hpcCcpO1xuICByZXNldEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUubmV3R2FtZSk7XG59O1xuXG5jb25zdCBpbml0U2hpcFBsYWNlbWVudCA9ICgpID0+IHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyLWJvYXJkJyk7XG4gIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgY29uc3Qgc2hpcHNQbGFjZWQgPSBnYW1lLmdldFNoaXBzUGxhY2VkKCk7XG4gICAgY29uc3QgbmV4dFNoaXAgPSBoZWxwZXJzLm5leHRTaGlwTGVuZ3RoKHNoaXBzUGxhY2VkKTtcbiAgICBzaGlwQnVpbGRlci5wcmV2aWV3U2hpcChlLCBuZXh0U2hpcCk7XG4gIH0pO1xuICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHNoaXBCdWlsZGVyLmNsZWFyUHJldmlldyk7XG4gIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5wbGFjZVNoaXApO1xufTtcblxuZXhwb3J0IHsgaW5pdEJvYXJkRXZlbnRzLCBpbml0R2FtZUJ1dHRvbnMsIGluaXRTaGlwUGxhY2VtZW50IH07XG4iLCJpbXBvcnQgcGxheWVyRmFjdG9yeSBmcm9tICcuL3BsYXllckZhY3RvcnknO1xuaW1wb3J0ICogYXMgZG9tIGZyb20gJy4vZG9tJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCAqIGFzIHNoaXBCdWlsZGVyIGZyb20gJy4vc2hpcEJ1aWxkZXInO1xuaW1wb3J0ICogYXMgYm90TG9naWMgZnJvbSAnLi9ib3RMb2dpYyc7XG5cbmNvbnN0IHBsYXllcnMgPSB7XG4gIHAxOiBudWxsLFxuICBjb206IG51bGwsXG59O1xuXG5jb25zdCBjaGVja0dhbWVTdGF0ZSA9IChwbGF5ZXIpID0+IHBsYXllci5ib2FyZC5hbGxTaGlwc1N1bmsoKTtcblxuY29uc3QgbmV3R2FtZSA9ICgpID0+IHtcbiAgcGxheWVycy5wMSA9IHBsYXllckZhY3RvcnkoMSwgdHJ1ZSk7XG4gIHBsYXllcnMuY29tID0gcGxheWVyRmFjdG9yeSgyLCBmYWxzZSk7XG5cbiAgZG9tLmNsZWFyVUkocGxheWVycy5wMSwgcGxheWVycy5jb20pO1xuICBkb20udG9nZ2xlQnRucygnc3RhcnQnLCB0cnVlKTtcbiAgZG9tLnRvZ2dsZUJ0bnMoJ3Jlc3RhcnQnLCBmYWxzZSk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUsICdjb20nKTtcbiAgZG9tLmRpc2FibGVFdmVudHMoZmFsc2UsICdwbGF5ZXInKTtcbn07XG5cbmNvbnN0IHN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgYm90TG9naWMuYXV0b1BsYWNlKHBsYXllcnMuY29tKTtcbiAgZG9tLnRvZ2dsZUJ0bnMoJ3N0YXJ0JywgdHJ1ZSk7XG4gIGRvbS51cGRhdGVCb2FyZChwbGF5ZXJzLmNvbSk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUsICdwbGF5ZXInKTtcbiAgZG9tLmRpc2FibGVFdmVudHMoZmFsc2UsICdjb20nKTtcbn07XG5cbmNvbnN0IGVuZEdhbWUgPSAod2lubmVyKSA9PiB7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUsICdjb20nKTtcbiAgZG9tLnRvZ2dsZUJ0bnMoJ3Jlc3RhcnQnLCB0cnVlKTtcbiAgZG9tLmFubm91bmNlR2FtZU92ZXIod2lubmVyKTtcbn07XG5cbmNvbnN0IHBsYXlDb21Nb3ZlID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCB7IHAxLCBjb20gfSA9IHBsYXllcnM7XG4gIGNvbnN0IGNvbUF0dGFjayA9IGF3YWl0IGJvdExvZ2ljLmF1dG9BdHRhY2soY29tKTtcblxuICBjb20ubWFrZU1vdmUoY29tQXR0YWNrLCBwMS5ib2FyZCk7XG4gIGRvbS51cGRhdGVCb2FyZChwMSk7XG5cbiAgY29uc3Qgd2luU3RhdGUgPSBjaGVja0dhbWVTdGF0ZShwMSk7XG4gIGlmICh3aW5TdGF0ZSkge1xuICAgIGVuZEdhbWUoY29tKTtcbiAgfSBlbHNlIHtcbiAgICBkb20uZGlzYWJsZUV2ZW50cyhmYWxzZSwgJ2NvbScpO1xuICB9XG59O1xuXG5jb25zdCByZWNlaXZlUGxheWVyTW92ZSA9IChjb29yZCkgPT4ge1xuICBjb25zdCB7IHAxLCBjb20gfSA9IHBsYXllcnM7XG4gIGlmIChoZWxwZXJzLmFscmVhZHlQbGF5ZWQocDEsIGNvb3JkKSkgcmV0dXJuO1xuICBwMS5tYWtlTW92ZShjb29yZCwgY29tLmJvYXJkKTtcbiAgZG9tLnVwZGF0ZUJvYXJkKGNvbSk7XG5cbiAgY29uc3Qgd2luU3RhdGUgPSBjaGVja0dhbWVTdGF0ZShjb20pO1xuICBpZiAod2luU3RhdGUpIHtcbiAgICBlbmRHYW1lKHAxKTtcbiAgfSBlbHNlIHtcbiAgICBwbGF5Q29tTW92ZShwMSwgY29tKTtcbiAgfVxuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlLCAnY29tJyk7XG59O1xuXG5jb25zdCBnZXRTaGlwc1BsYWNlZCA9ICgpID0+IHBsYXllcnMucDEuYm9hcmQuc2hpcHMubGVuZ3RoO1xuXG5jb25zdCBwbGFjZVNoaXAgPSAoZSkgPT4ge1xuICBjb25zdCB7IHAxIH0gPSBwbGF5ZXJzO1xuICBjb25zdCBzaGlwc1BsYWNlZFN0YXJ0ID0gZ2V0U2hpcHNQbGFjZWQoKTtcblxuICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdib2FyZCcpIHx8IHNoaXBzUGxhY2VkU3RhcnQgPj0gNSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0SW5kZXggPSBoZWxwZXJzLmdldENlbGxJbmZvKGUudGFyZ2V0KTtcbiAgY29uc3QgbmV4dFNoaXAgPSBoZWxwZXJzLm5leHRTaGlwTGVuZ3RoKHNoaXBzUGxhY2VkU3RhcnQpO1xuICBjb25zdCBheGlzID0gc2hpcEJ1aWxkZXIuZ2V0QXhpcygpO1xuICBjb25zdCBzaGlwVmFsaWQgPSBzaGlwQnVpbGRlci5pc1NoaXBWYWxpZChwMSwgc3RhcnRJbmRleCwgYXhpcywgbmV4dFNoaXApO1xuXG4gIGlmIChzaGlwVmFsaWQpIHtcbiAgICBwMS5ib2FyZC5wbGFjZVNoaXAobmV4dFNoaXAsIHN0YXJ0SW5kZXgsIGF4aXMpO1xuICAgIHNoaXBCdWlsZGVyLmNsZWFyUHJldmlldygpO1xuICAgIGRvbS5yZW5kZXJTaGlwcyhwMSk7XG5cbiAgICBkb20ucmVhZHlHYW1lKGdldFNoaXBzUGxhY2VkKCkpO1xuICB9XG59O1xuXG5jb25zdCBhdXRvUGxhY2VQbGF5ZXIgPSAoKSA9PiB7XG4gIGNvbnN0IHsgcDEgfSA9IHBsYXllcnM7XG4gIGNvbnN0IHNoaXBzUGxhY2VkID0gZ2V0U2hpcHNQbGFjZWQoKTtcblxuICBib3RMb2dpYy5hdXRvUGxhY2UocDEsIHNoaXBzUGxhY2VkKTtcbiAgZG9tLnJlbmRlclNoaXBzKHAxKTtcbiAgZG9tLnJlYWR5R2FtZShnZXRTaGlwc1BsYWNlZCgpKTtcbn07XG5cbmNvbnN0IHVuZG9TaGlwID0gKCkgPT4ge1xuICBjb25zdCB7IHAxIH0gPSBwbGF5ZXJzO1xuICBpZiAocDEuYm9hcmQuc2hpcHMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gIHAxLmJvYXJkLnJlbW92ZUxhc3RTaGlwKCk7XG5cbiAgZG9tLmNsZWFyVUkocDEpO1xuICBkb20ucmVuZGVyU2hpcHMocDEpO1xuICBkb20ucmVhZHlHYW1lKGdldFNoaXBzUGxhY2VkKCkpO1xufTtcblxuZXhwb3J0IHtcbiAgbmV3R2FtZSxcbiAgc3RhcnRHYW1lLFxuICByZWNlaXZlUGxheWVyTW92ZSxcbiAgcGxhY2VTaGlwLFxuICBnZXRTaGlwc1BsYWNlZCxcbiAgYXV0b1BsYWNlUGxheWVyLFxuICB1bmRvU2hpcCxcbn07XG4iLCJpbXBvcnQgc2hpcEZhY3RvcnkgZnJvbSAnLi9zaGlwRmFjdG9yeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdhbWVib2FyZEZhY3RvcnkoKSB7XG4gIGNvbnN0IGNyZWF0ZUJvYXJkID0gKCkgPT4ge1xuICAgIGNvbnN0IGdhbWVib2FyZCA9IG5ldyBBcnJheSgxMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBnYW1lYm9hcmRbaV0gPSB7fTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBnYW1lYm9hcmRbaV1bal0gPSB7XG4gICAgICAgICAgaGl0OiBmYWxzZSxcbiAgICAgICAgICBzaGlwSWQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBnYW1lYm9hcmQ7XG4gIH07XG5cbiAgY29uc3QgdGlsZXMgPSBjcmVhdGVCb2FyZCgpO1xuXG4gIGNvbnN0IHNoaXBzID0gW107XG5cbiAgY29uc3QgbWFwU2hpcElkID0gKGxlbmd0aCkgPT4ge1xuICAgIGxldCBpZDtcbiAgICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgICAgY2FzZSA1OlxuICAgICAgICBpZCA9IDA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0OlxuICAgICAgICBpZCA9IDE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBpZCA9IDQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBpZCA9IHNoaXBzLnNvbWUoKHNoaXApID0+IHNoaXAuaWQgPT09IDIpID8gMyA6IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gTm8gZGVmYXVsdFxuICAgIH1cbiAgICByZXR1cm4gaWQ7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKGxlbmd0aCwgW3gsIHldLCBheGlzKSA9PiB7XG4gICAgY29uc3Qgc2hpcElkID0gbWFwU2hpcElkKGxlbmd0aCk7XG4gICAgY29uc3QgbmV3U2hpcCA9IHNoaXBGYWN0b3J5KHNoaXBJZCwgbGVuZ3RoKTtcbiAgICBzaGlwcy5wdXNoKG5ld1NoaXApO1xuICAgIGlmIChheGlzID09PSAneCcpIHtcbiAgICAgIC8vIFBsYWNlIGhvcml6b250YWxseVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5ld1NoaXAuY29vcmRzLnB1c2goW3gsIHldKTtcbiAgICAgICAgdGlsZXNbeF1beV0uc2hpcElkID0gbmV3U2hpcC5pZDtcbiAgICAgICAgeCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgICAvLyBQbGFjZSB2ZXJ0aWNhbGx5XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1NoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmV3U2hpcC5jb29yZHMucHVzaChbeCwgeV0pO1xuICAgICAgICB0aWxlc1t4XVt5XS5zaGlwSWQgPSBuZXdTaGlwLmlkO1xuICAgICAgICB5ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHJlbW92ZUxhc3RTaGlwID0gKCkgPT4ge1xuICAgIGNvbnN0IFtzaGlwXSA9IHNoaXBzLnNwbGljZShzaGlwcy5sZW5ndGggLSAxLCAxKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBzaGlwLmNvb3Jkc1tpXTtcbiAgICAgIHRpbGVzW3hdW3ldLnNoaXBJZCA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhc1NoaXAgPSAoeCwgeSkgPT4gdGlsZXNbeF1beV0uc2hpcElkICE9PSBudWxsO1xuXG4gIGNvbnN0IGZpbmRTaGlwID0gKGlkKSA9PiB7XG4gICAgbGV0IHRoaXNTaGlwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzaGlwc1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgdGhpc1NoaXAgPSBzaGlwc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNTaGlwO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAodGFyZ2V0KSA9PiB7XG4gICAgY29uc3QgW3gsIHldID0gdGFyZ2V0O1xuICAgIGNvbnN0IHRoaXNUaWxlID0gdGlsZXNbeF1beV07XG4gICAgaWYgKHRoaXNUaWxlLmhpdCkgcmV0dXJuO1xuXG4gICAgaWYgKGhhc1NoaXAoeCwgeSkpIHtcbiAgICAgIGNvbnN0IHRoaXNTaGlwID0gZmluZFNoaXAodGhpc1RpbGUuc2hpcElkKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpc1NoaXAuY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzU2hpcC5jb29yZHNbaV0uZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHRhcmdldFtpbmRleF0pXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXNTaGlwLmhlYWx0aFtpXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpc1RpbGUuaGl0ID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBzaGlwc1JlbWFpbmluZyA9ICgpID0+IHtcbiAgICBjb25zdCBmaWx0ZXJTaGlwcyA9IHNoaXBzLmZpbHRlcigoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSA9PT0gZmFsc2UpO1xuICAgIHJldHVybiBmaWx0ZXJTaGlwcy5sZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgYWxsU2hpcHNTdW5rID0gKCkgPT4ge1xuICAgIGNvbnN0IHN1bmtTaGlwcyA9IHNoaXBzUmVtYWluaW5nKCk7XG4gICAgcmV0dXJuIHN1bmtTaGlwcyA9PT0gMDtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHRpbGVzLFxuICAgIHNoaXBzLFxuICAgIHBsYWNlU2hpcCxcbiAgICBoYXNTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgc2hpcHNSZW1haW5pbmcsXG4gICAgYWxsU2hpcHNTdW5rLFxuICAgIHJlbW92ZUxhc3RTaGlwLFxuICB9O1xufVxuIiwiY29uc3QgZ2V0Q2VsbEluZm8gPSAodGFyZ2V0KSA9PiB7XG4gIHJldHVybiBbTnVtYmVyKHRhcmdldC5kYXRhc2V0LngpLCBOdW1iZXIodGFyZ2V0LmRhdGFzZXQueSldO1xufTtcblxuY29uc3QgYWxyZWFkeVBsYXllZCA9IChwbGF5ZXIsIHRhcmdldCkgPT4ge1xuICBjb25zdCBwcmV2aW91c01vdmVzID0gcGxheWVyLm1vdmVzO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzTW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocHJldmlvdXNNb3Zlc1tpXS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZSA9PT0gdGFyZ2V0W2luZGV4XSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCB0aW1lb3V0ID0gKG1zKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpO1xuICB9KTtcbn07XG5cbmNvbnN0IGdldFJhbmRvbVRpbGUgPSAoKSA9PiB7XG4gIGNvbnN0IHJhbmRvbSA9IFtcbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLFxuICBdO1xuICByZXR1cm4gcmFuZG9tO1xufTtcblxuY29uc3QgZ2V0RW1wdHlUaWxlcyA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgeyBib2FyZCB9ID0gcGxheWVyO1xuICBjb25zdCB7IHRpbGVzIH0gPSBib2FyZDtcbiAgY29uc3QgZW1wdHlUaWxlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBPYmplY3Qua2V5cyh0aWxlc1tpXSkubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IGhhc1NoaXAgPSBib2FyZC5oYXNTaGlwKGksIGopO1xuICAgICAgaWYgKCFoYXNTaGlwKSB7XG4gICAgICAgIGNvbnN0IGNvb3JkID0gW2ksIGpdO1xuICAgICAgICBlbXB0eVRpbGVzLnB1c2goY29vcmQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZW1wdHlUaWxlcztcbn07XG5cbmNvbnN0IGdldFJhbmRvbUVtcHR5ID0gKHBsYXllcikgPT4ge1xuICBjb25zdCBlbXB0eVRpbGVzID0gZ2V0RW1wdHlUaWxlcyhwbGF5ZXIpO1xuXG4gIHJldHVybiBlbXB0eVRpbGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGVtcHR5VGlsZXMubGVuZ3RoKV07XG59O1xuXG5jb25zdCBuZXh0U2hpcExlbmd0aCA9IChudW1TaGlwc1BsYWNlZCkgPT4ge1xuICBzd2l0Y2ggKG51bVNoaXBzUGxhY2VkKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIDU7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIDQ7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIDM7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIDM7XG4gICAgY2FzZSA0OlxuICAgICAgcmV0dXJuIDI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBudWxsO1xuICB9XG59O1xuXG5jb25zdCBnZXRSYW5kb21BeGlzID0gKCkgPT4gWyd4JywgJ3knXVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKV07XG5cbmV4cG9ydCB7XG4gIGdldENlbGxJbmZvLFxuICBhbHJlYWR5UGxheWVkLFxuICB0aW1lb3V0LFxuICBnZXRSYW5kb21UaWxlLFxuICBnZXRSYW5kb21FbXB0eSxcbiAgbmV4dFNoaXBMZW5ndGgsXG4gIGdldFJhbmRvbUF4aXMsXG59O1xuIiwiaW1wb3J0IGdhbWVib2FyZEZhY3RvcnkgZnJvbSAnLi9nYW1lYm9hcmRGYWN0b3J5JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGxheWVyRmFjdG9yeShudW0sIGh1bWFuKSB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IGdhbWVib2FyZEZhY3RvcnkoKTtcbiAgY29uc3QgbW92ZXMgPSBbXTtcbiAgY29uc3QgbWFrZU1vdmUgPSAodGFyZ2V0LCBlbmVteUJvYXJkKSA9PiB7XG4gICAgZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKHRhcmdldCk7XG4gICAgbW92ZXMucHVzaCh0YXJnZXQpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZ2V0IG51bSgpIHtcbiAgICAgIHJldHVybiBudW07XG4gICAgfSxcbiAgICBnZXQgYm9hcmQoKSB7XG4gICAgICByZXR1cm4gZ2FtZWJvYXJkO1xuICAgIH0sXG4gICAgZ2V0IGlzSHVtYW4oKSB7XG4gICAgICByZXR1cm4gaHVtYW47XG4gICAgfSxcbiAgICBnZXQgbW92ZXMoKSB7XG4gICAgICByZXR1cm4gbW92ZXM7XG4gICAgfSxcbiAgICBtYWtlTW92ZSxcbiAgfTtcbn1cbiIsImltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcblxuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyLWJvYXJkJyk7XG5cbi8vIFNoaXAgcm90YXRpb24gd2hlcmUgeCA9IHBsYWNlIGhvcml6b250YWxseSwgeSA9IHBsYWNlIHZlcnRpY2FsbHlcbmNvbnN0IGF4ZXMgPSB7XG4gIHg6IHRydWUsXG4gIHk6IGZhbHNlLFxufTtcblxuY29uc3QgZ2V0QXhpcyA9ICgpID0+IHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGF4ZXMpO1xuICByZXR1cm4ga2V5cy5maWx0ZXIoKGtleSkgPT4gYXhlc1trZXldID09PSB0cnVlKVswXTtcbn07XG5cbmNvbnN0IHN3aXRjaEF4aXMgPSAoKSA9PiB7XG4gIGF4ZXMueCA9ICFheGVzLng7XG4gIGF4ZXMueSA9ICFheGVzLng7XG59O1xuXG4vLyBSZXR1cm5zIGFycmF5IG9mIFt4LCB5XSBjb29yZHMgb2YgYSBzaGlwIG9mIGxlbmd0aCwgYnVpbHQgb24gYXhpcywgYXQgc3RhcnQgaW5kZXhcbmNvbnN0IGJ1aWxkU2hpcCA9IChzdGFydCwgYXhpcywgbGVuZ3RoKSA9PiB7XG4gIGNvbnN0IFt4LCB5XSA9IHN0YXJ0O1xuICBjb25zdCBzaGlwQ29vcmRzID0gW107XG5cbiAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHNoaXBDb29yZHMucHVzaChbaSArIHgsIHldKTtcbiAgICB9XG4gIH1cblxuICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKFt4LCBpICsgeV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzaGlwQ29vcmRzO1xufTtcblxuLyogVmFsaWQgY2hlY2tzIGZvciBzaGlwIG9iamVjdCBvbiBib2FyZCBvYmplY3QgKi9cbi8vICBDaGVjayBpZiBzaGlwIG9mIGxlbmd0aCAmIGF4aXMgZml0cyB3aXRoaW4gMTB4MTAgZ2FtZWJvYXJkIGJvdW5kYXJpZXNcbmNvbnN0IGRvZXNTaGlwRml0ID0gKGxlbmd0aCwgYXhpcywgc3RhcnRJbmRleCkgPT4ge1xuICBjb25zdCBbeCwgeV0gPSBzdGFydEluZGV4O1xuICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgcmV0dXJuIHggKyBsZW5ndGggLSAxIDw9IDk7XG4gIH1cbiAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgIHJldHVybiB5ICsgbGVuZ3RoIC0gMSA8PSA5O1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIENoZWNrcyBzaGlwIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbm90aGVyXG5jb25zdCBub092ZXJsYXAgPSAoc2hpcCwgcGxheWVyKSA9PiB7XG4gIGNvbnN0IHsgYm9hcmQgfSA9IHBsYXllcjtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgW3gsIHldID0gc2hpcFtpXTtcbiAgICBpZiAoYm9hcmQuaGFzU2hpcCh4LCB5KSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmNvbnN0IGlzU2hpcFZhbGlkID0gKHBsYXllciwgc3RhcnQsIGF4aXMsIGxlbmd0aCkgPT4ge1xuICBjb25zdCBzaGlwRml0cyA9IGRvZXNTaGlwRml0KGxlbmd0aCwgYXhpcywgc3RhcnQpO1xuXG4gIGlmIChzaGlwRml0cykge1xuICAgIGNvbnN0IHNoaXAgPSBidWlsZFNoaXAoc3RhcnQsIGF4aXMsIGxlbmd0aCk7XG4gICAgaWYgKG5vT3ZlcmxhcChzaGlwLCBwbGF5ZXIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyogUHJldmlld2luZyBzaGlwIHBsYWNlbWVudCBvbiBET00gKi9cbmNvbnN0IGlzUHJldmlld1ZhbGlkID0gKGNvb3JkcywgbGVuZ3RoKSA9PiB7XG4gIGNvbnN0IGlzV2l0aGluQm91bmRzID0gY29vcmRzLmxlbmd0aCA9PT0gbGVuZ3RoO1xuICBjb25zdCBub090aGVyU2hpcHMgPSBjb29yZHMuZXZlcnkoXG4gICAgKGNvb3JkKSA9PiAhY29vcmQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaGlwJylcbiAgKTtcbiAgcmV0dXJuIGlzV2l0aGluQm91bmRzICYmIG5vT3RoZXJTaGlwcztcbn07XG5cbmNvbnN0IGJ1aWxkUHJldmlldyA9IChzdGFydCwgbGVuZ3RoLCBheGlzLCBib2FyZCkgPT4ge1xuICBjb25zdCBbeCwgeV0gPSBzdGFydDtcbiAgY29uc3Qgc2hpcENvb3JkcyA9IFtdO1xuXG4gIGlmIChheGlzID09PSAneCcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyA+OSA9IG91dCBvZiBib3VuZHNcbiAgICAgIGlmIChpICsgeCA+IDkpIGJyZWFrO1xuICAgICAgY29uc3QgbmV4dENlbGwgPSBib2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEteD0nJHtpICsgeH0nXVtkYXRhLXk9JyR7eX0nXWBcbiAgICAgICk7XG4gICAgICBzaGlwQ29vcmRzLnB1c2gobmV4dENlbGwpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChheGlzID09PSAneScpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyA+OSA9IG91dCBvZiBib3VuZHNcbiAgICAgIGlmIChpICsgeSA+IDkpIGJyZWFrO1xuXG4gICAgICBjb25zdCBuZXh0Q2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS14PScke3h9J11bZGF0YS15PScke2kgKyB5fSddYFxuICAgICAgKTtcbiAgICAgIHNoaXBDb29yZHMucHVzaChuZXh0Q2VsbCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNoaXBDb29yZHM7XG59O1xuXG5jb25zdCBwcmV2aWV3U2hpcCA9IChlLCBsZW5ndGgpID0+IHtcbiAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYm9hcmQnKSB8fCBsZW5ndGggPT09IG51bGwpIHJldHVybjtcblxuICBjb25zdCBzdGFydGluZ0luZGV4ID0gaGVscGVycy5nZXRDZWxsSW5mbyhlLnRhcmdldCk7XG4gIGNvbnN0IGF4aXMgPSBnZXRBeGlzKCk7XG4gIGNvbnN0IHNoaXBDb29yZHMgPSBidWlsZFByZXZpZXcoc3RhcnRpbmdJbmRleCwgbGVuZ3RoLCBheGlzLCBwbGF5ZXJCb2FyZCk7XG4gIGNvbnN0IHZhbGlkUHJldmlldyA9IGlzUHJldmlld1ZhbGlkKHNoaXBDb29yZHMsIGxlbmd0aCk7XG5cbiAgaWYgKHZhbGlkUHJldmlldykge1xuICAgIHNoaXBDb29yZHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwLXByZXZpZXcnKSk7XG4gIH0gZWxzZSB7XG4gICAgc2hpcENvb3Jkcy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKSk7XG4gIH1cbn07XG5cbmNvbnN0IGNsZWFyUHJldmlldyA9ICgpID0+IHtcbiAgY29uc3QgY2VsbHMgPSBwbGF5ZXJCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQtY2VsbCcpO1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3NoaXAtcHJldmlldycsICdpbnZhbGlkJykpO1xufTtcblxuZXhwb3J0IHtcbiAgYnVpbGRTaGlwLFxuICBub092ZXJsYXAsXG4gIGRvZXNTaGlwRml0LFxuICBnZXRBeGlzLFxuICBzd2l0Y2hBeGlzLFxuICBwcmV2aWV3U2hpcCxcbiAgY2xlYXJQcmV2aWV3LFxuICBpc1NoaXBWYWxpZCxcbn07XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGlwRmFjdG9yeShpZCwgbGVuZ3RoKSB7XG4gIGNvbnN0IGNyZWF0ZUhlYWx0aCA9IChzaXplKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBbLi4uQXJyYXkoc2l6ZSkua2V5cygpXTtcbiAgICBjb25zdCBoZWFsdGggPSBhcnJheS5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgIHByZXZbY3Vycl0gPSBmYWxzZTtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gaGVhbHRoO1xuICB9O1xuXG4gIGNvbnN0IGNvb3JkcyA9IFtdO1xuXG4gIGNvbnN0IGhlYWx0aCA9IGNyZWF0ZUhlYWx0aChsZW5ndGgpO1xuICAvLyBoZWFsdGggPSB7IHdoZXJlIGJvb2wgcmVwcmVzZW50cyBoaXQvbm8gaGl0XG4gIC8vICAgMDogZmFsc2UsXG4gIC8vICAgMTogZmFsc2UsXG4gIC8vICAgMjogZmFsc2UsXG4gIC8vIH1cbiAgY29uc3QgaGl0ID0gKGluZGV4KSA9PiB7XG4gICAgaGVhbHRoW2luZGV4XSA9IHRydWU7XG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGhlYWx0aCkuZXZlcnkoKGluZGV4KSA9PiBpbmRleCA9PT0gdHJ1ZSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpZCxcbiAgICBsZW5ndGgsXG4gICAgaGVhbHRoLFxuICAgIGNvb3JkcyxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICB9O1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vc3R5bGUuY3NzJztcbmltcG9ydCAqIGFzIGdhbWUgZnJvbSAnLi9tb2R1bGVzL2dhbWUnO1xuaW1wb3J0ICogYXMgZG9tIGZyb20gJy4vbW9kdWxlcy9kb20nO1xuaW1wb3J0ICogYXMgZXZlbnRDb250cm9sbGVyIGZyb20gJy4vbW9kdWxlcy9ldmVudENvbnRyb2xsZXInO1xuXG5kb20uY3JlYXRlQm9hcmRzKCk7XG5nYW1lLm5ld0dhbWUoKTtcblxuZXZlbnRDb250cm9sbGVyLmluaXRCb2FyZEV2ZW50cygpO1xuZXZlbnRDb250cm9sbGVyLmluaXRHYW1lQnV0dG9ucygpO1xuZXZlbnRDb250cm9sbGVyLmluaXRTaGlwUGxhY2VtZW50KCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=