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

const autoPlace = (player) => {
  const shipLengths = [5, 4, 3, 3, 2];
  shipLengths.forEach((length) => {
    const ship = randomShip(player, length);

    player.board.placeShip(length, ...ship);
  });
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
/* harmony export */   "renderShips": () => (/* binding */ renderShips),
/* harmony export */   "toggleBtns": () => (/* binding */ toggleBtns),
/* harmony export */   "updateBoard": () => (/* binding */ updateBoard)
/* harmony export */ });
const gameboards = document.querySelectorAll('.board');
const playerBoard = document.querySelector('#player-board');
const compBoard = document.querySelector('#comp-board');
const gameInfo = document.querySelector('#game-info');

const updateShipCount = (player) => {
  const thisBoard = player.isHuman ? playerBoard : compBoard;
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
  const { ships } = player.board;
  const coords = ships.map((ship) => ship.coords);

  for (let i = 0; i < coords.length; i++) {
    for (let j = 0; j < coords[i].length; j++) {
      const [x, y] = [coords[i][j][0], coords[i][j][1]];
      const thisCell = playerBoard.querySelector(
        `[data-x='${x}'][data-y='${y}']`
      );
      thisCell.classList.add('ship');
    }
  }
  updateShipCount(player);
};

const updateBoard = (player) => {
  const thisBoard = player.isHuman ? playerBoard : compBoard;
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
  const thisBoard = board === 'comp' ? compBoard : playerBoard;
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
  const compCells = document.querySelectorAll('#comp-board .board-cell');
  compCells.forEach((cell) => {
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
  const rotateBtn = document.querySelector('#rotate-ship');
  rotateBtn.addEventListener('click', _shipBuilder__WEBPACK_IMPORTED_MODULE_2__.switchAxis);
};

const initShipPlacement = () => {
  const playerBoard = document.querySelector('#player-board');
  playerBoard.addEventListener('mouseover', (e) => {
    const nextShip = _game__WEBPACK_IMPORTED_MODULE_0__.getNextShip();
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
/* harmony export */   "getNextShip": () => (/* binding */ getNextShip),
/* harmony export */   "newGame": () => (/* binding */ newGame),
/* harmony export */   "placeShip": () => (/* binding */ placeShip),
/* harmony export */   "players": () => (/* binding */ players),
/* harmony export */   "receivePlayerMove": () => (/* binding */ receivePlayerMove),
/* harmony export */   "startGame": () => (/* binding */ startGame)
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
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'comp');
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'player');
};

const startGame = () => {
  _botLogic__WEBPACK_IMPORTED_MODULE_4__.autoPlace(players.com);
  _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('start', true);
  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(players.com);
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'player');
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'comp');
};

const endGame = (winner) => {
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'comp');
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
    _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'comp');
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
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'comp');
};

const getNextShip = () => {
  const shipsPlaced = players.p1.board.ships.length;
  return _helpers__WEBPACK_IMPORTED_MODULE_2__.nextShipLength(shipsPlaced);
};

const placeShip = (e) => {
  const { p1 } = players;
  if (e.target.classList.contains('board') || p1.board.ships.length === null) {
    return;
  }

  const startIndex = _helpers__WEBPACK_IMPORTED_MODULE_2__.getCellInfo(e.target);
  const allNodes = _shipBuilder__WEBPACK_IMPORTED_MODULE_3__.getPreview();
  const length = getNextShip();
  const axis = _shipBuilder__WEBPACK_IMPORTED_MODULE_3__.getAxis();

  if (_shipBuilder__WEBPACK_IMPORTED_MODULE_3__.isPreviewValid(allNodes, length)) {
    p1.board.placeShip(length, startIndex, axis);
    _shipBuilder__WEBPACK_IMPORTED_MODULE_3__.clearPreview();
    _dom__WEBPACK_IMPORTED_MODULE_1__.renderShips(p1);

    if (p1.board.ships.length === 5) {
      _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('start', false);
    }
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
  // const misses = [];
  const tiles = createBoard();

  const ships = [];

  const placeShip = (length, [x, y], axis) => {
    const newShip = (0,_shipFactory__WEBPACK_IMPORTED_MODULE_0__["default"])(ships.length, length);
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

  // const hasShip = (tile) => tile.shipId !== null;

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

    // if (!hasShip(thisTile)) {
    //   misses.push(target);
    // }
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
/* harmony export */   "getEmptyTiles": () => (/* binding */ getEmptyTiles),
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
    // get turn() {
    //   return turn;
    // },
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
/* harmony export */   "getPreview": () => (/* binding */ getPreview),
/* harmony export */   "isPreviewValid": () => (/* binding */ isPreviewValid),
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

const getPreview = () => [...playerBoard.querySelectorAll('.ship-preview')];




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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDbENBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNOcUI7QUFDa0I7QUFDRjtBQUN3Qjs7QUFFN0Qsc0RBQWdCO0FBQ2hCLGtEQUFZOztBQUVaLHFFQUErQjtBQUMvQixxRUFBK0I7QUFDL0IsdUVBQWlDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3M/ZTMyMCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvYm90TG9naWMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZXZlbnRDb250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lYm9hcmRGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9oZWxwZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXJGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgc2hpcEJ1aWxkZXIgZnJvbSAnLi9zaGlwQnVpbGRlcic7XG5cbi8vIFJhbmRvbSBtb3ZlIChhdHRhY2spXG5jb25zdCBhdXRvQXR0YWNrID0gYXN5bmMgKHBsYXllcikgPT4ge1xuICBsZXQgcmFuZG9tTW92ZSA9IGhlbHBlcnMuZ2V0UmFuZG9tVGlsZSgpO1xuICB3aGlsZSAoaGVscGVycy5hbHJlYWR5UGxheWVkKHBsYXllciwgcmFuZG9tTW92ZSkpIHtcbiAgICByYW5kb21Nb3ZlID0gaGVscGVycy5nZXRSYW5kb21UaWxlKCk7XG4gIH1cbiAgYXdhaXQgaGVscGVycy50aW1lb3V0KDQwMCk7XG4gIHJldHVybiByYW5kb21Nb3ZlO1xufTtcblxuLyogUmFuZG9tIHNoaXAgcGxhY2VtZW50ICovXG4vKiBSZXR1cm5zIGEgcmFuZG9tIHN0YXJ0aW5nSW5kZXggJiBheGlzICh0byBwbGFjZSBhIHNoaXApIHRoYXQgd2lsbCBmaXQgd2l0aGluIFxuICAxMHgxMCBib2FyZCAqL1xuY29uc3QgZ2V0VmFsaWRTdGFydCA9IChwbGF5ZXIsIGxlbmd0aCkgPT4ge1xuICBsZXQgc3RhcnRJbmRleDtcbiAgbGV0IGF4aXM7XG4gIGxldCBzaGlwRml0cyA9IGZhbHNlO1xuICB3aGlsZSAoIXNoaXBGaXRzKSB7XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBoZWxwZXJzLmdldFJhbmRvbUVtcHR5KHBsYXllcik7XG4gICAgY29uc3QgcmFuZG9tQXhpcyA9IGhlbHBlcnMuZ2V0UmFuZG9tQXhpcygpO1xuICAgIHNoaXBGaXRzID0gc2hpcEJ1aWxkZXIuZG9lc1NoaXBGaXQobGVuZ3RoLCByYW5kb21BeGlzLCByYW5kb21JbmRleCk7XG4gICAgc3RhcnRJbmRleCA9IHJhbmRvbUluZGV4O1xuICAgIGF4aXMgPSByYW5kb21BeGlzO1xuICB9XG4gIHJldHVybiBbc3RhcnRJbmRleCwgYXhpc107XG59O1xuXG4vKiBHZW5lcmF0ZXMgYSByYW5kb20gc2hpcCBwb3NpdGlvbiB0aGF0IHBhc3NlcyBjaGVja3M6XG4gIDEuIHNoaXAgb2YgbGVuZ3RoIGEsIHBsYWNlZCBvbiBheGlzIGIgd2lsbCBmaXQgd2l0aGluIHRoZSAxMHgxMCBib2FyZFxuICAyLiBzaGlwIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbiBhbHJlYWR5IHBsYWNlZCBzaGlwICovXG5jb25zdCByYW5kb21TaGlwID0gKHBsYXllciwgbGVuZ3RoKSA9PiB7XG4gIGxldCBzdGFydDtcbiAgbGV0IGF4aXM7XG4gIGxldCB2YWxpZCA9IGZhbHNlO1xuICB3aGlsZSAoIXZhbGlkKSB7XG4gICAgY29uc3QgW3JhbmRvbUluZGV4LCByYW5kb21BeGlzXSA9IGdldFZhbGlkU3RhcnQocGxheWVyLCBsZW5ndGgpO1xuICAgIGNvbnN0IHNoaXAgPSBzaGlwQnVpbGRlci5idWlsZFNoaXAocmFuZG9tSW5kZXgsIHJhbmRvbUF4aXMsIGxlbmd0aCk7XG4gICAgdmFsaWQgPSBzaGlwQnVpbGRlci5ub092ZXJsYXAoc2hpcCwgcGxheWVyKTtcbiAgICBzdGFydCA9IHJhbmRvbUluZGV4O1xuICAgIGF4aXMgPSByYW5kb21BeGlzO1xuICB9XG4gIHJldHVybiBbc3RhcnQsIGF4aXNdO1xufTtcblxuY29uc3QgYXV0b1BsYWNlID0gKHBsYXllcikgPT4ge1xuICBjb25zdCBzaGlwTGVuZ3RocyA9IFs1LCA0LCAzLCAzLCAyXTtcbiAgc2hpcExlbmd0aHMuZm9yRWFjaCgobGVuZ3RoKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IHJhbmRvbVNoaXAocGxheWVyLCBsZW5ndGgpO1xuXG4gICAgcGxheWVyLmJvYXJkLnBsYWNlU2hpcChsZW5ndGgsIC4uLnNoaXApO1xuICB9KTtcbn07XG5cbmV4cG9ydCB7IGF1dG9BdHRhY2ssIGF1dG9QbGFjZSB9O1xuIiwiY29uc3QgZ2FtZWJvYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZCcpO1xuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyLWJvYXJkJyk7XG5jb25zdCBjb21wQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29tcC1ib2FyZCcpO1xuY29uc3QgZ2FtZUluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ2FtZS1pbmZvJyk7XG5cbmNvbnN0IHVwZGF0ZVNoaXBDb3VudCA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbXBCb2FyZDtcbiAgY29uc3Qgc2hpcENvdW50ZXIgPSB0aGlzQm9hcmQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgY29uc3Qgc2hpcHNSZW1haW5pbmcgPSBwbGF5ZXIuYm9hcmQuc2hpcHNSZW1haW5pbmcoKTtcblxuICBzaGlwQ291bnRlci50ZXh0Q29udGVudCA9IGBTaGlwcyByZW1haW5pbmc6ICR7c2hpcHNSZW1haW5pbmd9YDtcbn07XG5cbmNvbnN0IGNyZWF0ZUJvYXJkcyA9ICgpID0+IHtcbiAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGJvYXJkQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIGJvYXJkQ2VsbC5jbGFzc0xpc3QuYWRkKCdib2FyZC1jZWxsJyk7XG4gICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnggPSBqO1xuICAgICAgICBib2FyZENlbGwuZGF0YXNldC55ID0gaTtcbiAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRDZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3QgcmVuZGVyU2hpcHMgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHsgc2hpcHMgfSA9IHBsYXllci5ib2FyZDtcbiAgY29uc3QgY29vcmRzID0gc2hpcHMubWFwKChzaGlwKSA9PiBzaGlwLmNvb3Jkcyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvb3Jkc1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgW3gsIHldID0gW2Nvb3Jkc1tpXVtqXVswXSwgY29vcmRzW2ldW2pdWzFdXTtcbiAgICAgIGNvbnN0IHRoaXNDZWxsID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7eH0nXVtkYXRhLXk9JyR7eX0nXWBcbiAgICAgICk7XG4gICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgfVxuICB9XG4gIHVwZGF0ZVNoaXBDb3VudChwbGF5ZXIpO1xufTtcblxuY29uc3QgdXBkYXRlQm9hcmQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IHBsYXllci5pc0h1bWFuID8gcGxheWVyQm9hcmQgOiBjb21wQm9hcmQ7XG4gIGNvbnN0IHsgYm9hcmQgfSA9IHBsYXllcjtcbiAgY29uc3QgeyB0aWxlcyB9ID0gYm9hcmQ7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IE9iamVjdC5rZXlzKHRpbGVzW2ldKS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdGhpc1RpbGUgPSB0aWxlc1tpXVtqXTtcbiAgICAgIGNvbnN0IGhhc1NoaXAgPSBib2FyZC5oYXNTaGlwKGksIGopO1xuICAgICAgaWYgKHRoaXNUaWxlLmhpdCkge1xuICAgICAgICBjb25zdCB0aGlzQ2VsbCA9IHRoaXNCb2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGBbZGF0YS14PScke2l9J11bZGF0YS15PScke2p9J11gXG4gICAgICAgICk7XG4gICAgICAgIGlmIChoYXNTaGlwKSB7XG4gICAgICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHVwZGF0ZVNoaXBDb3VudChwbGF5ZXIpO1xufTtcblxuY29uc3Qgc3R5bGVHYW1lT3ZlciA9IChib29sKSA9PiB7XG4gIGlmIChib29sKSB7XG4gICAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4gYm9hcmQuY2xhc3NMaXN0LmFkZCgnZ2FtZS1vdmVyJykpO1xuICB9IGVsc2Uge1xuICAgIGdhbWVib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IGJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ2dhbWUtb3ZlcicpKTtcbiAgfVxufTtcblxuY29uc3QgY2xlYXJVSSA9ICguLi5wbGF5ZXJzKSA9PiB7XG4gIGdhbWVib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IHtcbiAgICBjb25zdCBjZWxscyA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdtaXNzJywgJ2hpdCcsICdzaGlwJyk7XG4gICAgfSk7XG4gIH0pO1xuICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4gdXBkYXRlU2hpcENvdW50KHBsYXllcikpO1xuICBzdHlsZUdhbWVPdmVyKGZhbHNlKTtcbn07XG5cbmNvbnN0IGFubm91bmNlR2FtZU92ZXIgPSAod2lubmVyKSA9PiB7XG4gIGNvbnN0IHdpbk1lc3NhZ2UgPVxuICAgIHdpbm5lci5udW0gPT09IDFcbiAgICAgID8gJ0NvbmdyYXR1bGF0aW9ucyEgWW91IHdpbiEnXG4gICAgICA6ICdHYW1lIG92ZXIgLi4uIENvbXB1dGVyIHdpbnMhJztcblxuICBnYW1lSW5mby50ZXh0Q29udGVudCA9IHdpbk1lc3NhZ2U7XG4gIHN0eWxlR2FtZU92ZXIodHJ1ZSk7XG59O1xuXG5jb25zdCBkaXNhYmxlRXZlbnRzID0gKGJvb2wsIGJvYXJkKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IGJvYXJkID09PSAnY29tcCcgPyBjb21wQm9hcmQgOiBwbGF5ZXJCb2FyZDtcbiAgaWYgKGJvb2wpIHtcbiAgICB0aGlzQm9hcmQuY2xhc3NMaXN0LmFkZCgnbm8tZXZlbnRzJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpc0JvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ25vLWV2ZW50cycpO1xuICB9XG59O1xuXG5jb25zdCB0b2dnbGVCdG5zID0gKGJ1dHRvbiwgc3RhdGUpID0+IHtcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnQtYnRuJyk7XG4gIGNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzdGFydC1idG4nKTtcblxuICBpZiAoYnV0dG9uID09PSAnc3RhcnQnKSB7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICBzdGFydEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGJ1dHRvbiA9PT0gJ3Jlc3RhcnQnKSB7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICByZXN0YXJ0QnRuLnRleHRDb250ZW50ID0gJ05ldyBnYW1lJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdGFydEJ0bi50ZXh0Q29udGVudCA9ICdSZXN0YXJ0JztcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB7XG4gIGNyZWF0ZUJvYXJkcyxcbiAgY2xlYXJVSSxcbiAgcmVuZGVyU2hpcHMsXG4gIHVwZGF0ZUJvYXJkLFxuICBkaXNhYmxlRXZlbnRzLFxuICBhbm5vdW5jZUdhbWVPdmVyLFxuICB0b2dnbGVCdG5zLFxufTtcbiIsImltcG9ydCAqIGFzIGdhbWUgZnJvbSAnLi9nYW1lJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCAqIGFzIHNoaXBCdWlsZGVyIGZyb20gJy4vc2hpcEJ1aWxkZXInO1xuXG5jb25zdCBpbml0Qm9hcmRFdmVudHMgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbXBDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjb21wLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gIGNvbXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGhlbHBlcnMuZ2V0Q2VsbEluZm8oZS50YXJnZXQpO1xuICAgICAgZ2FtZS5yZWNlaXZlUGxheWVyTW92ZShjb29yZCk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuY29uc3QgaW5pdEdhbWVCdXR0b25zID0gKCkgPT4ge1xuICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc3RhcnQtYnRuJyk7XG4gIHJlc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLm5ld0dhbWUpO1xuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdGFydC1idG4nKTtcbiAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLnN0YXJ0R2FtZSk7XG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb3RhdGUtc2hpcCcpO1xuICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzaGlwQnVpbGRlci5zd2l0Y2hBeGlzKTtcbn07XG5cbmNvbnN0IGluaXRTaGlwUGxhY2VtZW50ID0gKCkgPT4ge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcbiAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCBuZXh0U2hpcCA9IGdhbWUuZ2V0TmV4dFNoaXAoKTtcbiAgICBzaGlwQnVpbGRlci5wcmV2aWV3U2hpcChlLCBuZXh0U2hpcCk7XG4gIH0pO1xuICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHNoaXBCdWlsZGVyLmNsZWFyUHJldmlldyk7XG4gIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5wbGFjZVNoaXApO1xufTtcblxuZXhwb3J0IHsgaW5pdEJvYXJkRXZlbnRzLCBpbml0R2FtZUJ1dHRvbnMsIGluaXRTaGlwUGxhY2VtZW50IH07XG4iLCJpbXBvcnQgcGxheWVyRmFjdG9yeSBmcm9tICcuL3BsYXllckZhY3RvcnknO1xuaW1wb3J0ICogYXMgZG9tIGZyb20gJy4vZG9tJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCAqIGFzIHNoaXBCdWlsZGVyIGZyb20gJy4vc2hpcEJ1aWxkZXInO1xuaW1wb3J0ICogYXMgYm90TG9naWMgZnJvbSAnLi9ib3RMb2dpYyc7XG5cbmNvbnN0IHBsYXllcnMgPSB7XG4gIHAxOiBudWxsLFxuICBjb206IG51bGwsXG59O1xuXG5jb25zdCBjaGVja0dhbWVTdGF0ZSA9IChwbGF5ZXIpID0+IHBsYXllci5ib2FyZC5hbGxTaGlwc1N1bmsoKTtcblxuY29uc3QgbmV3R2FtZSA9ICgpID0+IHtcbiAgcGxheWVycy5wMSA9IHBsYXllckZhY3RvcnkoMSwgdHJ1ZSk7XG4gIHBsYXllcnMuY29tID0gcGxheWVyRmFjdG9yeSgyLCBmYWxzZSk7XG5cbiAgZG9tLmNsZWFyVUkocGxheWVycy5wMSwgcGxheWVycy5jb20pO1xuICBkb20udG9nZ2xlQnRucygnc3RhcnQnLCB0cnVlKTtcbiAgZG9tLnRvZ2dsZUJ0bnMoJ3Jlc3RhcnQnLCBmYWxzZSk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUsICdjb21wJyk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlLCAncGxheWVyJyk7XG59O1xuXG5jb25zdCBzdGFydEdhbWUgPSAoKSA9PiB7XG4gIGJvdExvZ2ljLmF1dG9QbGFjZShwbGF5ZXJzLmNvbSk7XG4gIGRvbS50b2dnbGVCdG5zKCdzdGFydCcsIHRydWUpO1xuICBkb20udXBkYXRlQm9hcmQocGxheWVycy5jb20pO1xuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlLCAncGxheWVyJyk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlLCAnY29tcCcpO1xufTtcblxuY29uc3QgZW5kR2FtZSA9ICh3aW5uZXIpID0+IHtcbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSwgJ2NvbXAnKTtcbiAgZG9tLnRvZ2dsZUJ0bnMoJ3Jlc3RhcnQnLCB0cnVlKTtcbiAgZG9tLmFubm91bmNlR2FtZU92ZXIod2lubmVyKTtcbn07XG5cbmNvbnN0IHBsYXlDb21Nb3ZlID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCB7IHAxLCBjb20gfSA9IHBsYXllcnM7XG4gIGNvbnN0IGNvbUF0dGFjayA9IGF3YWl0IGJvdExvZ2ljLmF1dG9BdHRhY2soY29tKTtcblxuICBjb20ubWFrZU1vdmUoY29tQXR0YWNrLCBwMS5ib2FyZCk7XG4gIGRvbS51cGRhdGVCb2FyZChwMSk7XG5cbiAgY29uc3Qgd2luU3RhdGUgPSBjaGVja0dhbWVTdGF0ZShwMSk7XG4gIGlmICh3aW5TdGF0ZSkge1xuICAgIGVuZEdhbWUoY29tKTtcbiAgfSBlbHNlIHtcbiAgICBkb20uZGlzYWJsZUV2ZW50cyhmYWxzZSwgJ2NvbXAnKTtcbiAgfVxufTtcblxuY29uc3QgcmVjZWl2ZVBsYXllck1vdmUgPSAoY29vcmQpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBpZiAoaGVscGVycy5hbHJlYWR5UGxheWVkKHAxLCBjb29yZCkpIHJldHVybjtcbiAgcDEubWFrZU1vdmUoY29vcmQsIGNvbS5ib2FyZCk7XG4gIGRvbS51cGRhdGVCb2FyZChjb20pO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUoY29tKTtcbiAgaWYgKHdpblN0YXRlKSB7XG4gICAgZW5kR2FtZShwMSk7XG4gIH0gZWxzZSB7XG4gICAgcGxheUNvbU1vdmUocDEsIGNvbSk7XG4gIH1cbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSwgJ2NvbXAnKTtcbn07XG5cbmNvbnN0IGdldE5leHRTaGlwID0gKCkgPT4ge1xuICBjb25zdCBzaGlwc1BsYWNlZCA9IHBsYXllcnMucDEuYm9hcmQuc2hpcHMubGVuZ3RoO1xuICByZXR1cm4gaGVscGVycy5uZXh0U2hpcExlbmd0aChzaGlwc1BsYWNlZCk7XG59O1xuXG5jb25zdCBwbGFjZVNoaXAgPSAoZSkgPT4ge1xuICBjb25zdCB7IHAxIH0gPSBwbGF5ZXJzO1xuICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdib2FyZCcpIHx8IHAxLmJvYXJkLnNoaXBzLmxlbmd0aCA9PT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0SW5kZXggPSBoZWxwZXJzLmdldENlbGxJbmZvKGUudGFyZ2V0KTtcbiAgY29uc3QgYWxsTm9kZXMgPSBzaGlwQnVpbGRlci5nZXRQcmV2aWV3KCk7XG4gIGNvbnN0IGxlbmd0aCA9IGdldE5leHRTaGlwKCk7XG4gIGNvbnN0IGF4aXMgPSBzaGlwQnVpbGRlci5nZXRBeGlzKCk7XG5cbiAgaWYgKHNoaXBCdWlsZGVyLmlzUHJldmlld1ZhbGlkKGFsbE5vZGVzLCBsZW5ndGgpKSB7XG4gICAgcDEuYm9hcmQucGxhY2VTaGlwKGxlbmd0aCwgc3RhcnRJbmRleCwgYXhpcyk7XG4gICAgc2hpcEJ1aWxkZXIuY2xlYXJQcmV2aWV3KCk7XG4gICAgZG9tLnJlbmRlclNoaXBzKHAxKTtcblxuICAgIGlmIChwMS5ib2FyZC5zaGlwcy5sZW5ndGggPT09IDUpIHtcbiAgICAgIGRvbS50b2dnbGVCdG5zKCdzdGFydCcsIGZhbHNlKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB7XG4gIG5ld0dhbWUsXG4gIHN0YXJ0R2FtZSxcbiAgcmVjZWl2ZVBsYXllck1vdmUsXG4gIHBsYWNlU2hpcCxcbiAgZ2V0TmV4dFNoaXAsXG4gIHBsYXllcnMsXG59O1xuIiwiaW1wb3J0IHNoaXBGYWN0b3J5IGZyb20gJy4vc2hpcEZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnYW1lYm9hcmRGYWN0b3J5KCkge1xuICBjb25zdCBjcmVhdGVCb2FyZCA9ICgpID0+IHtcbiAgICBjb25zdCBnYW1lYm9hcmQgPSBuZXcgQXJyYXkoMTApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZ2FtZWJvYXJkW2ldID0ge307XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgZ2FtZWJvYXJkW2ldW2pdID0ge1xuICAgICAgICAgIGhpdDogZmFsc2UsXG4gICAgICAgICAgc2hpcElkOiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2FtZWJvYXJkO1xuICB9O1xuICAvLyBjb25zdCBtaXNzZXMgPSBbXTtcbiAgY29uc3QgdGlsZXMgPSBjcmVhdGVCb2FyZCgpO1xuXG4gIGNvbnN0IHNoaXBzID0gW107XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKGxlbmd0aCwgW3gsIHldLCBheGlzKSA9PiB7XG4gICAgY29uc3QgbmV3U2hpcCA9IHNoaXBGYWN0b3J5KHNoaXBzLmxlbmd0aCwgbGVuZ3RoKTtcbiAgICBzaGlwcy5wdXNoKG5ld1NoaXApO1xuICAgIGlmIChheGlzID09PSAneCcpIHtcbiAgICAgIC8vIFBsYWNlIGhvcml6b250YWxseVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5ld1NoaXAuY29vcmRzLnB1c2goW3gsIHldKTtcbiAgICAgICAgdGlsZXNbeF1beV0uc2hpcElkID0gbmV3U2hpcC5pZDtcbiAgICAgICAgeCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgICAvLyBQbGFjZSB2ZXJ0aWNhbGx5XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1NoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmV3U2hpcC5jb29yZHMucHVzaChbeCwgeV0pO1xuICAgICAgICB0aWxlc1t4XVt5XS5zaGlwSWQgPSBuZXdTaGlwLmlkO1xuICAgICAgICB5ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIGNvbnN0IGhhc1NoaXAgPSAodGlsZSkgPT4gdGlsZS5zaGlwSWQgIT09IG51bGw7XG5cbiAgY29uc3QgaGFzU2hpcCA9ICh4LCB5KSA9PiB0aWxlc1t4XVt5XS5zaGlwSWQgIT09IG51bGw7XG5cbiAgY29uc3QgZmluZFNoaXAgPSAoaWQpID0+IHtcbiAgICBsZXQgdGhpc1NoaXA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNoaXBzW2ldLmlkID09PSBpZCkge1xuICAgICAgICB0aGlzU2hpcCA9IHNoaXBzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1NoaXA7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9ICh0YXJnZXQpID0+IHtcbiAgICBjb25zdCBbeCwgeV0gPSB0YXJnZXQ7XG4gICAgY29uc3QgdGhpc1RpbGUgPSB0aWxlc1t4XVt5XTtcbiAgICBpZiAodGhpc1RpbGUuaGl0KSByZXR1cm47XG5cbiAgICAvLyBpZiAoIWhhc1NoaXAodGhpc1RpbGUpKSB7XG4gICAgLy8gICBtaXNzZXMucHVzaCh0YXJnZXQpO1xuICAgIC8vIH1cbiAgICBpZiAoaGFzU2hpcCh4LCB5KSkge1xuICAgICAgY29uc3QgdGhpc1NoaXAgPSBmaW5kU2hpcCh0aGlzVGlsZS5zaGlwSWQpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzU2hpcC5jb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXNTaGlwLmNvb3Jkc1tpXS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZSA9PT0gdGFyZ2V0W2luZGV4XSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpc1NoaXAuaGVhbHRoW2ldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzVGlsZS5oaXQgPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHNoaXBzUmVtYWluaW5nID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpbHRlclNoaXBzID0gc2hpcHMuZmlsdGVyKChzaGlwKSA9PiBzaGlwLmlzU3VuaygpID09PSBmYWxzZSk7XG4gICAgcmV0dXJuIGZpbHRlclNoaXBzLmxlbmd0aDtcbiAgfTtcblxuICBjb25zdCBhbGxTaGlwc1N1bmsgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3Vua1NoaXBzID0gc2hpcHNSZW1haW5pbmcoKTtcbiAgICByZXR1cm4gc3Vua1NoaXBzID09PSAwO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdGlsZXMsXG4gICAgc2hpcHMsXG4gICAgcGxhY2VTaGlwLFxuICAgIGhhc1NoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBzaGlwc1JlbWFpbmluZyxcbiAgICBhbGxTaGlwc1N1bmssXG4gIH07XG59XG4iLCJjb25zdCBnZXRDZWxsSW5mbyA9ICh0YXJnZXQpID0+IHtcbiAgcmV0dXJuIFtOdW1iZXIodGFyZ2V0LmRhdGFzZXQueCksIE51bWJlcih0YXJnZXQuZGF0YXNldC55KV07XG59O1xuXG5jb25zdCBhbHJlYWR5UGxheWVkID0gKHBsYXllciwgdGFyZ2V0KSA9PiB7XG4gIGNvbnN0IHByZXZpb3VzTW92ZXMgPSBwbGF5ZXIubW92ZXM7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNNb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwcmV2aW91c01vdmVzW2ldLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSB0YXJnZXRbaW5kZXhdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IHRpbWVvdXQgPSAobXMpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XG4gIH0pO1xufTtcblxuY29uc3QgZ2V0UmFuZG9tVGlsZSA9ICgpID0+IHtcbiAgY29uc3QgcmFuZG9tID0gW1xuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gIF07XG4gIHJldHVybiByYW5kb207XG59O1xuXG5jb25zdCBnZXRFbXB0eVRpbGVzID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB7IGJvYXJkIH0gPSBwbGF5ZXI7XG4gIGNvbnN0IHsgdGlsZXMgfSA9IGJvYXJkO1xuICBjb25zdCBlbXB0eVRpbGVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IE9iamVjdC5rZXlzKHRpbGVzW2ldKS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgaGFzU2hpcCA9IGJvYXJkLmhhc1NoaXAoaSwgaik7XG4gICAgICBpZiAoIWhhc1NoaXApIHtcbiAgICAgICAgY29uc3QgY29vcmQgPSBbaSwgal07XG4gICAgICAgIGVtcHR5VGlsZXMucHVzaChjb29yZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBlbXB0eVRpbGVzO1xufTtcblxuY29uc3QgZ2V0UmFuZG9tRW1wdHkgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IGVtcHR5VGlsZXMgPSBnZXRFbXB0eVRpbGVzKHBsYXllcik7XG5cbiAgcmV0dXJuIGVtcHR5VGlsZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZW1wdHlUaWxlcy5sZW5ndGgpXTtcbn07XG5cbmNvbnN0IG5leHRTaGlwTGVuZ3RoID0gKG51bVNoaXBzUGxhY2VkKSA9PiB7XG4gIHN3aXRjaCAobnVtU2hpcHNQbGFjZWQpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gNTtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gNDtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gMztcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gMztcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gMjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbmNvbnN0IGdldFJhbmRvbUF4aXMgPSAoKSA9PiBbJ3gnLCAneSddW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpXTtcblxuZXhwb3J0IHtcbiAgZ2V0Q2VsbEluZm8sXG4gIGFscmVhZHlQbGF5ZWQsXG4gIHRpbWVvdXQsXG4gIGdldFJhbmRvbVRpbGUsXG4gIGdldEVtcHR5VGlsZXMsXG4gIGdldFJhbmRvbUVtcHR5LFxuICBuZXh0U2hpcExlbmd0aCxcbiAgZ2V0UmFuZG9tQXhpcyxcbn07XG4iLCJpbXBvcnQgZ2FtZWJvYXJkRmFjdG9yeSBmcm9tICcuL2dhbWVib2FyZEZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbGF5ZXJGYWN0b3J5KG51bSwgaHVtYW4pIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZWJvYXJkRmFjdG9yeSgpO1xuICBjb25zdCBtb3ZlcyA9IFtdO1xuICBjb25zdCBtYWtlTW92ZSA9ICh0YXJnZXQsIGVuZW15Qm9hcmQpID0+IHtcbiAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2sodGFyZ2V0KTtcbiAgICBtb3Zlcy5wdXNoKHRhcmdldCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgbnVtKCkge1xuICAgICAgcmV0dXJuIG51bTtcbiAgICB9LFxuICAgIGdldCBib2FyZCgpIHtcbiAgICAgIHJldHVybiBnYW1lYm9hcmQ7XG4gICAgfSxcbiAgICBnZXQgaXNIdW1hbigpIHtcbiAgICAgIHJldHVybiBodW1hbjtcbiAgICB9LFxuICAgIC8vIGdldCB0dXJuKCkge1xuICAgIC8vICAgcmV0dXJuIHR1cm47XG4gICAgLy8gfSxcbiAgICBnZXQgbW92ZXMoKSB7XG4gICAgICByZXR1cm4gbW92ZXM7XG4gICAgfSxcbiAgICBtYWtlTW92ZSxcbiAgfTtcbn1cbiIsImltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcblxuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyLWJvYXJkJyk7XG5cbi8vIFNoaXAgcm90YXRpb24gd2hlcmUgeCA9IHBsYWNlIGhvcml6b250YWxseSwgeSA9IHBsYWNlIHZlcnRpY2FsbHlcbmNvbnN0IGF4ZXMgPSB7XG4gIHg6IHRydWUsXG4gIHk6IGZhbHNlLFxufTtcblxuY29uc3QgZ2V0QXhpcyA9ICgpID0+IHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGF4ZXMpO1xuICByZXR1cm4ga2V5cy5maWx0ZXIoKGtleSkgPT4gYXhlc1trZXldID09PSB0cnVlKVswXTtcbn07XG5cbmNvbnN0IHN3aXRjaEF4aXMgPSAoKSA9PiB7XG4gIGF4ZXMueCA9ICFheGVzLng7XG4gIGF4ZXMueSA9ICFheGVzLng7XG59O1xuXG4vLyBSZXR1cm5zIGFycmF5IG9mIFt4LCB5XSBjb29yZHMgb2YgYSBzaGlwIG9mIGxlbmd0aCwgYnVpbHQgb24gYXhpcywgYXQgc3RhcnQgaW5kZXhcbmNvbnN0IGJ1aWxkU2hpcCA9IChzdGFydCwgYXhpcywgbGVuZ3RoKSA9PiB7XG4gIGNvbnN0IFt4LCB5XSA9IHN0YXJ0O1xuICBjb25zdCBzaGlwQ29vcmRzID0gW107XG5cbiAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHNoaXBDb29yZHMucHVzaChbaSArIHgsIHldKTtcbiAgICB9XG4gIH1cblxuICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKFt4LCBpICsgeV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzaGlwQ29vcmRzO1xufTtcblxuLyogVmFsaWQgY2hlY2tzIGZvciBzaGlwIG9iamVjdCBvbiBib2FyZCBvYmplY3QgKi9cbi8vICBDaGVjayBpZiBzaGlwIG9mIGxlbmd0aCAmIGF4aXMgZml0cyB3aXRoaW4gMTB4MTAgZ2FtZWJvYXJkIGJvdW5kYXJpZXNcbmNvbnN0IGRvZXNTaGlwRml0ID0gKGxlbmd0aCwgYXhpcywgc3RhcnRJbmRleCkgPT4ge1xuICBjb25zdCBbeCwgeV0gPSBzdGFydEluZGV4O1xuICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgcmV0dXJuIHggKyBsZW5ndGggLSAxIDw9IDk7XG4gIH1cbiAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgIHJldHVybiB5ICsgbGVuZ3RoIC0gMSA8PSA5O1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIENoZWNrcyBzaGlwIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbm90aGVyXG5jb25zdCBub092ZXJsYXAgPSAoc2hpcCwgcGxheWVyKSA9PiB7XG4gIGNvbnN0IHsgYm9hcmQgfSA9IHBsYXllcjtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgW3gsIHldID0gc2hpcFtpXTtcbiAgICBpZiAoYm9hcmQuaGFzU2hpcCh4LCB5KSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qIFByZXZpZXdpbmcgc2hpcCBwbGFjZW1lbnQgb24gRE9NICovXG5jb25zdCBpc1ByZXZpZXdWYWxpZCA9IChjb29yZHMsIGxlbmd0aCkgPT4ge1xuICBjb25zdCBpc1dpdGhpbkJvdW5kcyA9IGNvb3Jkcy5sZW5ndGggPT09IGxlbmd0aDtcbiAgY29uc3Qgbm9PdGhlclNoaXBzID0gY29vcmRzLmV2ZXJ5KFxuICAgIChjb29yZCkgPT4gIWNvb3JkLmNsYXNzTGlzdC5jb250YWlucygnc2hpcCcpXG4gICk7XG4gIHJldHVybiBpc1dpdGhpbkJvdW5kcyAmJiBub090aGVyU2hpcHM7XG59O1xuXG5jb25zdCBidWlsZFByZXZpZXcgPSAoc3RhcnQsIGxlbmd0aCwgYXhpcywgYm9hcmQpID0+IHtcbiAgY29uc3QgW3gsIHldID0gc3RhcnQ7XG4gIGNvbnN0IHNoaXBDb29yZHMgPSBbXTtcblxuICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgLy8gPjkgPSBvdXQgb2YgYm91bmRzXG4gICAgICBpZiAoaSArIHggPiA5KSBicmVhaztcbiAgICAgIGNvbnN0IG5leHRDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7aSArIHh9J11bZGF0YS15PScke3l9J11gXG4gICAgICApO1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKG5leHRDZWxsKTtcbiAgICB9XG4gIH1cblxuICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgLy8gPjkgPSBvdXQgb2YgYm91bmRzXG4gICAgICBpZiAoaSArIHkgPiA5KSBicmVhaztcblxuICAgICAgY29uc3QgbmV4dENlbGwgPSBib2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEteD0nJHt4fSddW2RhdGEteT0nJHtpICsgeX0nXWBcbiAgICAgICk7XG4gICAgICBzaGlwQ29vcmRzLnB1c2gobmV4dENlbGwpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzaGlwQ29vcmRzO1xufTtcblxuY29uc3QgcHJldmlld1NoaXAgPSAoZSwgbGVuZ3RoKSA9PiB7XG4gIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2JvYXJkJykgfHwgbGVuZ3RoID09PSBudWxsKSByZXR1cm47XG5cbiAgY29uc3Qgc3RhcnRpbmdJbmRleCA9IGhlbHBlcnMuZ2V0Q2VsbEluZm8oZS50YXJnZXQpO1xuICBjb25zdCBheGlzID0gZ2V0QXhpcygpO1xuICBjb25zdCBzaGlwQ29vcmRzID0gYnVpbGRQcmV2aWV3KHN0YXJ0aW5nSW5kZXgsIGxlbmd0aCwgYXhpcywgcGxheWVyQm9hcmQpO1xuICBjb25zdCB2YWxpZFByZXZpZXcgPSBpc1ByZXZpZXdWYWxpZChzaGlwQ29vcmRzLCBsZW5ndGgpO1xuXG4gIGlmICh2YWxpZFByZXZpZXcpIHtcbiAgICBzaGlwQ29vcmRzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcC1wcmV2aWV3JykpO1xuICB9IGVsc2Uge1xuICAgIHNoaXBDb29yZHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJykpO1xuICB9XG59O1xuXG5jb25zdCBjbGVhclByZXZpZXcgPSAoKSA9PiB7XG4gIGNvbnN0IGNlbGxzID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwLXByZXZpZXcnLCAnaW52YWxpZCcpKTtcbn07XG5cbmNvbnN0IGdldFByZXZpZXcgPSAoKSA9PiBbLi4ucGxheWVyQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLnNoaXAtcHJldmlldycpXTtcblxuZXhwb3J0IHtcbiAgYnVpbGRTaGlwLFxuICBub092ZXJsYXAsXG4gIGRvZXNTaGlwRml0LFxuICBpc1ByZXZpZXdWYWxpZCxcbiAgZ2V0QXhpcyxcbiAgc3dpdGNoQXhpcyxcbiAgcHJldmlld1NoaXAsXG4gIGNsZWFyUHJldmlldyxcbiAgZ2V0UHJldmlldyxcbn07XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGlwRmFjdG9yeShpZCwgbGVuZ3RoKSB7XG4gIGNvbnN0IGNyZWF0ZUhlYWx0aCA9IChzaXplKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBbLi4uQXJyYXkoc2l6ZSkua2V5cygpXTtcbiAgICBjb25zdCBoZWFsdGggPSBhcnJheS5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgIHByZXZbY3Vycl0gPSBmYWxzZTtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gaGVhbHRoO1xuICB9O1xuXG4gIGNvbnN0IGNvb3JkcyA9IFtdO1xuXG4gIGNvbnN0IGhlYWx0aCA9IGNyZWF0ZUhlYWx0aChsZW5ndGgpO1xuICAvLyBoZWFsdGggPSB7IHdoZXJlIGJvb2wgcmVwcmVzZW50cyBoaXQvbm8gaGl0XG4gIC8vICAgMDogZmFsc2UsXG4gIC8vICAgMTogZmFsc2UsXG4gIC8vICAgMjogZmFsc2UsXG4gIC8vIH1cbiAgY29uc3QgaGl0ID0gKGluZGV4KSA9PiB7XG4gICAgaGVhbHRoW2luZGV4XSA9IHRydWU7XG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGhlYWx0aCkuZXZlcnkoKGluZGV4KSA9PiBpbmRleCA9PT0gdHJ1ZSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpZCxcbiAgICBsZW5ndGgsXG4gICAgaGVhbHRoLFxuICAgIGNvb3JkcyxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICB9O1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vc3R5bGUuY3NzJztcbmltcG9ydCAqIGFzIGdhbWUgZnJvbSAnLi9tb2R1bGVzL2dhbWUnO1xuaW1wb3J0ICogYXMgZG9tIGZyb20gJy4vbW9kdWxlcy9kb20nO1xuaW1wb3J0ICogYXMgZXZlbnRDb250cm9sbGVyIGZyb20gJy4vbW9kdWxlcy9ldmVudENvbnRyb2xsZXInO1xuXG5kb20uY3JlYXRlQm9hcmRzKCk7XG5nYW1lLm5ld0dhbWUoKTtcblxuZXZlbnRDb250cm9sbGVyLmluaXRCb2FyZEV2ZW50cygpO1xuZXZlbnRDb250cm9sbGVyLmluaXRHYW1lQnV0dG9ucygpO1xuZXZlbnRDb250cm9sbGVyLmluaXRTaGlwUGxhY2VtZW50KCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=