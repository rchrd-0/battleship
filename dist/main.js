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
/* harmony export */   "getRandomMove": () => (/* binding */ getRandomMove)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/modules/helpers.js");


const generateRandom = () => {
  const random = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ];
  return random;
};

const getRandomMove = async (player) => {
  let randomMove = generateRandom();
  while (_helpers__WEBPACK_IMPORTED_MODULE_0__.alreadyPlayed(player, randomMove)) {
    randomMove = generateRandom();
  }
  await _helpers__WEBPACK_IMPORTED_MODULE_0__.timeout(400);
  return randomMove;
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
  const { tiles } = player.board;

  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < Object.keys(tiles[i]).length; j++) {
      const thisTile = tiles[i][j];
      const hasShip = thisTile.shipId !== null;
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
/* harmony import */ var _shipPlacement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shipPlacement */ "./src/modules/shipPlacement.js");




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
  rotateBtn.addEventListener('click', _shipPlacement__WEBPACK_IMPORTED_MODULE_2__.switchAxis)
};

const initShipPlacement = () => {
  const playerBoard = document.querySelector('#player-board');
  playerBoard.addEventListener('mouseover', ((e) => {
    const nextShip = _game__WEBPACK_IMPORTED_MODULE_0__.getNextShip();
    _shipPlacement__WEBPACK_IMPORTED_MODULE_2__.previewShip(e, nextShip);
  }))
  playerBoard.addEventListener('mouseout', _shipPlacement__WEBPACK_IMPORTED_MODULE_2__.clearPreview);
  playerBoard.addEventListener('click', _game__WEBPACK_IMPORTED_MODULE_0__.placeShip)
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
/* harmony export */   "receivePlayerMove": () => (/* binding */ receivePlayerMove),
/* harmony export */   "startGame": () => (/* binding */ startGame)
/* harmony export */ });
/* harmony import */ var _playerFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./playerFactory */ "./src/modules/playerFactory.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/modules/dom.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./src/modules/helpers.js");
/* harmony import */ var _shipPlacement__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shipPlacement */ "./src/modules/shipPlacement.js");
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
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'player')
};

const startGame = () => {
  players.com.board.placeShip(2, [0, 0], 'x');

  _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('start', true);
  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(players.com);
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'player');
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'comp');
};

const endGame = (winner) => {
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true, 'comp');
  _dom__WEBPACK_IMPORTED_MODULE_1__.toggleBtns('restart', true);
  _dom__WEBPACK_IMPORTED_MODULE_1__.announceGameOver(winner);
}

const playComMove = async () => {
  const { p1, com } = players;
  const randomMove = await _botLogic__WEBPACK_IMPORTED_MODULE_4__.getRandomMove(com);

  com.makeMove(randomMove, p1.board);
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
  if (p1.board.ships.length === null) return;

  const startIndex = _helpers__WEBPACK_IMPORTED_MODULE_2__.getCellInfo(e.target);
  const allNodes = _shipPlacement__WEBPACK_IMPORTED_MODULE_3__.getPreview();
  const length = getNextShip();
  const axis = _shipPlacement__WEBPACK_IMPORTED_MODULE_3__.getAxis();

  if (_shipPlacement__WEBPACK_IMPORTED_MODULE_3__.isValid(allNodes, length)) {
    p1.board.placeShip(length, startIndex, axis);
    _shipPlacement__WEBPACK_IMPORTED_MODULE_3__.clearPreview();
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
  const hasShip = (tile) => tile.shipId !== null;

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
    if (hasShip(thisTile)) {
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

// const generateRandom = () => {
//   const random = [
//     Math.floor(Math.random() * 10),
//     Math.floor(Math.random() * 10),
//   ];
//   return random;
// };

// const getRandomMove = async (player) => {
//   let randomMove = generateRandom();
//   while (alreadyPlayed(player, randomMove)) {
//     randomMove = generateRandom();
//   }
//   await timeout(400);
//   return randomMove;
// };

// const getTurn = (obj) => {
//   const keys = Object.keys(obj);

//   for (let i = 0; i < keys.length; i++) {
//     const player = obj[keys[i]];
//     if (player.turn === false) {
//       return player
//     }
//   }
// };

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


/***/ }),

/***/ "./src/modules/shipPlacement.js":
/*!**************************************!*\
  !*** ./src/modules/shipPlacement.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clearPreview": () => (/* binding */ clearPreview),
/* harmony export */   "getAxis": () => (/* binding */ getAxis),
/* harmony export */   "getPreview": () => (/* binding */ getPreview),
/* harmony export */   "isValid": () => (/* binding */ isValid),
/* harmony export */   "previewShip": () => (/* binding */ previewShip),
/* harmony export */   "switchAxis": () => (/* binding */ switchAxis)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/modules/helpers.js");


const board = document.querySelector('#player-board');

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

const isValid = (coords, length) => {
  const isWithinBounds = coords.length === length;
  const noOverlap = coords.every((coord) => !coord.classList.contains('ship'));
  return isWithinBounds && noOverlap;
};

const previewShip = (e, length) => {
  if (e.target.classList.contains('board') || length === null) return;

  const [x, y] = _helpers__WEBPACK_IMPORTED_MODULE_0__.getCellInfo(e.target);
  const shipCoords = [];
  const axis = getAxis();

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

  if (isValid(shipCoords, length)) {
    shipCoords.forEach((cell) => cell.classList.add('ship-preview'));
  } else {
    shipCoords.forEach((cell) => cell.classList.add('invalid'));
  }
};

const clearPreview = () => {
  const cells = board.querySelectorAll('.board-cell');
  cells.forEach((cell) => cell.classList.remove('ship-preview', 'invalid'));
};

const getPreview = () => [...board.querySelectorAll('.ship-preview')];




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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QW9CLFlBQVk7QUFDaEM7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixNQUFNLGFBQWEsRUFBRTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixFQUFFLGFBQWEsTUFBTTtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFK0U7Ozs7Ozs7VUNyRS9FO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNOcUI7QUFDaUI7QUFDRDtBQUN1Qjs7QUFFNUQsc0RBQWdCO0FBQ2hCLGtEQUFZOztBQUVaLHFFQUErQjtBQUMvQixxRUFBK0I7QUFDL0IsdUVBQWlDLEciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvYm90TG9naWMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZXZlbnRDb250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lYm9hcmRGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9oZWxwZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXJGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcFBsYWNlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5cbmNvbnN0IGdlbmVyYXRlUmFuZG9tID0gKCkgPT4ge1xuICBjb25zdCByYW5kb20gPSBbXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLFxuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgXTtcbiAgcmV0dXJuIHJhbmRvbTtcbn07XG5cbmNvbnN0IGdldFJhbmRvbU1vdmUgPSBhc3luYyAocGxheWVyKSA9PiB7XG4gIGxldCByYW5kb21Nb3ZlID0gZ2VuZXJhdGVSYW5kb20oKTtcbiAgd2hpbGUgKGhlbHBlcnMuYWxyZWFkeVBsYXllZChwbGF5ZXIsIHJhbmRvbU1vdmUpKSB7XG4gICAgcmFuZG9tTW92ZSA9IGdlbmVyYXRlUmFuZG9tKCk7XG4gIH1cbiAgYXdhaXQgaGVscGVycy50aW1lb3V0KDQwMCk7XG4gIHJldHVybiByYW5kb21Nb3ZlO1xufTtcblxuZXhwb3J0IHsgZ2V0UmFuZG9tTW92ZSB9O1xuIiwiY29uc3QgZ2FtZWJvYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZCcpO1xuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyLWJvYXJkJyk7XG5jb25zdCBjb21wQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29tcC1ib2FyZCcpO1xuY29uc3QgZ2FtZUluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ2FtZS1pbmZvJyk7XG5cbmNvbnN0IHVwZGF0ZVNoaXBDb3VudCA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbXBCb2FyZDtcbiAgY29uc3Qgc2hpcENvdW50ZXIgPSB0aGlzQm9hcmQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgY29uc3Qgc2hpcHNSZW1haW5pbmcgPSBwbGF5ZXIuYm9hcmQuc2hpcHNSZW1haW5pbmcoKTtcblxuICBzaGlwQ291bnRlci50ZXh0Q29udGVudCA9IGBTaGlwcyByZW1haW5pbmc6ICR7c2hpcHNSZW1haW5pbmd9YDtcbn07XG5cbmNvbnN0IGNyZWF0ZUJvYXJkcyA9ICgpID0+IHtcbiAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGJvYXJkQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIGJvYXJkQ2VsbC5jbGFzc0xpc3QuYWRkKCdib2FyZC1jZWxsJyk7XG4gICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnggPSBqO1xuICAgICAgICBib2FyZENlbGwuZGF0YXNldC55ID0gaTtcbiAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRDZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3QgcmVuZGVyU2hpcHMgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHsgc2hpcHMgfSA9IHBsYXllci5ib2FyZDtcbiAgY29uc3QgY29vcmRzID0gc2hpcHMubWFwKChzaGlwKSA9PiBzaGlwLmNvb3Jkcyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvb3Jkc1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgW3gsIHldID0gW2Nvb3Jkc1tpXVtqXVswXSwgY29vcmRzW2ldW2pdWzFdXTtcbiAgICAgIGNvbnN0IHRoaXNDZWxsID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7eH0nXVtkYXRhLXk9JyR7eX0nXWBcbiAgICAgICk7XG4gICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgfVxuICB9XG4gIHVwZGF0ZVNoaXBDb3VudChwbGF5ZXIpO1xufTtcblxuY29uc3QgdXBkYXRlQm9hcmQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IHBsYXllci5pc0h1bWFuID8gcGxheWVyQm9hcmQgOiBjb21wQm9hcmQ7XG4gIGNvbnN0IHsgdGlsZXMgfSA9IHBsYXllci5ib2FyZDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBPYmplY3Qua2V5cyh0aWxlc1tpXSkubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHRoaXNUaWxlID0gdGlsZXNbaV1bal07XG4gICAgICBjb25zdCBoYXNTaGlwID0gdGhpc1RpbGUuc2hpcElkICE9PSBudWxsO1xuICAgICAgaWYgKHRoaXNUaWxlLmhpdCkge1xuICAgICAgICBjb25zdCB0aGlzQ2VsbCA9IHRoaXNCb2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGBbZGF0YS14PScke2l9J11bZGF0YS15PScke2p9J11gXG4gICAgICAgICk7XG4gICAgICAgIGlmIChoYXNTaGlwKSB7XG4gICAgICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHVwZGF0ZVNoaXBDb3VudChwbGF5ZXIpO1xufTtcblxuY29uc3Qgc3R5bGVHYW1lT3ZlciA9IChib29sKSA9PiB7XG4gIGlmIChib29sKSB7XG4gICAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4gYm9hcmQuY2xhc3NMaXN0LmFkZCgnZ2FtZS1vdmVyJykpO1xuICB9IGVsc2Uge1xuICAgIGdhbWVib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IGJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ2dhbWUtb3ZlcicpKTtcbiAgfVxufTtcblxuY29uc3QgY2xlYXJVSSA9ICguLi5wbGF5ZXJzKSA9PiB7XG4gIGdhbWVib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IHtcbiAgICBjb25zdCBjZWxscyA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdtaXNzJywgJ2hpdCcsICdzaGlwJyk7XG4gICAgfSk7XG4gIH0pO1xuICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4gdXBkYXRlU2hpcENvdW50KHBsYXllcikpO1xuICBzdHlsZUdhbWVPdmVyKGZhbHNlKTtcbn07XG5cbmNvbnN0IGFubm91bmNlR2FtZU92ZXIgPSAod2lubmVyKSA9PiB7XG4gIGNvbnN0IHdpbk1lc3NhZ2UgPVxuICAgIHdpbm5lci5udW0gPT09IDFcbiAgICAgID8gJ0NvbmdyYXR1bGF0aW9ucyEgWW91IHdpbiEnXG4gICAgICA6ICdHYW1lIG92ZXIgLi4uIENvbXB1dGVyIHdpbnMhJztcblxuICBnYW1lSW5mby50ZXh0Q29udGVudCA9IHdpbk1lc3NhZ2U7XG4gIHN0eWxlR2FtZU92ZXIodHJ1ZSk7XG59O1xuXG5jb25zdCBkaXNhYmxlRXZlbnRzID0gKGJvb2wsIGJvYXJkKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IGJvYXJkID09PSAnY29tcCcgPyBjb21wQm9hcmQgOiBwbGF5ZXJCb2FyZDtcbiAgaWYgKGJvb2wpIHtcbiAgICB0aGlzQm9hcmQuY2xhc3NMaXN0LmFkZCgnbm8tZXZlbnRzJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpc0JvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ25vLWV2ZW50cycpO1xuICB9XG59O1xuXG5jb25zdCB0b2dnbGVCdG5zID0gKGJ1dHRvbiwgc3RhdGUpID0+IHtcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnQtYnRuJyk7XG4gIGNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzdGFydC1idG4nKTtcblxuICBpZiAoYnV0dG9uID09PSAnc3RhcnQnKSB7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICBzdGFydEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGJ1dHRvbiA9PT0gJ3Jlc3RhcnQnKSB7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICByZXN0YXJ0QnRuLnRleHRDb250ZW50ID0gJ05ldyBnYW1lJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdGFydEJ0bi50ZXh0Q29udGVudCA9ICdSZXN0YXJ0JztcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB7XG4gIGNyZWF0ZUJvYXJkcyxcbiAgY2xlYXJVSSxcbiAgcmVuZGVyU2hpcHMsXG4gIHVwZGF0ZUJvYXJkLFxuICBkaXNhYmxlRXZlbnRzLFxuICBhbm5vdW5jZUdhbWVPdmVyLFxuICB0b2dnbGVCdG5zLFxufTtcbiIsImltcG9ydCAqIGFzIGdhbWUgZnJvbSAnLi9nYW1lJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCAqIGFzIHNoaXBQbGFjZW1lbnQgZnJvbSAnLi9zaGlwUGxhY2VtZW50JztcblxuY29uc3QgaW5pdEJvYXJkRXZlbnRzID0gKCkgPT4ge1xuICBjb25zdCBjb21wQ2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjY29tcC1ib2FyZCAuYm9hcmQtY2VsbCcpO1xuICBjb21wQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBoZWxwZXJzLmdldENlbGxJbmZvKGUudGFyZ2V0KTtcbiAgICAgIGdhbWUucmVjZWl2ZVBsYXllck1vdmUoY29vcmQpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbmNvbnN0IGluaXRHYW1lQnV0dG9ucyA9ICgpID0+IHtcbiAgY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXN0YXJ0LWJ0bicpO1xuICByZXN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5uZXdHYW1lKTtcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnQtYnRuJyk7XG4gIHN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5zdGFydEdhbWUpO1xuICBjb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm90YXRlLXNoaXAnKTtcbiAgcm90YXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2hpcFBsYWNlbWVudC5zd2l0Y2hBeGlzKVxufTtcblxuY29uc3QgaW5pdFNoaXBQbGFjZW1lbnQgPSAoKSA9PiB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXllci1ib2FyZCcpO1xuICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoKGUpID0+IHtcbiAgICBjb25zdCBuZXh0U2hpcCA9IGdhbWUuZ2V0TmV4dFNoaXAoKTtcbiAgICBzaGlwUGxhY2VtZW50LnByZXZpZXdTaGlwKGUsIG5leHRTaGlwKTtcbiAgfSkpXG4gIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0Jywgc2hpcFBsYWNlbWVudC5jbGVhclByZXZpZXcpO1xuICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUucGxhY2VTaGlwKVxufTtcblxuZXhwb3J0IHsgaW5pdEJvYXJkRXZlbnRzLCBpbml0R2FtZUJ1dHRvbnMsIGluaXRTaGlwUGxhY2VtZW50IH07XG4iLCJpbXBvcnQgcGxheWVyRmFjdG9yeSBmcm9tICcuL3BsYXllckZhY3RvcnknO1xuaW1wb3J0ICogYXMgZG9tIGZyb20gJy4vZG9tJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCAqIGFzIHNoaXBQbGFjZW1lbnQgZnJvbSAnLi9zaGlwUGxhY2VtZW50JztcbmltcG9ydCAqIGFzIGJvdExvZ2ljIGZyb20gJy4vYm90TG9naWMnO1xuXG5jb25zdCBwbGF5ZXJzID0ge1xuICBwMTogbnVsbCxcbiAgY29tOiBudWxsLFxufTtcblxuY29uc3QgY2hlY2tHYW1lU3RhdGUgPSAocGxheWVyKSA9PiBwbGF5ZXIuYm9hcmQuYWxsU2hpcHNTdW5rKCk7XG5cbmNvbnN0IG5ld0dhbWUgPSAoKSA9PiB7XG4gIHBsYXllcnMucDEgPSBwbGF5ZXJGYWN0b3J5KDEsIHRydWUpO1xuICBwbGF5ZXJzLmNvbSA9IHBsYXllckZhY3RvcnkoMiwgZmFsc2UpO1xuXG4gIGRvbS5jbGVhclVJKHBsYXllcnMucDEsIHBsYXllcnMuY29tKTtcbiAgZG9tLnRvZ2dsZUJ0bnMoJ3N0YXJ0JywgdHJ1ZSk7XG4gIGRvbS50b2dnbGVCdG5zKCdyZXN0YXJ0JywgZmFsc2UpO1xuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlLCAnY29tcCcpO1xuICBkb20uZGlzYWJsZUV2ZW50cyhmYWxzZSwgJ3BsYXllcicpXG59O1xuXG5jb25zdCBzdGFydEdhbWUgPSAoKSA9PiB7XG4gIHBsYXllcnMuY29tLmJvYXJkLnBsYWNlU2hpcCgyLCBbMCwgMF0sICd4Jyk7XG5cbiAgZG9tLnRvZ2dsZUJ0bnMoJ3N0YXJ0JywgdHJ1ZSk7XG4gIGRvbS51cGRhdGVCb2FyZChwbGF5ZXJzLmNvbSk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUsICdwbGF5ZXInKTtcbiAgZG9tLmRpc2FibGVFdmVudHMoZmFsc2UsICdjb21wJyk7XG59O1xuXG5jb25zdCBlbmRHYW1lID0gKHdpbm5lcikgPT4ge1xuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlLCAnY29tcCcpO1xuICBkb20udG9nZ2xlQnRucygncmVzdGFydCcsIHRydWUpO1xuICBkb20uYW5ub3VuY2VHYW1lT3Zlcih3aW5uZXIpO1xufVxuXG5jb25zdCBwbGF5Q29tTW92ZSA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBjb25zdCByYW5kb21Nb3ZlID0gYXdhaXQgYm90TG9naWMuZ2V0UmFuZG9tTW92ZShjb20pO1xuXG4gIGNvbS5tYWtlTW92ZShyYW5kb21Nb3ZlLCBwMS5ib2FyZCk7XG4gIGRvbS51cGRhdGVCb2FyZChwMSk7XG5cbiAgY29uc3Qgd2luU3RhdGUgPSBjaGVja0dhbWVTdGF0ZShwMSk7XG4gIGlmICh3aW5TdGF0ZSkge1xuICAgIGVuZEdhbWUoY29tKTtcbiAgfSBlbHNlIHtcbiAgICBkb20uZGlzYWJsZUV2ZW50cyhmYWxzZSwgJ2NvbXAnKTtcbiAgfVxufTtcblxuY29uc3QgcmVjZWl2ZVBsYXllck1vdmUgPSAoY29vcmQpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBpZiAoaGVscGVycy5hbHJlYWR5UGxheWVkKHAxLCBjb29yZCkpIHJldHVybjtcbiAgcDEubWFrZU1vdmUoY29vcmQsIGNvbS5ib2FyZCk7XG4gIGRvbS51cGRhdGVCb2FyZChjb20pO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUoY29tKTtcbiAgaWYgKHdpblN0YXRlKSB7XG4gICAgZW5kR2FtZShwMSk7XG4gIH0gZWxzZSB7XG4gICAgcGxheUNvbU1vdmUocDEsIGNvbSk7XG4gIH1cbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSwgJ2NvbXAnKTtcbn07XG5cbmNvbnN0IGdldE5leHRTaGlwID0gKCkgPT4ge1xuICBjb25zdCBzaGlwc1BsYWNlZCA9IHBsYXllcnMucDEuYm9hcmQuc2hpcHMubGVuZ3RoO1xuICByZXR1cm4gaGVscGVycy5uZXh0U2hpcExlbmd0aChzaGlwc1BsYWNlZCk7XG59O1xuXG5jb25zdCBwbGFjZVNoaXAgPSAoZSkgPT4ge1xuICBjb25zdCB7IHAxIH0gPSBwbGF5ZXJzO1xuICBpZiAocDEuYm9hcmQuc2hpcHMubGVuZ3RoID09PSBudWxsKSByZXR1cm47XG5cbiAgY29uc3Qgc3RhcnRJbmRleCA9IGhlbHBlcnMuZ2V0Q2VsbEluZm8oZS50YXJnZXQpO1xuICBjb25zdCBhbGxOb2RlcyA9IHNoaXBQbGFjZW1lbnQuZ2V0UHJldmlldygpO1xuICBjb25zdCBsZW5ndGggPSBnZXROZXh0U2hpcCgpO1xuICBjb25zdCBheGlzID0gc2hpcFBsYWNlbWVudC5nZXRBeGlzKCk7XG5cbiAgaWYgKHNoaXBQbGFjZW1lbnQuaXNWYWxpZChhbGxOb2RlcywgbGVuZ3RoKSkge1xuICAgIHAxLmJvYXJkLnBsYWNlU2hpcChsZW5ndGgsIHN0YXJ0SW5kZXgsIGF4aXMpO1xuICAgIHNoaXBQbGFjZW1lbnQuY2xlYXJQcmV2aWV3KCk7XG4gICAgZG9tLnJlbmRlclNoaXBzKHAxKTtcblxuICAgIGlmIChwMS5ib2FyZC5zaGlwcy5sZW5ndGggPT09IDUpIHtcbiAgICAgIGRvbS50b2dnbGVCdG5zKCdzdGFydCcsIGZhbHNlKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB7IG5ld0dhbWUsIHN0YXJ0R2FtZSwgcmVjZWl2ZVBsYXllck1vdmUsIHBsYWNlU2hpcCwgZ2V0TmV4dFNoaXAgfTtcbiIsImltcG9ydCBzaGlwRmFjdG9yeSBmcm9tICcuL3NoaXBGYWN0b3J5JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2FtZWJvYXJkRmFjdG9yeSgpIHtcbiAgY29uc3QgY3JlYXRlQm9hcmQgPSAoKSA9PiB7XG4gICAgY29uc3QgZ2FtZWJvYXJkID0gbmV3IEFycmF5KDEwKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIGdhbWVib2FyZFtpXSA9IHt9O1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIGdhbWVib2FyZFtpXVtqXSA9IHtcbiAgICAgICAgICBoaXQ6IGZhbHNlLFxuICAgICAgICAgIHNoaXBJZDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdhbWVib2FyZDtcbiAgfTtcbiAgLy8gY29uc3QgbWlzc2VzID0gW107XG4gIGNvbnN0IHRpbGVzID0gY3JlYXRlQm9hcmQoKTtcblxuICBjb25zdCBzaGlwcyA9IFtdO1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IChsZW5ndGgsIFt4LCB5XSwgYXhpcykgPT4ge1xuICAgIGNvbnN0IG5ld1NoaXAgPSBzaGlwRmFjdG9yeShzaGlwcy5sZW5ndGgsIGxlbmd0aCk7XG4gICAgc2hpcHMucHVzaChuZXdTaGlwKTtcbiAgICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgICAvLyBQbGFjZSBob3Jpem9udGFsbHlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBuZXdTaGlwLmNvb3Jkcy5wdXNoKFt4LCB5XSk7XG4gICAgICAgIHRpbGVzW3hdW3ldLnNoaXBJZCA9IG5ld1NoaXAuaWQ7XG4gICAgICAgIHggKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgICAgLy8gUGxhY2UgdmVydGljYWxseVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5ld1NoaXAuY29vcmRzLnB1c2goW3gsIHldKTtcbiAgICAgICAgdGlsZXNbeF1beV0uc2hpcElkID0gbmV3U2hpcC5pZDtcbiAgICAgICAgeSArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgaGFzU2hpcCA9ICh0aWxlKSA9PiB0aWxlLnNoaXBJZCAhPT0gbnVsbDtcblxuICBjb25zdCBmaW5kU2hpcCA9IChpZCkgPT4ge1xuICAgIGxldCB0aGlzU2hpcDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2hpcHNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgIHRoaXNTaGlwID0gc2hpcHNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzU2hpcDtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKHRhcmdldCkgPT4ge1xuICAgIGNvbnN0IFt4LCB5XSA9IHRhcmdldDtcbiAgICBjb25zdCB0aGlzVGlsZSA9IHRpbGVzW3hdW3ldO1xuICAgIGlmICh0aGlzVGlsZS5oaXQpIHJldHVybjtcblxuICAgIC8vIGlmICghaGFzU2hpcCh0aGlzVGlsZSkpIHtcbiAgICAvLyAgIG1pc3Nlcy5wdXNoKHRhcmdldCk7XG4gICAgLy8gfVxuICAgIGlmIChoYXNTaGlwKHRoaXNUaWxlKSkge1xuICAgICAgY29uc3QgdGhpc1NoaXAgPSBmaW5kU2hpcCh0aGlzVGlsZS5zaGlwSWQpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzU2hpcC5jb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXNTaGlwLmNvb3Jkc1tpXS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZSA9PT0gdGFyZ2V0W2luZGV4XSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpc1NoaXAuaGVhbHRoW2ldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzVGlsZS5oaXQgPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHNoaXBzUmVtYWluaW5nID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpbHRlclNoaXBzID0gc2hpcHMuZmlsdGVyKChzaGlwKSA9PiBzaGlwLmlzU3VuaygpID09PSBmYWxzZSk7XG4gICAgcmV0dXJuIGZpbHRlclNoaXBzLmxlbmd0aDtcbiAgfTtcblxuICBjb25zdCBhbGxTaGlwc1N1bmsgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3Vua1NoaXBzID0gc2hpcHNSZW1haW5pbmcoKTtcbiAgICByZXR1cm4gc3Vua1NoaXBzID09PSAwO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdGlsZXMsXG4gICAgc2hpcHMsXG4gICAgcGxhY2VTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgc2hpcHNSZW1haW5pbmcsXG4gICAgYWxsU2hpcHNTdW5rLFxuICB9O1xufVxuIiwiY29uc3QgZ2V0Q2VsbEluZm8gPSAodGFyZ2V0KSA9PiB7XG4gIHJldHVybiBbTnVtYmVyKHRhcmdldC5kYXRhc2V0LngpLCBOdW1iZXIodGFyZ2V0LmRhdGFzZXQueSldO1xufTtcblxuY29uc3QgYWxyZWFkeVBsYXllZCA9IChwbGF5ZXIsIHRhcmdldCkgPT4ge1xuICBjb25zdCBwcmV2aW91c01vdmVzID0gcGxheWVyLm1vdmVzO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzTW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocHJldmlvdXNNb3Zlc1tpXS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZSA9PT0gdGFyZ2V0W2luZGV4XSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCB0aW1lb3V0ID0gKG1zKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpO1xuICB9KTtcbn07XG5cbi8vIGNvbnN0IGdlbmVyYXRlUmFuZG9tID0gKCkgPT4ge1xuLy8gICBjb25zdCByYW5kb20gPSBbXG4vLyAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLFxuLy8gICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbi8vICAgXTtcbi8vICAgcmV0dXJuIHJhbmRvbTtcbi8vIH07XG5cbi8vIGNvbnN0IGdldFJhbmRvbU1vdmUgPSBhc3luYyAocGxheWVyKSA9PiB7XG4vLyAgIGxldCByYW5kb21Nb3ZlID0gZ2VuZXJhdGVSYW5kb20oKTtcbi8vICAgd2hpbGUgKGFscmVhZHlQbGF5ZWQocGxheWVyLCByYW5kb21Nb3ZlKSkge1xuLy8gICAgIHJhbmRvbU1vdmUgPSBnZW5lcmF0ZVJhbmRvbSgpO1xuLy8gICB9XG4vLyAgIGF3YWl0IHRpbWVvdXQoNDAwKTtcbi8vICAgcmV0dXJuIHJhbmRvbU1vdmU7XG4vLyB9O1xuXG4vLyBjb25zdCBnZXRUdXJuID0gKG9iaikgPT4ge1xuLy8gICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbi8vICAgICBjb25zdCBwbGF5ZXIgPSBvYmpba2V5c1tpXV07XG4vLyAgICAgaWYgKHBsYXllci50dXJuID09PSBmYWxzZSkge1xuLy8gICAgICAgcmV0dXJuIHBsYXllclxuLy8gICAgIH1cbi8vICAgfVxuLy8gfTtcblxuY29uc3QgbmV4dFNoaXBMZW5ndGggPSAobnVtU2hpcHNQbGFjZWQpID0+IHtcbiAgc3dpdGNoIChudW1TaGlwc1BsYWNlZCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiA1O1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiA0O1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiAyO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuZXhwb3J0IHsgZ2V0Q2VsbEluZm8sIGFscmVhZHlQbGF5ZWQsIHRpbWVvdXQsIG5leHRTaGlwTGVuZ3RoIH07XG4iLCJpbXBvcnQgZ2FtZWJvYXJkRmFjdG9yeSBmcm9tICcuL2dhbWVib2FyZEZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbGF5ZXJGYWN0b3J5KG51bSwgaHVtYW4pIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZWJvYXJkRmFjdG9yeSgpO1xuICBjb25zdCBtb3ZlcyA9IFtdO1xuICBjb25zdCBtYWtlTW92ZSA9ICh0YXJnZXQsIGVuZW15Qm9hcmQpID0+IHtcbiAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2sodGFyZ2V0KTtcbiAgICBtb3Zlcy5wdXNoKHRhcmdldCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgbnVtKCkge1xuICAgICAgcmV0dXJuIG51bTtcbiAgICB9LFxuICAgIGdldCBib2FyZCgpIHtcbiAgICAgIHJldHVybiBnYW1lYm9hcmQ7XG4gICAgfSxcbiAgICBnZXQgaXNIdW1hbigpIHtcbiAgICAgIHJldHVybiBodW1hbjtcbiAgICB9LFxuICAgIC8vIGdldCB0dXJuKCkge1xuICAgIC8vICAgcmV0dXJuIHR1cm47XG4gICAgLy8gfSxcbiAgICBnZXQgbW92ZXMoKSB7XG4gICAgICByZXR1cm4gbW92ZXM7XG4gICAgfSxcbiAgICBtYWtlTW92ZSxcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNoaXBGYWN0b3J5KGlkLCBsZW5ndGgpIHtcbiAgY29uc3QgY3JlYXRlSGVhbHRoID0gKHNpemUpID0+IHtcbiAgICBjb25zdCBhcnJheSA9IFsuLi5BcnJheShzaXplKS5rZXlzKCldO1xuICAgIGNvbnN0IGhlYWx0aCA9IGFycmF5LnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgcHJldltjdXJyXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwge30pO1xuICAgIHJldHVybiBoZWFsdGg7XG4gIH07XG5cbiAgY29uc3QgY29vcmRzID0gW107XG5cbiAgY29uc3QgaGVhbHRoID0gY3JlYXRlSGVhbHRoKGxlbmd0aCk7XG4gIC8vIGhlYWx0aCA9IHsgd2hlcmUgYm9vbCByZXByZXNlbnRzIGhpdC9ubyBoaXRcbiAgLy8gICAwOiBmYWxzZSxcbiAgLy8gICAxOiBmYWxzZSxcbiAgLy8gICAyOiBmYWxzZSxcbiAgLy8gfVxuICBjb25zdCBoaXQgPSAoaW5kZXgpID0+IHtcbiAgICBoZWFsdGhbaW5kZXhdID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoaGVhbHRoKS5ldmVyeSgoaW5kZXgpID0+IGluZGV4ID09PSB0cnVlKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIGxlbmd0aCxcbiAgICBoZWFsdGgsXG4gICAgY29vcmRzLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gIH07XG59XG4iLCJpbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5cbmNvbnN0IGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXllci1ib2FyZCcpO1xuXG5jb25zdCBheGVzID0ge1xuICB4OiB0cnVlLFxuICB5OiBmYWxzZSxcbn07XG5cbmNvbnN0IGdldEF4aXMgPSAoKSA9PiB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhheGVzKTtcbiAgcmV0dXJuIGtleXMuZmlsdGVyKChrZXkpID0+IGF4ZXNba2V5XSA9PT0gdHJ1ZSlbMF07XG59O1xuXG5jb25zdCBzd2l0Y2hBeGlzID0gKCkgPT4ge1xuICBheGVzLnggPSAhYXhlcy54O1xuICBheGVzLnkgPSAhYXhlcy54O1xufTtcblxuY29uc3QgaXNWYWxpZCA9IChjb29yZHMsIGxlbmd0aCkgPT4ge1xuICBjb25zdCBpc1dpdGhpbkJvdW5kcyA9IGNvb3Jkcy5sZW5ndGggPT09IGxlbmd0aDtcbiAgY29uc3Qgbm9PdmVybGFwID0gY29vcmRzLmV2ZXJ5KChjb29yZCkgPT4gIWNvb3JkLmNsYXNzTGlzdC5jb250YWlucygnc2hpcCcpKTtcbiAgcmV0dXJuIGlzV2l0aGluQm91bmRzICYmIG5vT3ZlcmxhcDtcbn07XG5cbmNvbnN0IHByZXZpZXdTaGlwID0gKGUsIGxlbmd0aCkgPT4ge1xuICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdib2FyZCcpIHx8IGxlbmd0aCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gIGNvbnN0IFt4LCB5XSA9IGhlbHBlcnMuZ2V0Q2VsbEluZm8oZS50YXJnZXQpO1xuICBjb25zdCBzaGlwQ29vcmRzID0gW107XG4gIGNvbnN0IGF4aXMgPSBnZXRBeGlzKCk7XG5cbiAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vID45ID0gb3V0IG9mIGJvdW5kc1xuICAgICAgaWYgKGkgKyB4ID4gOSkgYnJlYWs7XG5cbiAgICAgIGNvbnN0IG5leHRDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7aSArIHh9J11bZGF0YS15PScke3l9J11gXG4gICAgICApO1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKG5leHRDZWxsKTtcbiAgICB9XG4gIH1cbiAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vID45ID0gb3V0IG9mIGJvdW5kc1xuICAgICAgaWYgKGkgKyB5ID4gOSkgYnJlYWs7XG5cbiAgICAgIGNvbnN0IG5leHRDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7eH0nXVtkYXRhLXk9JyR7aSArIHl9J11gXG4gICAgICApO1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKG5leHRDZWxsKTtcbiAgICB9XG4gIH1cblxuICBpZiAoaXNWYWxpZChzaGlwQ29vcmRzLCBsZW5ndGgpKSB7XG4gICAgc2hpcENvb3Jkcy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAtcHJldmlldycpKTtcbiAgfSBlbHNlIHtcbiAgICBzaGlwQ29vcmRzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgnaW52YWxpZCcpKTtcbiAgfVxufTtcblxuY29uc3QgY2xlYXJQcmV2aWV3ID0gKCkgPT4ge1xuICBjb25zdCBjZWxscyA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnc2hpcC1wcmV2aWV3JywgJ2ludmFsaWQnKSk7XG59O1xuXG5jb25zdCBnZXRQcmV2aWV3ID0gKCkgPT4gWy4uLmJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaGlwLXByZXZpZXcnKV07XG5cbmV4cG9ydCB7IGlzVmFsaWQsIGdldEF4aXMsIHN3aXRjaEF4aXMsIHByZXZpZXdTaGlwLCBjbGVhclByZXZpZXcsIGdldFByZXZpZXcgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5pbXBvcnQgKiBhcyBnYW1lIGZyb20gJy4vbW9kdWxlcy9nYW1lJ1xuaW1wb3J0ICogYXMgZG9tIGZyb20gJy4vbW9kdWxlcy9kb20nO1xuaW1wb3J0ICogYXMgZXZlbnRDb250cm9sbGVyIGZyb20gJy4vbW9kdWxlcy9ldmVudENvbnRyb2xsZXInXG5cbmRvbS5jcmVhdGVCb2FyZHMoKTtcbmdhbWUubmV3R2FtZSgpO1xuXG5ldmVudENvbnRyb2xsZXIuaW5pdEJvYXJkRXZlbnRzKCk7XG5ldmVudENvbnRyb2xsZXIuaW5pdEdhbWVCdXR0b25zKCk7XG5ldmVudENvbnRyb2xsZXIuaW5pdFNoaXBQbGFjZW1lbnQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=