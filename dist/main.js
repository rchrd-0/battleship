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

const placeShips = () => {
  
}




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
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'player');
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
};

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
  if (e.target.classList.contains('board') || p1.board.ships.length === null) {
    return;
  }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQSxvQkFBb0IsRUFBRSxhQUFhLE1BQU07QUFDekM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRStFOzs7Ozs7O1VDckUvRTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTnFCO0FBQ2lCO0FBQ0Q7QUFDdUI7O0FBRTVELHNEQUFnQjtBQUNoQixrREFBWTs7QUFFWixxRUFBK0I7QUFDL0IscUVBQStCO0FBQy9CLHVFQUFpQyxHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2JvdExvZ2ljLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2V2ZW50Q29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvaGVscGVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXBQbGFjZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuXG5jb25zdCBnZW5lcmF0ZVJhbmRvbSA9ICgpID0+IHtcbiAgY29uc3QgcmFuZG9tID0gW1xuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gIF07XG4gIHJldHVybiByYW5kb207XG59O1xuXG5jb25zdCBnZXRSYW5kb21Nb3ZlID0gYXN5bmMgKHBsYXllcikgPT4ge1xuICBsZXQgcmFuZG9tTW92ZSA9IGdlbmVyYXRlUmFuZG9tKCk7XG4gIHdoaWxlIChoZWxwZXJzLmFscmVhZHlQbGF5ZWQocGxheWVyLCByYW5kb21Nb3ZlKSkge1xuICAgIHJhbmRvbU1vdmUgPSBnZW5lcmF0ZVJhbmRvbSgpO1xuICB9XG4gIGF3YWl0IGhlbHBlcnMudGltZW91dCg0MDApO1xuICByZXR1cm4gcmFuZG9tTW92ZTtcbn07XG5cbmNvbnN0IHBsYWNlU2hpcHMgPSAoKSA9PiB7XG4gIFxufVxuXG5leHBvcnQgeyBnZXRSYW5kb21Nb3ZlIH07XG4iLCJjb25zdCBnYW1lYm9hcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkJyk7XG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcbmNvbnN0IGNvbXBCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb21wLWJvYXJkJyk7XG5jb25zdCBnYW1lSW5mbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lLWluZm8nKTtcblxuY29uc3QgdXBkYXRlU2hpcENvdW50ID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB0aGlzQm9hcmQgPSBwbGF5ZXIuaXNIdW1hbiA/IHBsYXllckJvYXJkIDogY29tcEJvYXJkO1xuICBjb25zdCBzaGlwQ291bnRlciA9IHRoaXNCb2FyZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICBjb25zdCBzaGlwc1JlbWFpbmluZyA9IHBsYXllci5ib2FyZC5zaGlwc1JlbWFpbmluZygpO1xuXG4gIHNoaXBDb3VudGVyLnRleHRDb250ZW50ID0gYFNoaXBzIHJlbWFpbmluZzogJHtzaGlwc1JlbWFpbmluZ31gO1xufTtcblxuY29uc3QgY3JlYXRlQm9hcmRzID0gKCkgPT4ge1xuICBnYW1lYm9hcmRzLmZvckVhY2goKGJvYXJkKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgY29uc3QgYm9hcmRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgYm9hcmRDZWxsLmNsYXNzTGlzdC5hZGQoJ2JvYXJkLWNlbGwnKTtcbiAgICAgICAgYm9hcmRDZWxsLmRhdGFzZXQueCA9IGo7XG4gICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnkgPSBpO1xuICAgICAgICBib2FyZC5hcHBlbmRDaGlsZChib2FyZENlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5jb25zdCByZW5kZXJTaGlwcyA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgeyBzaGlwcyB9ID0gcGxheWVyLmJvYXJkO1xuICBjb25zdCBjb29yZHMgPSBzaGlwcy5tYXAoKHNoaXApID0+IHNoaXAuY29vcmRzKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29vcmRzW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBbY29vcmRzW2ldW2pdWzBdLCBjb29yZHNbaV1bal1bMV1dO1xuICAgICAgY29uc3QgdGhpc0NlbGwgPSBwbGF5ZXJCb2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEteD0nJHt4fSddW2RhdGEteT0nJHt5fSddYFxuICAgICAgKTtcbiAgICAgIHRoaXNDZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICB9XG4gIH1cbiAgdXBkYXRlU2hpcENvdW50KHBsYXllcik7XG59O1xuXG5jb25zdCB1cGRhdGVCb2FyZCA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbXBCb2FyZDtcbiAgY29uc3QgeyB0aWxlcyB9ID0gcGxheWVyLmJvYXJkO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IE9iamVjdC5rZXlzKHRpbGVzW2ldKS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdGhpc1RpbGUgPSB0aWxlc1tpXVtqXTtcbiAgICAgIGNvbnN0IGhhc1NoaXAgPSB0aGlzVGlsZS5zaGlwSWQgIT09IG51bGw7XG4gICAgICBpZiAodGhpc1RpbGUuaGl0KSB7XG4gICAgICAgIGNvbnN0IHRoaXNDZWxsID0gdGhpc0JvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgYFtkYXRhLXg9JyR7aX0nXVtkYXRhLXk9JyR7an0nXWBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGhhc1NoaXApIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdXBkYXRlU2hpcENvdW50KHBsYXllcik7XG59O1xuXG5jb25zdCBzdHlsZUdhbWVPdmVyID0gKGJvb2wpID0+IHtcbiAgaWYgKGJvb2wpIHtcbiAgICBnYW1lYm9hcmRzLmZvckVhY2goKGJvYXJkKSA9PiBib2FyZC5jbGFzc0xpc3QuYWRkKCdnYW1lLW92ZXInKSk7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4gYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnZ2FtZS1vdmVyJykpO1xuICB9XG59O1xuXG5jb25zdCBjbGVhclVJID0gKC4uLnBsYXllcnMpID0+IHtcbiAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4ge1xuICAgIGNvbnN0IGNlbGxzID0gYm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ21pc3MnLCAnaGl0JywgJ3NoaXAnKTtcbiAgICB9KTtcbiAgfSk7XG4gIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB1cGRhdGVTaGlwQ291bnQocGxheWVyKSk7XG4gIHN0eWxlR2FtZU92ZXIoZmFsc2UpO1xufTtcblxuY29uc3QgYW5ub3VuY2VHYW1lT3ZlciA9ICh3aW5uZXIpID0+IHtcbiAgY29uc3Qgd2luTWVzc2FnZSA9XG4gICAgd2lubmVyLm51bSA9PT0gMVxuICAgICAgPyAnQ29uZ3JhdHVsYXRpb25zISBZb3Ugd2luISdcbiAgICAgIDogJ0dhbWUgb3ZlciAuLi4gQ29tcHV0ZXIgd2lucyEnO1xuXG4gIGdhbWVJbmZvLnRleHRDb250ZW50ID0gd2luTWVzc2FnZTtcbiAgc3R5bGVHYW1lT3Zlcih0cnVlKTtcbn07XG5cbmNvbnN0IGRpc2FibGVFdmVudHMgPSAoYm9vbCwgYm9hcmQpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gYm9hcmQgPT09ICdjb21wJyA/IGNvbXBCb2FyZCA6IHBsYXllckJvYXJkO1xuICBpZiAoYm9vbCkge1xuICAgIHRoaXNCb2FyZC5jbGFzc0xpc3QuYWRkKCduby1ldmVudHMnKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzQm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tZXZlbnRzJyk7XG4gIH1cbn07XG5cbmNvbnN0IHRvZ2dsZUJ0bnMgPSAoYnV0dG9uLCBzdGF0ZSkgPT4ge1xuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdGFydC1idG4nKTtcbiAgY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXN0YXJ0LWJ0bicpO1xuXG4gIGlmIChidXR0b24gPT09ICdzdGFydCcpIHtcbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgIHN0YXJ0QnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0QnRuLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoYnV0dG9uID09PSAncmVzdGFydCcpIHtcbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgIHJlc3RhcnRCdG4udGV4dENvbnRlbnQgPSAnTmV3IGdhbWUnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN0YXJ0QnRuLnRleHRDb250ZW50ID0gJ1Jlc3RhcnQnO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IHtcbiAgY3JlYXRlQm9hcmRzLFxuICBjbGVhclVJLFxuICByZW5kZXJTaGlwcyxcbiAgdXBkYXRlQm9hcmQsXG4gIGRpc2FibGVFdmVudHMsXG4gIGFubm91bmNlR2FtZU92ZXIsXG4gIHRvZ2dsZUJ0bnMsXG59O1xuIiwiaW1wb3J0ICogYXMgZ2FtZSBmcm9tICcuL2dhbWUnO1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgc2hpcFBsYWNlbWVudCBmcm9tICcuL3NoaXBQbGFjZW1lbnQnO1xuXG5jb25zdCBpbml0Qm9hcmRFdmVudHMgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbXBDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjb21wLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gIGNvbXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGhlbHBlcnMuZ2V0Q2VsbEluZm8oZS50YXJnZXQpO1xuICAgICAgZ2FtZS5yZWNlaXZlUGxheWVyTW92ZShjb29yZCk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuY29uc3QgaW5pdEdhbWVCdXR0b25zID0gKCkgPT4ge1xuICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc3RhcnQtYnRuJyk7XG4gIHJlc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLm5ld0dhbWUpO1xuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdGFydC1idG4nKTtcbiAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLnN0YXJ0R2FtZSk7XG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb3RhdGUtc2hpcCcpO1xuICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzaGlwUGxhY2VtZW50LnN3aXRjaEF4aXMpXG59O1xuXG5jb25zdCBpbml0U2hpcFBsYWNlbWVudCA9ICgpID0+IHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyLWJvYXJkJyk7XG4gIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgoZSkgPT4ge1xuICAgIGNvbnN0IG5leHRTaGlwID0gZ2FtZS5nZXROZXh0U2hpcCgpO1xuICAgIHNoaXBQbGFjZW1lbnQucHJldmlld1NoaXAoZSwgbmV4dFNoaXApO1xuICB9KSlcbiAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBzaGlwUGxhY2VtZW50LmNsZWFyUHJldmlldyk7XG4gIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5wbGFjZVNoaXApXG59O1xuXG5leHBvcnQgeyBpbml0Qm9hcmRFdmVudHMsIGluaXRHYW1lQnV0dG9ucywgaW5pdFNoaXBQbGFjZW1lbnQgfTtcbiIsImltcG9ydCBwbGF5ZXJGYWN0b3J5IGZyb20gJy4vcGxheWVyRmFjdG9yeSc7XG5pbXBvcnQgKiBhcyBkb20gZnJvbSAnLi9kb20nO1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgc2hpcFBsYWNlbWVudCBmcm9tICcuL3NoaXBQbGFjZW1lbnQnO1xuaW1wb3J0ICogYXMgYm90TG9naWMgZnJvbSAnLi9ib3RMb2dpYyc7XG5cbmNvbnN0IHBsYXllcnMgPSB7XG4gIHAxOiBudWxsLFxuICBjb206IG51bGwsXG59O1xuXG5jb25zdCBjaGVja0dhbWVTdGF0ZSA9IChwbGF5ZXIpID0+IHBsYXllci5ib2FyZC5hbGxTaGlwc1N1bmsoKTtcblxuY29uc3QgbmV3R2FtZSA9ICgpID0+IHtcbiAgcGxheWVycy5wMSA9IHBsYXllckZhY3RvcnkoMSwgdHJ1ZSk7XG4gIHBsYXllcnMuY29tID0gcGxheWVyRmFjdG9yeSgyLCBmYWxzZSk7XG5cbiAgZG9tLmNsZWFyVUkocGxheWVycy5wMSwgcGxheWVycy5jb20pO1xuICBkb20udG9nZ2xlQnRucygnc3RhcnQnLCB0cnVlKTtcbiAgZG9tLnRvZ2dsZUJ0bnMoJ3Jlc3RhcnQnLCBmYWxzZSk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUsICdjb21wJyk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlLCAncGxheWVyJyk7XG59O1xuXG5jb25zdCBzdGFydEdhbWUgPSAoKSA9PiB7XG4gIHBsYXllcnMuY29tLmJvYXJkLnBsYWNlU2hpcCgyLCBbMCwgMF0sICd4Jyk7XG5cbiAgZG9tLnRvZ2dsZUJ0bnMoJ3N0YXJ0JywgdHJ1ZSk7XG4gIGRvbS51cGRhdGVCb2FyZChwbGF5ZXJzLmNvbSk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUsICdwbGF5ZXInKTtcbiAgZG9tLmRpc2FibGVFdmVudHMoZmFsc2UsICdjb21wJyk7XG59O1xuXG5jb25zdCBlbmRHYW1lID0gKHdpbm5lcikgPT4ge1xuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlLCAnY29tcCcpO1xuICBkb20udG9nZ2xlQnRucygncmVzdGFydCcsIHRydWUpO1xuICBkb20uYW5ub3VuY2VHYW1lT3Zlcih3aW5uZXIpO1xufTtcblxuY29uc3QgcGxheUNvbU1vdmUgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHsgcDEsIGNvbSB9ID0gcGxheWVycztcbiAgY29uc3QgcmFuZG9tTW92ZSA9IGF3YWl0IGJvdExvZ2ljLmdldFJhbmRvbU1vdmUoY29tKTtcblxuICBjb20ubWFrZU1vdmUocmFuZG9tTW92ZSwgcDEuYm9hcmQpO1xuICBkb20udXBkYXRlQm9hcmQocDEpO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUocDEpO1xuICBpZiAod2luU3RhdGUpIHtcbiAgICBlbmRHYW1lKGNvbSk7XG4gIH0gZWxzZSB7XG4gICAgZG9tLmRpc2FibGVFdmVudHMoZmFsc2UsICdjb21wJyk7XG4gIH1cbn07XG5cbmNvbnN0IHJlY2VpdmVQbGF5ZXJNb3ZlID0gKGNvb3JkKSA9PiB7XG4gIGNvbnN0IHsgcDEsIGNvbSB9ID0gcGxheWVycztcbiAgaWYgKGhlbHBlcnMuYWxyZWFkeVBsYXllZChwMSwgY29vcmQpKSByZXR1cm47XG4gIHAxLm1ha2VNb3ZlKGNvb3JkLCBjb20uYm9hcmQpO1xuICBkb20udXBkYXRlQm9hcmQoY29tKTtcblxuICBjb25zdCB3aW5TdGF0ZSA9IGNoZWNrR2FtZVN0YXRlKGNvbSk7XG4gIGlmICh3aW5TdGF0ZSkge1xuICAgIGVuZEdhbWUocDEpO1xuICB9IGVsc2Uge1xuICAgIHBsYXlDb21Nb3ZlKHAxLCBjb20pO1xuICB9XG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUsICdjb21wJyk7XG59O1xuXG5jb25zdCBnZXROZXh0U2hpcCA9ICgpID0+IHtcbiAgY29uc3Qgc2hpcHNQbGFjZWQgPSBwbGF5ZXJzLnAxLmJvYXJkLnNoaXBzLmxlbmd0aDtcbiAgcmV0dXJuIGhlbHBlcnMubmV4dFNoaXBMZW5ndGgoc2hpcHNQbGFjZWQpO1xufTtcblxuY29uc3QgcGxhY2VTaGlwID0gKGUpID0+IHtcbiAgY29uc3QgeyBwMSB9ID0gcGxheWVycztcbiAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYm9hcmQnKSB8fCBwMS5ib2FyZC5zaGlwcy5sZW5ndGggPT09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGFydEluZGV4ID0gaGVscGVycy5nZXRDZWxsSW5mbyhlLnRhcmdldCk7XG4gIGNvbnN0IGFsbE5vZGVzID0gc2hpcFBsYWNlbWVudC5nZXRQcmV2aWV3KCk7XG4gIGNvbnN0IGxlbmd0aCA9IGdldE5leHRTaGlwKCk7XG4gIGNvbnN0IGF4aXMgPSBzaGlwUGxhY2VtZW50LmdldEF4aXMoKTtcblxuICBpZiAoc2hpcFBsYWNlbWVudC5pc1ZhbGlkKGFsbE5vZGVzLCBsZW5ndGgpKSB7XG4gICAgcDEuYm9hcmQucGxhY2VTaGlwKGxlbmd0aCwgc3RhcnRJbmRleCwgYXhpcyk7XG4gICAgc2hpcFBsYWNlbWVudC5jbGVhclByZXZpZXcoKTtcbiAgICBkb20ucmVuZGVyU2hpcHMocDEpO1xuXG4gICAgaWYgKHAxLmJvYXJkLnNoaXBzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgZG9tLnRvZ2dsZUJ0bnMoJ3N0YXJ0JywgZmFsc2UpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IHsgbmV3R2FtZSwgc3RhcnRHYW1lLCByZWNlaXZlUGxheWVyTW92ZSwgcGxhY2VTaGlwLCBnZXROZXh0U2hpcCB9O1xuIiwiaW1wb3J0IHNoaXBGYWN0b3J5IGZyb20gJy4vc2hpcEZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnYW1lYm9hcmRGYWN0b3J5KCkge1xuICBjb25zdCBjcmVhdGVCb2FyZCA9ICgpID0+IHtcbiAgICBjb25zdCBnYW1lYm9hcmQgPSBuZXcgQXJyYXkoMTApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZ2FtZWJvYXJkW2ldID0ge307XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgZ2FtZWJvYXJkW2ldW2pdID0ge1xuICAgICAgICAgIGhpdDogZmFsc2UsXG4gICAgICAgICAgc2hpcElkOiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2FtZWJvYXJkO1xuICB9O1xuICAvLyBjb25zdCBtaXNzZXMgPSBbXTtcbiAgY29uc3QgdGlsZXMgPSBjcmVhdGVCb2FyZCgpO1xuXG4gIGNvbnN0IHNoaXBzID0gW107XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKGxlbmd0aCwgW3gsIHldLCBheGlzKSA9PiB7XG4gICAgY29uc3QgbmV3U2hpcCA9IHNoaXBGYWN0b3J5KHNoaXBzLmxlbmd0aCwgbGVuZ3RoKTtcbiAgICBzaGlwcy5wdXNoKG5ld1NoaXApO1xuICAgIGlmIChheGlzID09PSAneCcpIHtcbiAgICAgIC8vIFBsYWNlIGhvcml6b250YWxseVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5ld1NoaXAuY29vcmRzLnB1c2goW3gsIHldKTtcbiAgICAgICAgdGlsZXNbeF1beV0uc2hpcElkID0gbmV3U2hpcC5pZDtcbiAgICAgICAgeCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgICAvLyBQbGFjZSB2ZXJ0aWNhbGx5XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1NoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmV3U2hpcC5jb29yZHMucHVzaChbeCwgeV0pO1xuICAgICAgICB0aWxlc1t4XVt5XS5zaGlwSWQgPSBuZXdTaGlwLmlkO1xuICAgICAgICB5ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBoYXNTaGlwID0gKHRpbGUpID0+IHRpbGUuc2hpcElkICE9PSBudWxsO1xuXG4gIGNvbnN0IGZpbmRTaGlwID0gKGlkKSA9PiB7XG4gICAgbGV0IHRoaXNTaGlwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzaGlwc1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgdGhpc1NoaXAgPSBzaGlwc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNTaGlwO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAodGFyZ2V0KSA9PiB7XG4gICAgY29uc3QgW3gsIHldID0gdGFyZ2V0O1xuICAgIGNvbnN0IHRoaXNUaWxlID0gdGlsZXNbeF1beV07XG4gICAgaWYgKHRoaXNUaWxlLmhpdCkgcmV0dXJuO1xuXG4gICAgLy8gaWYgKCFoYXNTaGlwKHRoaXNUaWxlKSkge1xuICAgIC8vICAgbWlzc2VzLnB1c2godGFyZ2V0KTtcbiAgICAvLyB9XG4gICAgaWYgKGhhc1NoaXAodGhpc1RpbGUpKSB7XG4gICAgICBjb25zdCB0aGlzU2hpcCA9IGZpbmRTaGlwKHRoaXNUaWxlLnNoaXBJZCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXNTaGlwLmNvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpc1NoaXAuY29vcmRzW2ldLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSB0YXJnZXRbaW5kZXhdKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzU2hpcC5oZWFsdGhbaV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXNUaWxlLmhpdCA9IHRydWU7XG4gIH07XG5cbiAgY29uc3Qgc2hpcHNSZW1haW5pbmcgPSAoKSA9PiB7XG4gICAgY29uc3QgZmlsdGVyU2hpcHMgPSBzaGlwcy5maWx0ZXIoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkgPT09IGZhbHNlKTtcbiAgICByZXR1cm4gZmlsdGVyU2hpcHMubGVuZ3RoO1xuICB9O1xuXG4gIGNvbnN0IGFsbFNoaXBzU3VuayA9ICgpID0+IHtcbiAgICBjb25zdCBzdW5rU2hpcHMgPSBzaGlwc1JlbWFpbmluZygpO1xuICAgIHJldHVybiBzdW5rU2hpcHMgPT09IDA7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB0aWxlcyxcbiAgICBzaGlwcyxcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBzaGlwc1JlbWFpbmluZyxcbiAgICBhbGxTaGlwc1N1bmssXG4gIH07XG59XG4iLCJjb25zdCBnZXRDZWxsSW5mbyA9ICh0YXJnZXQpID0+IHtcbiAgcmV0dXJuIFtOdW1iZXIodGFyZ2V0LmRhdGFzZXQueCksIE51bWJlcih0YXJnZXQuZGF0YXNldC55KV07XG59O1xuXG5jb25zdCBhbHJlYWR5UGxheWVkID0gKHBsYXllciwgdGFyZ2V0KSA9PiB7XG4gIGNvbnN0IHByZXZpb3VzTW92ZXMgPSBwbGF5ZXIubW92ZXM7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNNb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwcmV2aW91c01vdmVzW2ldLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSB0YXJnZXRbaW5kZXhdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IHRpbWVvdXQgPSAobXMpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XG4gIH0pO1xufTtcblxuY29uc3QgbmV4dFNoaXBMZW5ndGggPSAobnVtU2hpcHNQbGFjZWQpID0+IHtcbiAgc3dpdGNoIChudW1TaGlwc1BsYWNlZCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiA1O1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiA0O1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiAyO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuZXhwb3J0IHsgZ2V0Q2VsbEluZm8sIGFscmVhZHlQbGF5ZWQsIHRpbWVvdXQsIG5leHRTaGlwTGVuZ3RoIH07XG4iLCJpbXBvcnQgZ2FtZWJvYXJkRmFjdG9yeSBmcm9tICcuL2dhbWVib2FyZEZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbGF5ZXJGYWN0b3J5KG51bSwgaHVtYW4pIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZWJvYXJkRmFjdG9yeSgpO1xuICBjb25zdCBtb3ZlcyA9IFtdO1xuICBjb25zdCBtYWtlTW92ZSA9ICh0YXJnZXQsIGVuZW15Qm9hcmQpID0+IHtcbiAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2sodGFyZ2V0KTtcbiAgICBtb3Zlcy5wdXNoKHRhcmdldCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgbnVtKCkge1xuICAgICAgcmV0dXJuIG51bTtcbiAgICB9LFxuICAgIGdldCBib2FyZCgpIHtcbiAgICAgIHJldHVybiBnYW1lYm9hcmQ7XG4gICAgfSxcbiAgICBnZXQgaXNIdW1hbigpIHtcbiAgICAgIHJldHVybiBodW1hbjtcbiAgICB9LFxuICAgIC8vIGdldCB0dXJuKCkge1xuICAgIC8vICAgcmV0dXJuIHR1cm47XG4gICAgLy8gfSxcbiAgICBnZXQgbW92ZXMoKSB7XG4gICAgICByZXR1cm4gbW92ZXM7XG4gICAgfSxcbiAgICBtYWtlTW92ZSxcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNoaXBGYWN0b3J5KGlkLCBsZW5ndGgpIHtcbiAgY29uc3QgY3JlYXRlSGVhbHRoID0gKHNpemUpID0+IHtcbiAgICBjb25zdCBhcnJheSA9IFsuLi5BcnJheShzaXplKS5rZXlzKCldO1xuICAgIGNvbnN0IGhlYWx0aCA9IGFycmF5LnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgcHJldltjdXJyXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwge30pO1xuICAgIHJldHVybiBoZWFsdGg7XG4gIH07XG5cbiAgY29uc3QgY29vcmRzID0gW107XG5cbiAgY29uc3QgaGVhbHRoID0gY3JlYXRlSGVhbHRoKGxlbmd0aCk7XG4gIC8vIGhlYWx0aCA9IHsgd2hlcmUgYm9vbCByZXByZXNlbnRzIGhpdC9ubyBoaXRcbiAgLy8gICAwOiBmYWxzZSxcbiAgLy8gICAxOiBmYWxzZSxcbiAgLy8gICAyOiBmYWxzZSxcbiAgLy8gfVxuICBjb25zdCBoaXQgPSAoaW5kZXgpID0+IHtcbiAgICBoZWFsdGhbaW5kZXhdID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoaGVhbHRoKS5ldmVyeSgoaW5kZXgpID0+IGluZGV4ID09PSB0cnVlKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIGxlbmd0aCxcbiAgICBoZWFsdGgsXG4gICAgY29vcmRzLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gIH07XG59XG4iLCJpbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5cbmNvbnN0IGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXllci1ib2FyZCcpO1xuXG5jb25zdCBheGVzID0ge1xuICB4OiB0cnVlLFxuICB5OiBmYWxzZSxcbn07XG5cbmNvbnN0IGdldEF4aXMgPSAoKSA9PiB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhheGVzKTtcbiAgcmV0dXJuIGtleXMuZmlsdGVyKChrZXkpID0+IGF4ZXNba2V5XSA9PT0gdHJ1ZSlbMF07XG59O1xuXG5jb25zdCBzd2l0Y2hBeGlzID0gKCkgPT4ge1xuICBheGVzLnggPSAhYXhlcy54O1xuICBheGVzLnkgPSAhYXhlcy54O1xufTtcblxuY29uc3QgaXNWYWxpZCA9IChjb29yZHMsIGxlbmd0aCkgPT4ge1xuICBjb25zdCBpc1dpdGhpbkJvdW5kcyA9IGNvb3Jkcy5sZW5ndGggPT09IGxlbmd0aDtcbiAgY29uc3Qgbm9PdmVybGFwID0gY29vcmRzLmV2ZXJ5KChjb29yZCkgPT4gIWNvb3JkLmNsYXNzTGlzdC5jb250YWlucygnc2hpcCcpKTtcbiAgcmV0dXJuIGlzV2l0aGluQm91bmRzICYmIG5vT3ZlcmxhcDtcbn07XG5cbmNvbnN0IHByZXZpZXdTaGlwID0gKGUsIGxlbmd0aCkgPT4ge1xuICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdib2FyZCcpIHx8IGxlbmd0aCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gIGNvbnN0IFt4LCB5XSA9IGhlbHBlcnMuZ2V0Q2VsbEluZm8oZS50YXJnZXQpO1xuICBjb25zdCBzaGlwQ29vcmRzID0gW107XG4gIGNvbnN0IGF4aXMgPSBnZXRBeGlzKCk7XG5cbiAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vID45ID0gb3V0IG9mIGJvdW5kc1xuICAgICAgaWYgKGkgKyB4ID4gOSkgYnJlYWs7XG5cbiAgICAgIGNvbnN0IG5leHRDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7aSArIHh9J11bZGF0YS15PScke3l9J11gXG4gICAgICApO1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKG5leHRDZWxsKTtcbiAgICB9XG4gIH1cbiAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vID45ID0gb3V0IG9mIGJvdW5kc1xuICAgICAgaWYgKGkgKyB5ID4gOSkgYnJlYWs7XG5cbiAgICAgIGNvbnN0IG5leHRDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7eH0nXVtkYXRhLXk9JyR7aSArIHl9J11gXG4gICAgICApO1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKG5leHRDZWxsKTtcbiAgICB9XG4gIH1cblxuICBpZiAoaXNWYWxpZChzaGlwQ29vcmRzLCBsZW5ndGgpKSB7XG4gICAgc2hpcENvb3Jkcy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAtcHJldmlldycpKTtcbiAgfSBlbHNlIHtcbiAgICBzaGlwQ29vcmRzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgnaW52YWxpZCcpKTtcbiAgfVxufTtcblxuY29uc3QgY2xlYXJQcmV2aWV3ID0gKCkgPT4ge1xuICBjb25zdCBjZWxscyA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnc2hpcC1wcmV2aWV3JywgJ2ludmFsaWQnKSk7XG59O1xuXG5jb25zdCBnZXRQcmV2aWV3ID0gKCkgPT4gWy4uLmJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaGlwLXByZXZpZXcnKV07XG5cbmV4cG9ydCB7IGlzVmFsaWQsIGdldEF4aXMsIHN3aXRjaEF4aXMsIHByZXZpZXdTaGlwLCBjbGVhclByZXZpZXcsIGdldFByZXZpZXcgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5pbXBvcnQgKiBhcyBnYW1lIGZyb20gJy4vbW9kdWxlcy9nYW1lJ1xuaW1wb3J0ICogYXMgZG9tIGZyb20gJy4vbW9kdWxlcy9kb20nO1xuaW1wb3J0ICogYXMgZXZlbnRDb250cm9sbGVyIGZyb20gJy4vbW9kdWxlcy9ldmVudENvbnRyb2xsZXInXG5cbmRvbS5jcmVhdGVCb2FyZHMoKTtcbmdhbWUubmV3R2FtZSgpO1xuXG5ldmVudENvbnRyb2xsZXIuaW5pdEJvYXJkRXZlbnRzKCk7XG5ldmVudENvbnRyb2xsZXIuaW5pdEdhbWVCdXR0b25zKCk7XG5ldmVudENvbnRyb2xsZXIuaW5pdFNoaXBQbGFjZW1lbnQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=