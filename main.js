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

  // shipLengths.forEach((length) => {
  //   const ship = randomShip(player, length);

  //   player.board.placeShip(length, ...ship);
  // });
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
      // const thisCell = playerBoard.querySelector(
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

  // const undoBtn = document.querySelector('#undo-ship');

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
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'com');
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'player');
};

const startGame = () => {
  _botLogic__WEBPACK_IMPORTED_MODULE_4__.autoPlace(players.com);
  _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('start', true);
  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(players.com);
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'player');
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'com');

  // Remove
  // dom.renderShips(players.com);
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

    const shipsPlacedEnd = getShipsPlaced();
    if (shipsPlacedEnd === 5) _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('start', false);
  }
};

const autoPlacePlayer = () => {
  const { p1 } = players;
  const shipsPlaced = getShipsPlaced();

  _botLogic__WEBPACK_IMPORTED_MODULE_4__.autoPlace(p1, shipsPlaced);
  _dom__WEBPACK_IMPORTED_MODULE_1__.renderShips(p1);
  const shipsPlacedEnd = getShipsPlaced();
  if (shipsPlacedEnd === 5) _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('start', false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMzQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBV0U7Ozs7Ozs7Ozs7Ozs7OztBQ2pKYTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNsQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ05xQjtBQUNrQjtBQUNGO0FBQ3dCOztBQUU3RCxzREFBZ0I7QUFDaEIsa0RBQVk7O0FBRVoscUVBQStCO0FBQy9CLHFFQUErQjtBQUMvQix1RUFBaUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvYm90TG9naWMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZXZlbnRDb250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lYm9hcmRGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9oZWxwZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXJGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgc2hpcEJ1aWxkZXIgZnJvbSAnLi9zaGlwQnVpbGRlcic7XG5cbi8vIFJhbmRvbSBtb3ZlIChhdHRhY2spXG5jb25zdCBhdXRvQXR0YWNrID0gYXN5bmMgKHBsYXllcikgPT4ge1xuICBsZXQgcmFuZG9tTW92ZSA9IGhlbHBlcnMuZ2V0UmFuZG9tVGlsZSgpO1xuICB3aGlsZSAoaGVscGVycy5hbHJlYWR5UGxheWVkKHBsYXllciwgcmFuZG9tTW92ZSkpIHtcbiAgICByYW5kb21Nb3ZlID0gaGVscGVycy5nZXRSYW5kb21UaWxlKCk7XG4gIH1cbiAgYXdhaXQgaGVscGVycy50aW1lb3V0KDQwMCk7XG4gIHJldHVybiByYW5kb21Nb3ZlO1xufTtcblxuLyogUmFuZG9tIHNoaXAgcGxhY2VtZW50ICovXG4vKiBSZXR1cm5zIGEgcmFuZG9tIHN0YXJ0aW5nSW5kZXggJiBheGlzICh0byBwbGFjZSBhIHNoaXApIHRoYXQgd2lsbCBmaXQgd2l0aGluIFxuICAxMHgxMCBib2FyZCAqL1xuY29uc3QgZ2V0VmFsaWRTdGFydCA9IChwbGF5ZXIsIGxlbmd0aCkgPT4ge1xuICBsZXQgc3RhcnRJbmRleDtcbiAgbGV0IGF4aXM7XG4gIGxldCBzaGlwRml0cyA9IGZhbHNlO1xuICB3aGlsZSAoIXNoaXBGaXRzKSB7XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBoZWxwZXJzLmdldFJhbmRvbUVtcHR5KHBsYXllcik7XG4gICAgY29uc3QgcmFuZG9tQXhpcyA9IGhlbHBlcnMuZ2V0UmFuZG9tQXhpcygpO1xuICAgIHNoaXBGaXRzID0gc2hpcEJ1aWxkZXIuZG9lc1NoaXBGaXQobGVuZ3RoLCByYW5kb21BeGlzLCByYW5kb21JbmRleCk7XG4gICAgc3RhcnRJbmRleCA9IHJhbmRvbUluZGV4O1xuICAgIGF4aXMgPSByYW5kb21BeGlzO1xuICB9XG4gIHJldHVybiBbc3RhcnRJbmRleCwgYXhpc107XG59O1xuXG4vKiBHZW5lcmF0ZXMgYSByYW5kb20gc2hpcCBwb3NpdGlvbiB0aGF0IHBhc3NlcyBjaGVja3M6XG4gIDEuIHNoaXAgb2YgbGVuZ3RoIGEsIHBsYWNlZCBvbiBheGlzIGIgd2lsbCBmaXQgd2l0aGluIHRoZSAxMHgxMCBib2FyZFxuICAyLiBzaGlwIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbiBhbHJlYWR5IHBsYWNlZCBzaGlwICovXG5jb25zdCByYW5kb21TaGlwID0gKHBsYXllciwgbGVuZ3RoKSA9PiB7XG4gIGxldCBzdGFydDtcbiAgbGV0IGF4aXM7XG4gIGxldCB2YWxpZCA9IGZhbHNlO1xuICB3aGlsZSAoIXZhbGlkKSB7XG4gICAgY29uc3QgW3JhbmRvbUluZGV4LCByYW5kb21BeGlzXSA9IGdldFZhbGlkU3RhcnQocGxheWVyLCBsZW5ndGgpO1xuICAgIGNvbnN0IHNoaXAgPSBzaGlwQnVpbGRlci5idWlsZFNoaXAocmFuZG9tSW5kZXgsIHJhbmRvbUF4aXMsIGxlbmd0aCk7XG4gICAgdmFsaWQgPSBzaGlwQnVpbGRlci5ub092ZXJsYXAoc2hpcCwgcGxheWVyKTtcbiAgICBzdGFydCA9IHJhbmRvbUluZGV4O1xuICAgIGF4aXMgPSByYW5kb21BeGlzO1xuICB9XG4gIHJldHVybiBbc3RhcnQsIGF4aXNdO1xufTtcblxuY29uc3QgYXV0b1BsYWNlID0gKHBsYXllciwgc2hpcHNTb0ZhciA9IDApID0+IHtcbiAgY29uc3Qgc2hpcHMgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgZm9yIChsZXQgaSA9IHNoaXBzU29GYXI7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGxlbmd0aCA9IHNoaXBzW2ldO1xuICAgIGNvbnN0IHNoaXAgPSByYW5kb21TaGlwKHBsYXllciwgbGVuZ3RoKTtcbiAgICBwbGF5ZXIuYm9hcmQucGxhY2VTaGlwKGxlbmd0aCwgLi4uc2hpcCk7XG4gIH1cblxuICAvLyBzaGlwTGVuZ3Rocy5mb3JFYWNoKChsZW5ndGgpID0+IHtcbiAgLy8gICBjb25zdCBzaGlwID0gcmFuZG9tU2hpcChwbGF5ZXIsIGxlbmd0aCk7XG5cbiAgLy8gICBwbGF5ZXIuYm9hcmQucGxhY2VTaGlwKGxlbmd0aCwgLi4uc2hpcCk7XG4gIC8vIH0pO1xufTtcblxuZXhwb3J0IHsgYXV0b0F0dGFjaywgYXV0b1BsYWNlIH07XG4iLCJjb25zdCBnYW1lYm9hcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkJyk7XG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcbmNvbnN0IGNvbUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbS1ib2FyZCcpO1xuY29uc3QgZ2FtZUluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ2FtZS1pbmZvJyk7XG5cbmNvbnN0IHVwZGF0ZVNoaXBDb3VudCA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbUJvYXJkO1xuICBjb25zdCBzaGlwQ291bnRlciA9IHRoaXNCb2FyZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICBjb25zdCBzaGlwc1JlbWFpbmluZyA9IHBsYXllci5ib2FyZC5zaGlwc1JlbWFpbmluZygpO1xuXG4gIHNoaXBDb3VudGVyLnRleHRDb250ZW50ID0gYFNoaXBzIHJlbWFpbmluZzogJHtzaGlwc1JlbWFpbmluZ31gO1xufTtcblxuY29uc3QgY3JlYXRlQm9hcmRzID0gKCkgPT4ge1xuICBnYW1lYm9hcmRzLmZvckVhY2goKGJvYXJkKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgY29uc3QgYm9hcmRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgYm9hcmRDZWxsLmNsYXNzTGlzdC5hZGQoJ2JvYXJkLWNlbGwnKTtcbiAgICAgICAgYm9hcmRDZWxsLmRhdGFzZXQueCA9IGo7XG4gICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnkgPSBpO1xuICAgICAgICBib2FyZC5hcHBlbmRDaGlsZChib2FyZENlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5jb25zdCByZW5kZXJTaGlwcyA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBwbGF5ZXIuaXNIdW1hbiA/IHBsYXllckJvYXJkIDogY29tQm9hcmQ7XG4gIGNvbnN0IHsgc2hpcHMgfSA9IHBsYXllci5ib2FyZDtcbiAgY29uc3QgY29vcmRzID0gc2hpcHMubWFwKChzaGlwKSA9PiBzaGlwLmNvb3Jkcyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvb3Jkc1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgW3gsIHldID0gW2Nvb3Jkc1tpXVtqXVswXSwgY29vcmRzW2ldW2pdWzFdXTtcbiAgICAgIC8vIGNvbnN0IHRoaXNDZWxsID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgIGNvbnN0IHRoaXNDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihgW2RhdGEteD0nJHt4fSddW2RhdGEteT0nJHt5fSddYCk7XG4gICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgfVxuICB9XG4gIHVwZGF0ZVNoaXBDb3VudChwbGF5ZXIpO1xufTtcblxuY29uc3QgdXBkYXRlQm9hcmQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IHBsYXllci5pc0h1bWFuID8gcGxheWVyQm9hcmQgOiBjb21Cb2FyZDtcbiAgY29uc3QgeyBib2FyZCB9ID0gcGxheWVyO1xuICBjb25zdCB7IHRpbGVzIH0gPSBib2FyZDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgT2JqZWN0LmtleXModGlsZXNbaV0pLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB0aGlzVGlsZSA9IHRpbGVzW2ldW2pdO1xuICAgICAgY29uc3QgaGFzU2hpcCA9IGJvYXJkLmhhc1NoaXAoaSwgaik7XG4gICAgICBpZiAodGhpc1RpbGUuaGl0KSB7XG4gICAgICAgIGNvbnN0IHRoaXNDZWxsID0gdGhpc0JvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgYFtkYXRhLXg9JyR7aX0nXVtkYXRhLXk9JyR7an0nXWBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGhhc1NoaXApIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdXBkYXRlU2hpcENvdW50KHBsYXllcik7XG59O1xuXG5jb25zdCBzdHlsZUdhbWVPdmVyID0gKGJvb2wpID0+IHtcbiAgaWYgKGJvb2wpIHtcbiAgICBnYW1lYm9hcmRzLmZvckVhY2goKGJvYXJkKSA9PiBib2FyZC5jbGFzc0xpc3QuYWRkKCdnYW1lLW92ZXInKSk7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4gYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnZ2FtZS1vdmVyJykpO1xuICB9XG59O1xuXG5jb25zdCBjbGVhclVJID0gKC4uLnBsYXllcnMpID0+IHtcbiAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4ge1xuICAgIGNvbnN0IGNlbGxzID0gYm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ21pc3MnLCAnaGl0JywgJ3NoaXAnKTtcbiAgICB9KTtcbiAgfSk7XG4gIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB1cGRhdGVTaGlwQ291bnQocGxheWVyKSk7XG4gIHN0eWxlR2FtZU92ZXIoZmFsc2UpO1xufTtcblxuY29uc3QgYW5ub3VuY2VHYW1lT3ZlciA9ICh3aW5uZXIpID0+IHtcbiAgY29uc3Qgd2luTWVzc2FnZSA9XG4gICAgd2lubmVyLm51bSA9PT0gMVxuICAgICAgPyAnQ29uZ3JhdHVsYXRpb25zISBZb3Ugd2luISdcbiAgICAgIDogJ0dhbWUgb3ZlciAuLi4gQ29tcHV0ZXIgd2lucyEnO1xuXG4gIGdhbWVJbmZvLnRleHRDb250ZW50ID0gd2luTWVzc2FnZTtcbiAgc3R5bGVHYW1lT3Zlcih0cnVlKTtcbn07XG5cbmNvbnN0IGRpc2FibGVFdmVudHMgPSAoYm9vbCwgYm9hcmQpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gYm9hcmQgPT09ICdjb20nID8gY29tQm9hcmQgOiBwbGF5ZXJCb2FyZDtcbiAgaWYgKGJvb2wpIHtcbiAgICB0aGlzQm9hcmQuY2xhc3NMaXN0LmFkZCgnbm8tZXZlbnRzJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpc0JvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ25vLWV2ZW50cycpO1xuICB9XG59O1xuXG5jb25zdCB0b2dnbGVCdG5zID0gKGJ1dHRvbiwgc3RhdGUpID0+IHtcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnQtYnRuJyk7XG4gIGNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzdGFydC1idG4nKTtcblxuICBpZiAoYnV0dG9uID09PSAnc3RhcnQnKSB7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICBzdGFydEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGJ1dHRvbiA9PT0gJ3Jlc3RhcnQnKSB7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICByZXN0YXJ0QnRuLnRleHRDb250ZW50ID0gJ05ldyBnYW1lJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdGFydEJ0bi50ZXh0Q29udGVudCA9ICdSZXN0YXJ0JztcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB7XG4gIGNyZWF0ZUJvYXJkcyxcbiAgY2xlYXJVSSxcbiAgcmVuZGVyU2hpcHMsXG4gIHVwZGF0ZUJvYXJkLFxuICBkaXNhYmxlRXZlbnRzLFxuICBhbm5vdW5jZUdhbWVPdmVyLFxuICB0b2dnbGVCdG5zLFxufTtcbiIsImltcG9ydCAqIGFzIGdhbWUgZnJvbSAnLi9nYW1lJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCAqIGFzIHNoaXBCdWlsZGVyIGZyb20gJy4vc2hpcEJ1aWxkZXInO1xuXG5jb25zdCBpbml0Qm9hcmRFdmVudHMgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbUNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2NvbS1ib2FyZCAuYm9hcmQtY2VsbCcpO1xuICBjb21DZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGhlbHBlcnMuZ2V0Q2VsbEluZm8oZS50YXJnZXQpO1xuICAgICAgZ2FtZS5yZWNlaXZlUGxheWVyTW92ZShjb29yZCk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuY29uc3QgaW5pdEdhbWVCdXR0b25zID0gKCkgPT4ge1xuICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc3RhcnQtYnRuJyk7XG4gIHJlc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLm5ld0dhbWUpO1xuXG4gIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0YXJ0LWJ0bicpO1xuICBzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUuc3RhcnRHYW1lKTtcblxuICBjb25zdCBhdXRvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2F1dG8tc2hpcCcpO1xuICBhdXRvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5hdXRvUGxhY2VQbGF5ZXIpO1xuXG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb3RhdGUtc2hpcCcpO1xuICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzaGlwQnVpbGRlci5zd2l0Y2hBeGlzKTtcblxuICAvLyBjb25zdCB1bmRvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VuZG8tc2hpcCcpO1xuXG4gIGNvbnN0IHJlc2V0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc2V0LXNoaXAnKTtcbiAgcmVzZXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLm5ld0dhbWUpO1xufTtcblxuY29uc3QgaW5pdFNoaXBQbGFjZW1lbnQgPSAoKSA9PiB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXllci1ib2FyZCcpO1xuICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgIGNvbnN0IHNoaXBzUGxhY2VkID0gZ2FtZS5nZXRTaGlwc1BsYWNlZCgpO1xuICAgIGNvbnN0IG5leHRTaGlwID0gaGVscGVycy5uZXh0U2hpcExlbmd0aChzaGlwc1BsYWNlZCk7XG4gICAgc2hpcEJ1aWxkZXIucHJldmlld1NoaXAoZSwgbmV4dFNoaXApO1xuICB9KTtcbiAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBzaGlwQnVpbGRlci5jbGVhclByZXZpZXcpO1xuICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUucGxhY2VTaGlwKTtcbn07XG5cbmV4cG9ydCB7IGluaXRCb2FyZEV2ZW50cywgaW5pdEdhbWVCdXR0b25zLCBpbml0U2hpcFBsYWNlbWVudCB9O1xuIiwiaW1wb3J0IHBsYXllckZhY3RvcnkgZnJvbSAnLi9wbGF5ZXJGYWN0b3J5JztcbmltcG9ydCAqIGFzIGRvbSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgKiBhcyBzaGlwQnVpbGRlciBmcm9tICcuL3NoaXBCdWlsZGVyJztcbmltcG9ydCAqIGFzIGJvdExvZ2ljIGZyb20gJy4vYm90TG9naWMnO1xuXG5jb25zdCBwbGF5ZXJzID0ge1xuICBwMTogbnVsbCxcbiAgY29tOiBudWxsLFxufTtcblxuY29uc3QgY2hlY2tHYW1lU3RhdGUgPSAocGxheWVyKSA9PiBwbGF5ZXIuYm9hcmQuYWxsU2hpcHNTdW5rKCk7XG5cbmNvbnN0IG5ld0dhbWUgPSAoKSA9PiB7XG4gIHBsYXllcnMucDEgPSBwbGF5ZXJGYWN0b3J5KDEsIHRydWUpO1xuICBwbGF5ZXJzLmNvbSA9IHBsYXllckZhY3RvcnkoMiwgZmFsc2UpO1xuXG4gIGRvbS5jbGVhclVJKHBsYXllcnMucDEsIHBsYXllcnMuY29tKTtcbiAgZG9tLnRvZ2dsZUJ0bnMoJ3N0YXJ0JywgdHJ1ZSk7XG4gIGRvbS50b2dnbGVCdG5zKCdyZXN0YXJ0JywgZmFsc2UpO1xuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlLCAnY29tJyk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlLCAncGxheWVyJyk7XG59O1xuXG5jb25zdCBzdGFydEdhbWUgPSAoKSA9PiB7XG4gIGJvdExvZ2ljLmF1dG9QbGFjZShwbGF5ZXJzLmNvbSk7XG4gIGRvbS50b2dnbGVCdG5zKCdzdGFydCcsIHRydWUpO1xuICBkb20udXBkYXRlQm9hcmQocGxheWVycy5jb20pO1xuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlLCAncGxheWVyJyk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlLCAnY29tJyk7XG5cbiAgLy8gUmVtb3ZlXG4gIC8vIGRvbS5yZW5kZXJTaGlwcyhwbGF5ZXJzLmNvbSk7XG59O1xuXG5jb25zdCBlbmRHYW1lID0gKHdpbm5lcikgPT4ge1xuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlLCAnY29tJyk7XG4gIGRvbS50b2dnbGVCdG5zKCdyZXN0YXJ0JywgdHJ1ZSk7XG4gIGRvbS5hbm5vdW5jZUdhbWVPdmVyKHdpbm5lcik7XG59O1xuXG5jb25zdCBwbGF5Q29tTW92ZSA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBjb25zdCBjb21BdHRhY2sgPSBhd2FpdCBib3RMb2dpYy5hdXRvQXR0YWNrKGNvbSk7XG5cbiAgY29tLm1ha2VNb3ZlKGNvbUF0dGFjaywgcDEuYm9hcmQpO1xuICBkb20udXBkYXRlQm9hcmQocDEpO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUocDEpO1xuICBpZiAod2luU3RhdGUpIHtcbiAgICBlbmRHYW1lKGNvbSk7XG4gIH0gZWxzZSB7XG4gICAgZG9tLmRpc2FibGVFdmVudHMoZmFsc2UsICdjb20nKTtcbiAgfVxufTtcblxuY29uc3QgcmVjZWl2ZVBsYXllck1vdmUgPSAoY29vcmQpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBpZiAoaGVscGVycy5hbHJlYWR5UGxheWVkKHAxLCBjb29yZCkpIHJldHVybjtcbiAgcDEubWFrZU1vdmUoY29vcmQsIGNvbS5ib2FyZCk7XG4gIGRvbS51cGRhdGVCb2FyZChjb20pO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUoY29tKTtcbiAgaWYgKHdpblN0YXRlKSB7XG4gICAgZW5kR2FtZShwMSk7XG4gIH0gZWxzZSB7XG4gICAgcGxheUNvbU1vdmUocDEsIGNvbSk7XG4gIH1cbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSwgJ2NvbScpO1xufTtcblxuY29uc3QgZ2V0U2hpcHNQbGFjZWQgPSAoKSA9PiBwbGF5ZXJzLnAxLmJvYXJkLnNoaXBzLmxlbmd0aDtcblxuY29uc3QgcGxhY2VTaGlwID0gKGUpID0+IHtcbiAgY29uc3QgeyBwMSB9ID0gcGxheWVycztcbiAgY29uc3Qgc2hpcHNQbGFjZWRTdGFydCA9IGdldFNoaXBzUGxhY2VkKCk7XG5cbiAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYm9hcmQnKSB8fCBzaGlwc1BsYWNlZFN0YXJ0ID49IDUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGFydEluZGV4ID0gaGVscGVycy5nZXRDZWxsSW5mbyhlLnRhcmdldCk7XG4gIGNvbnN0IG5leHRTaGlwID0gaGVscGVycy5uZXh0U2hpcExlbmd0aChzaGlwc1BsYWNlZFN0YXJ0KTtcbiAgY29uc3QgYXhpcyA9IHNoaXBCdWlsZGVyLmdldEF4aXMoKTtcbiAgY29uc3Qgc2hpcFZhbGlkID0gc2hpcEJ1aWxkZXIuaXNTaGlwVmFsaWQocDEsIHN0YXJ0SW5kZXgsIGF4aXMsIG5leHRTaGlwKTtcblxuICBpZiAoc2hpcFZhbGlkKSB7XG4gICAgcDEuYm9hcmQucGxhY2VTaGlwKG5leHRTaGlwLCBzdGFydEluZGV4LCBheGlzKTtcbiAgICBzaGlwQnVpbGRlci5jbGVhclByZXZpZXcoKTtcbiAgICBkb20ucmVuZGVyU2hpcHMocDEpO1xuXG4gICAgY29uc3Qgc2hpcHNQbGFjZWRFbmQgPSBnZXRTaGlwc1BsYWNlZCgpO1xuICAgIGlmIChzaGlwc1BsYWNlZEVuZCA9PT0gNSkgZG9tLnRvZ2dsZUJ0bnMoJ3N0YXJ0JywgZmFsc2UpO1xuICB9XG59O1xuXG5jb25zdCBhdXRvUGxhY2VQbGF5ZXIgPSAoKSA9PiB7XG4gIGNvbnN0IHsgcDEgfSA9IHBsYXllcnM7XG4gIGNvbnN0IHNoaXBzUGxhY2VkID0gZ2V0U2hpcHNQbGFjZWQoKTtcblxuICBib3RMb2dpYy5hdXRvUGxhY2UocDEsIHNoaXBzUGxhY2VkKTtcbiAgZG9tLnJlbmRlclNoaXBzKHAxKTtcbiAgY29uc3Qgc2hpcHNQbGFjZWRFbmQgPSBnZXRTaGlwc1BsYWNlZCgpO1xuICBpZiAoc2hpcHNQbGFjZWRFbmQgPT09IDUpIGRvbS50b2dnbGVCdG5zKCdzdGFydCcsIGZhbHNlKTtcbn07XG5cbmV4cG9ydCB7XG4gIG5ld0dhbWUsXG4gIHN0YXJ0R2FtZSxcbiAgcmVjZWl2ZVBsYXllck1vdmUsXG4gIHBsYWNlU2hpcCxcbiAgZ2V0U2hpcHNQbGFjZWQsXG4gIGF1dG9QbGFjZVBsYXllcixcbn07XG4iLCJpbXBvcnQgc2hpcEZhY3RvcnkgZnJvbSAnLi9zaGlwRmFjdG9yeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdhbWVib2FyZEZhY3RvcnkoKSB7XG4gIGNvbnN0IGNyZWF0ZUJvYXJkID0gKCkgPT4ge1xuICAgIGNvbnN0IGdhbWVib2FyZCA9IG5ldyBBcnJheSgxMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBnYW1lYm9hcmRbaV0gPSB7fTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBnYW1lYm9hcmRbaV1bal0gPSB7XG4gICAgICAgICAgaGl0OiBmYWxzZSxcbiAgICAgICAgICBzaGlwSWQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBnYW1lYm9hcmQ7XG4gIH07XG4gIC8vIGNvbnN0IG1pc3NlcyA9IFtdO1xuICBjb25zdCB0aWxlcyA9IGNyZWF0ZUJvYXJkKCk7XG5cbiAgY29uc3Qgc2hpcHMgPSBbXTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAobGVuZ3RoLCBbeCwgeV0sIGF4aXMpID0+IHtcbiAgICBjb25zdCBuZXdTaGlwID0gc2hpcEZhY3Rvcnkoc2hpcHMubGVuZ3RoLCBsZW5ndGgpO1xuICAgIHNoaXBzLnB1c2gobmV3U2hpcCk7XG4gICAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgICAgLy8gUGxhY2UgaG9yaXpvbnRhbGx5XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1NoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmV3U2hpcC5jb29yZHMucHVzaChbeCwgeV0pO1xuICAgICAgICB0aWxlc1t4XVt5XS5zaGlwSWQgPSBuZXdTaGlwLmlkO1xuICAgICAgICB4ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChheGlzID09PSAneScpIHtcbiAgICAgIC8vIFBsYWNlIHZlcnRpY2FsbHlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBuZXdTaGlwLmNvb3Jkcy5wdXNoKFt4LCB5XSk7XG4gICAgICAgIHRpbGVzW3hdW3ldLnNoaXBJZCA9IG5ld1NoaXAuaWQ7XG4gICAgICAgIHkgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gY29uc3QgaGFzU2hpcCA9ICh0aWxlKSA9PiB0aWxlLnNoaXBJZCAhPT0gbnVsbDtcblxuICBjb25zdCBoYXNTaGlwID0gKHgsIHkpID0+IHRpbGVzW3hdW3ldLnNoaXBJZCAhPT0gbnVsbDtcblxuICBjb25zdCBmaW5kU2hpcCA9IChpZCkgPT4ge1xuICAgIGxldCB0aGlzU2hpcDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2hpcHNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgIHRoaXNTaGlwID0gc2hpcHNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzU2hpcDtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKHRhcmdldCkgPT4ge1xuICAgIGNvbnN0IFt4LCB5XSA9IHRhcmdldDtcbiAgICBjb25zdCB0aGlzVGlsZSA9IHRpbGVzW3hdW3ldO1xuICAgIGlmICh0aGlzVGlsZS5oaXQpIHJldHVybjtcblxuICAgIC8vIGlmICghaGFzU2hpcCh0aGlzVGlsZSkpIHtcbiAgICAvLyAgIG1pc3Nlcy5wdXNoKHRhcmdldCk7XG4gICAgLy8gfVxuICAgIGlmIChoYXNTaGlwKHgsIHkpKSB7XG4gICAgICBjb25zdCB0aGlzU2hpcCA9IGZpbmRTaGlwKHRoaXNUaWxlLnNoaXBJZCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXNTaGlwLmNvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpc1NoaXAuY29vcmRzW2ldLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSB0YXJnZXRbaW5kZXhdKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzU2hpcC5oZWFsdGhbaV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXNUaWxlLmhpdCA9IHRydWU7XG4gIH07XG5cbiAgY29uc3Qgc2hpcHNSZW1haW5pbmcgPSAoKSA9PiB7XG4gICAgY29uc3QgZmlsdGVyU2hpcHMgPSBzaGlwcy5maWx0ZXIoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkgPT09IGZhbHNlKTtcbiAgICByZXR1cm4gZmlsdGVyU2hpcHMubGVuZ3RoO1xuICB9O1xuXG4gIGNvbnN0IGFsbFNoaXBzU3VuayA9ICgpID0+IHtcbiAgICBjb25zdCBzdW5rU2hpcHMgPSBzaGlwc1JlbWFpbmluZygpO1xuICAgIHJldHVybiBzdW5rU2hpcHMgPT09IDA7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB0aWxlcyxcbiAgICBzaGlwcyxcbiAgICBwbGFjZVNoaXAsXG4gICAgaGFzU2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIHNoaXBzUmVtYWluaW5nLFxuICAgIGFsbFNoaXBzU3VuayxcbiAgfTtcbn1cbiIsImNvbnN0IGdldENlbGxJbmZvID0gKHRhcmdldCkgPT4ge1xuICByZXR1cm4gW051bWJlcih0YXJnZXQuZGF0YXNldC54KSwgTnVtYmVyKHRhcmdldC5kYXRhc2V0LnkpXTtcbn07XG5cbmNvbnN0IGFscmVhZHlQbGF5ZWQgPSAocGxheWVyLCB0YXJnZXQpID0+IHtcbiAgY29uc3QgcHJldmlvdXNNb3ZlcyA9IHBsYXllci5tb3ZlcztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aW91c01vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHByZXZpb3VzTW92ZXNbaV0uZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHRhcmdldFtpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgdGltZW91dCA9IChtcykgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKTtcbiAgfSk7XG59O1xuXG5jb25zdCBnZXRSYW5kb21UaWxlID0gKCkgPT4ge1xuICBjb25zdCByYW5kb20gPSBbXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLFxuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgXTtcbiAgcmV0dXJuIHJhbmRvbTtcbn07XG5cbmNvbnN0IGdldEVtcHR5VGlsZXMgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHsgYm9hcmQgfSA9IHBsYXllcjtcbiAgY29uc3QgeyB0aWxlcyB9ID0gYm9hcmQ7XG4gIGNvbnN0IGVtcHR5VGlsZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgT2JqZWN0LmtleXModGlsZXNbaV0pLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBoYXNTaGlwID0gYm9hcmQuaGFzU2hpcChpLCBqKTtcbiAgICAgIGlmICghaGFzU2hpcCkge1xuICAgICAgICBjb25zdCBjb29yZCA9IFtpLCBqXTtcbiAgICAgICAgZW1wdHlUaWxlcy5wdXNoKGNvb3JkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVtcHR5VGlsZXM7XG59O1xuXG5jb25zdCBnZXRSYW5kb21FbXB0eSA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgZW1wdHlUaWxlcyA9IGdldEVtcHR5VGlsZXMocGxheWVyKTtcblxuICByZXR1cm4gZW1wdHlUaWxlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBlbXB0eVRpbGVzLmxlbmd0aCldO1xufTtcblxuY29uc3QgbmV4dFNoaXBMZW5ndGggPSAobnVtU2hpcHNQbGFjZWQpID0+IHtcbiAgc3dpdGNoIChudW1TaGlwc1BsYWNlZCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiA1O1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiA0O1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiAyO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuY29uc3QgZ2V0UmFuZG9tQXhpcyA9ICgpID0+IFsneCcsICd5J11bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMildO1xuXG5leHBvcnQge1xuICBnZXRDZWxsSW5mbyxcbiAgYWxyZWFkeVBsYXllZCxcbiAgdGltZW91dCxcbiAgZ2V0UmFuZG9tVGlsZSxcbiAgZ2V0RW1wdHlUaWxlcyxcbiAgZ2V0UmFuZG9tRW1wdHksXG4gIG5leHRTaGlwTGVuZ3RoLFxuICBnZXRSYW5kb21BeGlzLFxufTtcbiIsImltcG9ydCBnYW1lYm9hcmRGYWN0b3J5IGZyb20gJy4vZ2FtZWJvYXJkRmFjdG9yeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBsYXllckZhY3RvcnkobnVtLCBodW1hbikge1xuICBjb25zdCBnYW1lYm9hcmQgPSBnYW1lYm9hcmRGYWN0b3J5KCk7XG4gIGNvbnN0IG1vdmVzID0gW107XG4gIGNvbnN0IG1ha2VNb3ZlID0gKHRhcmdldCwgZW5lbXlCb2FyZCkgPT4ge1xuICAgIGVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayh0YXJnZXQpO1xuICAgIG1vdmVzLnB1c2godGFyZ2V0KTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGdldCBudW0oKSB7XG4gICAgICByZXR1cm4gbnVtO1xuICAgIH0sXG4gICAgZ2V0IGJvYXJkKCkge1xuICAgICAgcmV0dXJuIGdhbWVib2FyZDtcbiAgICB9LFxuICAgIGdldCBpc0h1bWFuKCkge1xuICAgICAgcmV0dXJuIGh1bWFuO1xuICAgIH0sXG4gICAgLy8gZ2V0IHR1cm4oKSB7XG4gICAgLy8gICByZXR1cm4gdHVybjtcbiAgICAvLyB9LFxuICAgIGdldCBtb3ZlcygpIHtcbiAgICAgIHJldHVybiBtb3ZlcztcbiAgICB9LFxuICAgIG1ha2VNb3ZlLFxuICB9O1xufVxuIiwiaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuXG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcblxuLy8gU2hpcCByb3RhdGlvbiB3aGVyZSB4ID0gcGxhY2UgaG9yaXpvbnRhbGx5LCB5ID0gcGxhY2UgdmVydGljYWxseVxuY29uc3QgYXhlcyA9IHtcbiAgeDogdHJ1ZSxcbiAgeTogZmFsc2UsXG59O1xuXG5jb25zdCBnZXRBeGlzID0gKCkgPT4ge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYXhlcyk7XG4gIHJldHVybiBrZXlzLmZpbHRlcigoa2V5KSA9PiBheGVzW2tleV0gPT09IHRydWUpWzBdO1xufTtcblxuY29uc3Qgc3dpdGNoQXhpcyA9ICgpID0+IHtcbiAgYXhlcy54ID0gIWF4ZXMueDtcbiAgYXhlcy55ID0gIWF4ZXMueDtcbn07XG5cbi8vIFJldHVybnMgYXJyYXkgb2YgW3gsIHldIGNvb3JkcyBvZiBhIHNoaXAgb2YgbGVuZ3RoLCBidWlsdCBvbiBheGlzLCBhdCBzdGFydCBpbmRleFxuY29uc3QgYnVpbGRTaGlwID0gKHN0YXJ0LCBheGlzLCBsZW5ndGgpID0+IHtcbiAgY29uc3QgW3gsIHldID0gc3RhcnQ7XG4gIGNvbnN0IHNoaXBDb29yZHMgPSBbXTtcblxuICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKFtpICsgeCwgeV0pO1xuICAgIH1cbiAgfVxuXG4gIGlmIChheGlzID09PSAneScpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBzaGlwQ29vcmRzLnB1c2goW3gsIGkgKyB5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNoaXBDb29yZHM7XG59O1xuXG4vKiBWYWxpZCBjaGVja3MgZm9yIHNoaXAgb2JqZWN0IG9uIGJvYXJkIG9iamVjdCAqL1xuLy8gIENoZWNrIGlmIHNoaXAgb2YgbGVuZ3RoICYgYXhpcyBmaXRzIHdpdGhpbiAxMHgxMCBnYW1lYm9hcmQgYm91bmRhcmllc1xuY29uc3QgZG9lc1NoaXBGaXQgPSAobGVuZ3RoLCBheGlzLCBzdGFydEluZGV4KSA9PiB7XG4gIGNvbnN0IFt4LCB5XSA9IHN0YXJ0SW5kZXg7XG4gIGlmIChheGlzID09PSAneCcpIHtcbiAgICByZXR1cm4geCArIGxlbmd0aCAtIDEgPD0gOTtcbiAgfVxuICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgcmV0dXJuIHkgKyBsZW5ndGggLSAxIDw9IDk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gQ2hlY2tzIHNoaXAgZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFub3RoZXJcbmNvbnN0IG5vT3ZlcmxhcCA9IChzaGlwLCBwbGF5ZXIpID0+IHtcbiAgY29uc3QgeyBib2FyZCB9ID0gcGxheWVyO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBbeCwgeV0gPSBzaGlwW2ldO1xuICAgIGlmIChib2FyZC5oYXNTaGlwKHgsIHkpID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuY29uc3QgaXNTaGlwVmFsaWQgPSAocGxheWVyLCBzdGFydCwgYXhpcywgbGVuZ3RoKSA9PiB7XG4gIGNvbnN0IHNoaXBGaXRzID0gZG9lc1NoaXBGaXQobGVuZ3RoLCBheGlzLCBzdGFydCk7XG5cbiAgaWYgKHNoaXBGaXRzKSB7XG4gICAgY29uc3Qgc2hpcCA9IGJ1aWxkU2hpcChzdGFydCwgYXhpcywgbGVuZ3RoKTtcbiAgICBpZiAobm9PdmVybGFwKHNoaXAsIHBsYXllcikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKiBQcmV2aWV3aW5nIHNoaXAgcGxhY2VtZW50IG9uIERPTSAqL1xuY29uc3QgaXNQcmV2aWV3VmFsaWQgPSAoY29vcmRzLCBsZW5ndGgpID0+IHtcbiAgY29uc3QgaXNXaXRoaW5Cb3VuZHMgPSBjb29yZHMubGVuZ3RoID09PSBsZW5ndGg7XG4gIGNvbnN0IG5vT3RoZXJTaGlwcyA9IGNvb3Jkcy5ldmVyeShcbiAgICAoY29vcmQpID0+ICFjb29yZC5jbGFzc0xpc3QuY29udGFpbnMoJ3NoaXAnKVxuICApO1xuICByZXR1cm4gaXNXaXRoaW5Cb3VuZHMgJiYgbm9PdGhlclNoaXBzO1xufTtcblxuY29uc3QgYnVpbGRQcmV2aWV3ID0gKHN0YXJ0LCBsZW5ndGgsIGF4aXMsIGJvYXJkKSA9PiB7XG4gIGNvbnN0IFt4LCB5XSA9IHN0YXJ0O1xuICBjb25zdCBzaGlwQ29vcmRzID0gW107XG5cbiAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vID45ID0gb3V0IG9mIGJvdW5kc1xuICAgICAgaWYgKGkgKyB4ID4gOSkgYnJlYWs7XG4gICAgICBjb25zdCBuZXh0Q2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS14PScke2kgKyB4fSddW2RhdGEteT0nJHt5fSddYFxuICAgICAgKTtcbiAgICAgIHNoaXBDb29yZHMucHVzaChuZXh0Q2VsbCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vID45ID0gb3V0IG9mIGJvdW5kc1xuICAgICAgaWYgKGkgKyB5ID4gOSkgYnJlYWs7XG5cbiAgICAgIGNvbnN0IG5leHRDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7eH0nXVtkYXRhLXk9JyR7aSArIHl9J11gXG4gICAgICApO1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKG5leHRDZWxsKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc2hpcENvb3Jkcztcbn07XG5cbmNvbnN0IHByZXZpZXdTaGlwID0gKGUsIGxlbmd0aCkgPT4ge1xuICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdib2FyZCcpIHx8IGxlbmd0aCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gIGNvbnN0IHN0YXJ0aW5nSW5kZXggPSBoZWxwZXJzLmdldENlbGxJbmZvKGUudGFyZ2V0KTtcbiAgY29uc3QgYXhpcyA9IGdldEF4aXMoKTtcbiAgY29uc3Qgc2hpcENvb3JkcyA9IGJ1aWxkUHJldmlldyhzdGFydGluZ0luZGV4LCBsZW5ndGgsIGF4aXMsIHBsYXllckJvYXJkKTtcbiAgY29uc3QgdmFsaWRQcmV2aWV3ID0gaXNQcmV2aWV3VmFsaWQoc2hpcENvb3JkcywgbGVuZ3RoKTtcblxuICBpZiAodmFsaWRQcmV2aWV3KSB7XG4gICAgc2hpcENvb3Jkcy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAtcHJldmlldycpKTtcbiAgfSBlbHNlIHtcbiAgICBzaGlwQ29vcmRzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgnaW52YWxpZCcpKTtcbiAgfVxufTtcblxuY29uc3QgY2xlYXJQcmV2aWV3ID0gKCkgPT4ge1xuICBjb25zdCBjZWxscyA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnc2hpcC1wcmV2aWV3JywgJ2ludmFsaWQnKSk7XG59O1xuXG5leHBvcnQge1xuICBidWlsZFNoaXAsXG4gIG5vT3ZlcmxhcCxcbiAgZG9lc1NoaXBGaXQsXG4gIGdldEF4aXMsXG4gIHN3aXRjaEF4aXMsXG4gIHByZXZpZXdTaGlwLFxuICBjbGVhclByZXZpZXcsXG4gIGlzU2hpcFZhbGlkLFxufTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNoaXBGYWN0b3J5KGlkLCBsZW5ndGgpIHtcbiAgY29uc3QgY3JlYXRlSGVhbHRoID0gKHNpemUpID0+IHtcbiAgICBjb25zdCBhcnJheSA9IFsuLi5BcnJheShzaXplKS5rZXlzKCldO1xuICAgIGNvbnN0IGhlYWx0aCA9IGFycmF5LnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgcHJldltjdXJyXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwge30pO1xuICAgIHJldHVybiBoZWFsdGg7XG4gIH07XG5cbiAgY29uc3QgY29vcmRzID0gW107XG5cbiAgY29uc3QgaGVhbHRoID0gY3JlYXRlSGVhbHRoKGxlbmd0aCk7XG4gIC8vIGhlYWx0aCA9IHsgd2hlcmUgYm9vbCByZXByZXNlbnRzIGhpdC9ubyBoaXRcbiAgLy8gICAwOiBmYWxzZSxcbiAgLy8gICAxOiBmYWxzZSxcbiAgLy8gICAyOiBmYWxzZSxcbiAgLy8gfVxuICBjb25zdCBoaXQgPSAoaW5kZXgpID0+IHtcbiAgICBoZWFsdGhbaW5kZXhdID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoaGVhbHRoKS5ldmVyeSgoaW5kZXgpID0+IGluZGV4ID09PSB0cnVlKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIGxlbmd0aCxcbiAgICBoZWFsdGgsXG4gICAgY29vcmRzLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gIH07XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9zdHlsZS5jc3MnO1xuaW1wb3J0ICogYXMgZ2FtZSBmcm9tICcuL21vZHVsZXMvZ2FtZSc7XG5pbXBvcnQgKiBhcyBkb20gZnJvbSAnLi9tb2R1bGVzL2RvbSc7XG5pbXBvcnQgKiBhcyBldmVudENvbnRyb2xsZXIgZnJvbSAnLi9tb2R1bGVzL2V2ZW50Q29udHJvbGxlcic7XG5cbmRvbS5jcmVhdGVCb2FyZHMoKTtcbmdhbWUubmV3R2FtZSgpO1xuXG5ldmVudENvbnRyb2xsZXIuaW5pdEJvYXJkRXZlbnRzKCk7XG5ldmVudENvbnRyb2xsZXIuaW5pdEdhbWVCdXR0b25zKCk7XG5ldmVudENvbnRyb2xsZXIuaW5pdFNoaXBQbGFjZW1lbnQoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==