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

// const createBoard = (...players) => {
//   players.forEach((player) => {
//     updateShipCount(player);
//     const thisBoard = player.isHuman ? playerBoard : compBoard;
//     const { tiles } = player.board;
//     for (let i = 0; i < tiles.length; i++) {
//       for (let j = 0; j < Object.keys(tiles[i]).length; j++) {
//         const boardCell = document.createElement('div');
//         boardCell.classList.add('board-cell');
//         boardCell.dataset.x = j;
//         boardCell.dataset.y = i;
//         thisBoard.appendChild(boardCell);
//       }
//     }
//   });
// };

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

const clearUI = () => {
  gameboards.forEach((board) => {
    const cells = board.querySelectorAll('.board-cell');
    cells.forEach((cell) => {
      cell.classList.remove('miss', 'hit', 'ship');
    });
  });
  // game over reset
};

const announceGameOver = (winner) => {
  const winMessage =
    winner.num === 1
      ? 'Congratulations! You win!'
      : 'Game over ... Computer wins!';

  gameboards.forEach((board) => board.classList.add('game-over'));
  gameInfo.textContent = winMessage;
};

const disableEvents = (bool, board = 'comp') => {
  const thisBoard = (board === 'comp') ? compBoard : playerBoard
  if (bool) {
    thisBoard.classList.add('no-events');
  } else {
    thisBoard.classList.remove('no-events');
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
  // const restartBtn = document.querySelector('#restart-btn');
  // restartBtn.addEventListener('click', game.newGame);
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





const players = {
  p1: null,
  com: null,
};

const checkGameState = (player) => player.board.allShipsSunk();

const newGame = () => {
  // Clean up board
  _dom__WEBPACK_IMPORTED_MODULE_1__.clearUI();
  // Create new player objects
  players.p1 = (0,_playerFactory__WEBPACK_IMPORTED_MODULE_0__["default"])(1, true);
  players.com = (0,_playerFactory__WEBPACK_IMPORTED_MODULE_0__["default"])(2, false);
  // Disable computer events
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true);
  // Enable player events
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false, 'player');
  // Start ship placement

  // Enable start game button
};

const startGame = () => {
  // players.p1 = playerFactory(1, true);
  // players.com = playerFactory(2, false);

  players.com.board.placeShip(2, [0, 0], 'x');
  players.p1.board.placeShip(9, [0, 0], 'x');

  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(players.p1);
  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(players.com);
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false);
  _dom__WEBPACK_IMPORTED_MODULE_1__.renderShips(players.p1);
};

const endGame = (winner) => {
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true);
  _dom__WEBPACK_IMPORTED_MODULE_1__.announceGameOver(winner);
};

const playComMove = async () => {
  const { p1, com } = players;
  const randomMove = await _helpers__WEBPACK_IMPORTED_MODULE_2__.getRandomMove(com);

  com.makeMove(randomMove, p1.board);
  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(p1);

  const winState = checkGameState(p1);
  if (winState) {
    endGame(com);
  } else {
    _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false);
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
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(true);
};

const getNextShip = () => {
  const shipsPlaced = players.p1.board.ships.length;
  return _helpers__WEBPACK_IMPORTED_MODULE_2__.nextShipLength(shipsPlaced);
};

const placeShip = (e) => {
  const { p1 } = players;
  if (p1.board.ships.length === null) return;

  const target = _helpers__WEBPACK_IMPORTED_MODULE_2__.getCellInfo(e.target);
  const length = getNextShip();
  const axis = _shipPlacement__WEBPACK_IMPORTED_MODULE_3__.getAxis();

  p1.board.placeShip(length, target, axis);
  _dom__WEBPACK_IMPORTED_MODULE_1__.renderShips(p1);
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
/* harmony export */   "getRandomMove": () => (/* binding */ getRandomMove),
/* harmony export */   "nextShipLength": () => (/* binding */ nextShipLength)
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

const generateRandom = () => {
  const random = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ];
  return random;
};

const getRandomMove = async (player) => {
  let randomMove = generateRandom();
  while (alreadyPlayed(player, randomMove)) {
    randomMove = generateRandom();
  }
  await timeout(400);
  return randomMove;
};

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
/* harmony export */   "isWithinBounds": () => (/* binding */ isWithinBounds),
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

const isWithinBounds = (cells, length) => {
  return cells.length === length;
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

  if (isWithinBounds(shipCoords, length)) {
    shipCoords.forEach((cell) => cell.classList.add('ship-preview'));
  } else {
    shipCoords.forEach((cell) => cell.classList.add('invalid'));
  }
};

const clearPreview = () => {
  const cells = board.querySelectorAll('.board-cell');
  cells.forEach((cell) => cell.classList.remove('ship-preview', 'invalid'));
};




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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ05xQjtBQUNpQjtBQUNEO0FBQ3VCOztBQUU1RCxzREFBZ0I7QUFDaEIsa0RBQVk7O0FBRVoscUVBQStCO0FBQy9CLHFFQUErQjtBQUMvQix1RUFBaUMsRyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzP2UzMjAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZXZlbnRDb250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lYm9hcmRGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9oZWxwZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXJGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcFBsYWNlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJjb25zdCBnYW1lYm9hcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkJyk7XG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcbmNvbnN0IGNvbXBCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb21wLWJvYXJkJyk7XG5jb25zdCBnYW1lSW5mbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lLWluZm8nKTtcblxuY29uc3QgdXBkYXRlU2hpcENvdW50ID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB0aGlzQm9hcmQgPSBwbGF5ZXIuaXNIdW1hbiA/IHBsYXllckJvYXJkIDogY29tcEJvYXJkO1xuICBjb25zdCBzaGlwQ291bnRlciA9IHRoaXNCb2FyZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICBjb25zdCBzaGlwc1JlbWFpbmluZyA9IHBsYXllci5ib2FyZC5zaGlwc1JlbWFpbmluZygpO1xuXG4gIHNoaXBDb3VudGVyLnRleHRDb250ZW50ID0gYFNoaXBzIHJlbWFpbmluZzogJHtzaGlwc1JlbWFpbmluZ31gO1xufTtcblxuY29uc3QgY3JlYXRlQm9hcmRzID0gKCkgPT4ge1xuICBnYW1lYm9hcmRzLmZvckVhY2goKGJvYXJkKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgY29uc3QgYm9hcmRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgYm9hcmRDZWxsLmNsYXNzTGlzdC5hZGQoJ2JvYXJkLWNlbGwnKTtcbiAgICAgICAgYm9hcmRDZWxsLmRhdGFzZXQueCA9IGo7XG4gICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnkgPSBpO1xuICAgICAgICBib2FyZC5hcHBlbmRDaGlsZChib2FyZENlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG4vLyBjb25zdCBjcmVhdGVCb2FyZCA9ICguLi5wbGF5ZXJzKSA9PiB7XG4vLyAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4vLyAgICAgdXBkYXRlU2hpcENvdW50KHBsYXllcik7XG4vLyAgICAgY29uc3QgdGhpc0JvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbXBCb2FyZDtcbi8vICAgICBjb25zdCB7IHRpbGVzIH0gPSBwbGF5ZXIuYm9hcmQ7XG4vLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKykge1xuLy8gICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBPYmplY3Qua2V5cyh0aWxlc1tpXSkubGVuZ3RoOyBqKyspIHtcbi8vICAgICAgICAgY29uc3QgYm9hcmRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4vLyAgICAgICAgIGJvYXJkQ2VsbC5jbGFzc0xpc3QuYWRkKCdib2FyZC1jZWxsJyk7XG4vLyAgICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnggPSBqO1xuLy8gICAgICAgICBib2FyZENlbGwuZGF0YXNldC55ID0gaTtcbi8vICAgICAgICAgdGhpc0JvYXJkLmFwcGVuZENoaWxkKGJvYXJkQ2VsbCk7XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9KTtcbi8vIH07XG5cbmNvbnN0IHJlbmRlclNoaXBzID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB7IHNoaXBzIH0gPSBwbGF5ZXIuYm9hcmQ7XG4gIGNvbnN0IGNvb3JkcyA9IHNoaXBzLm1hcCgoc2hpcCkgPT4gc2hpcC5jb29yZHMpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb29yZHNbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IFtjb29yZHNbaV1bal1bMF0sIGNvb3Jkc1tpXVtqXVsxXV07XG4gICAgICBjb25zdCB0aGlzQ2VsbCA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS14PScke3h9J11bZGF0YS15PScke3l9J11gXG4gICAgICApO1xuICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgdXBkYXRlQm9hcmQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IHBsYXllci5pc0h1bWFuID8gcGxheWVyQm9hcmQgOiBjb21wQm9hcmQ7XG4gIGNvbnN0IHsgdGlsZXMgfSA9IHBsYXllci5ib2FyZDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBPYmplY3Qua2V5cyh0aWxlc1tpXSkubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHRoaXNUaWxlID0gdGlsZXNbaV1bal07XG4gICAgICBjb25zdCBoYXNTaGlwID0gdGhpc1RpbGUuc2hpcElkICE9PSBudWxsO1xuICAgICAgaWYgKHRoaXNUaWxlLmhpdCkge1xuICAgICAgICBjb25zdCB0aGlzQ2VsbCA9IHRoaXNCb2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGBbZGF0YS14PScke2l9J11bZGF0YS15PScke2p9J11gXG4gICAgICAgICk7XG4gICAgICAgIGlmIChoYXNTaGlwKSB7XG4gICAgICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHVwZGF0ZVNoaXBDb3VudChwbGF5ZXIpO1xufTtcblxuY29uc3QgY2xlYXJVSSA9ICgpID0+IHtcbiAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4ge1xuICAgIGNvbnN0IGNlbGxzID0gYm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ21pc3MnLCAnaGl0JywgJ3NoaXAnKTtcbiAgICB9KTtcbiAgfSk7XG4gIC8vIGdhbWUgb3ZlciByZXNldFxufTtcblxuY29uc3QgYW5ub3VuY2VHYW1lT3ZlciA9ICh3aW5uZXIpID0+IHtcbiAgY29uc3Qgd2luTWVzc2FnZSA9XG4gICAgd2lubmVyLm51bSA9PT0gMVxuICAgICAgPyAnQ29uZ3JhdHVsYXRpb25zISBZb3Ugd2luISdcbiAgICAgIDogJ0dhbWUgb3ZlciAuLi4gQ29tcHV0ZXIgd2lucyEnO1xuXG4gIGdhbWVib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IGJvYXJkLmNsYXNzTGlzdC5hZGQoJ2dhbWUtb3ZlcicpKTtcbiAgZ2FtZUluZm8udGV4dENvbnRlbnQgPSB3aW5NZXNzYWdlO1xufTtcblxuY29uc3QgZGlzYWJsZUV2ZW50cyA9IChib29sLCBib2FyZCA9ICdjb21wJykgPT4ge1xuICBjb25zdCB0aGlzQm9hcmQgPSAoYm9hcmQgPT09ICdjb21wJykgPyBjb21wQm9hcmQgOiBwbGF5ZXJCb2FyZFxuICBpZiAoYm9vbCkge1xuICAgIHRoaXNCb2FyZC5jbGFzc0xpc3QuYWRkKCduby1ldmVudHMnKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzQm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tZXZlbnRzJyk7XG4gIH1cbn07XG5cbmV4cG9ydCB7XG4gIGNyZWF0ZUJvYXJkcyxcbiAgY2xlYXJVSSxcbiAgcmVuZGVyU2hpcHMsXG4gIHVwZGF0ZUJvYXJkLFxuICBkaXNhYmxlRXZlbnRzLFxuICBhbm5vdW5jZUdhbWVPdmVyLFxufTtcbiIsImltcG9ydCAqIGFzIGdhbWUgZnJvbSAnLi9nYW1lJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCAqIGFzIHNoaXBQbGFjZW1lbnQgZnJvbSAnLi9zaGlwUGxhY2VtZW50JztcblxuY29uc3QgaW5pdEJvYXJkRXZlbnRzID0gKCkgPT4ge1xuICBjb25zdCBjb21wQ2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjY29tcC1ib2FyZCAuYm9hcmQtY2VsbCcpO1xuICBjb21wQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgY29uc3QgY29vcmQgPSBoZWxwZXJzLmdldENlbGxJbmZvKGUudGFyZ2V0KTtcbiAgICAgIGdhbWUucmVjZWl2ZVBsYXllck1vdmUoY29vcmQpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbmNvbnN0IGluaXRHYW1lQnV0dG9ucyA9ICgpID0+IHtcbiAgLy8gY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXN0YXJ0LWJ0bicpO1xuICAvLyByZXN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5uZXdHYW1lKTtcbiAgY29uc3Qgcm90YXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvdGF0ZS1zaGlwJyk7XG4gIHJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNoaXBQbGFjZW1lbnQuc3dpdGNoQXhpcylcbn07XG5cbmNvbnN0IGluaXRTaGlwUGxhY2VtZW50ID0gKCkgPT4ge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcbiAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKChlKSA9PiB7XG4gICAgY29uc3QgbmV4dFNoaXAgPSBnYW1lLmdldE5leHRTaGlwKCk7XG4gICAgc2hpcFBsYWNlbWVudC5wcmV2aWV3U2hpcChlLCBuZXh0U2hpcCk7XG4gIH0pKVxuICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHNoaXBQbGFjZW1lbnQuY2xlYXJQcmV2aWV3KTtcbiAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLnBsYWNlU2hpcClcbn07XG5cbmV4cG9ydCB7IGluaXRCb2FyZEV2ZW50cywgaW5pdEdhbWVCdXR0b25zLCBpbml0U2hpcFBsYWNlbWVudCB9O1xuIiwiaW1wb3J0IHBsYXllckZhY3RvcnkgZnJvbSAnLi9wbGF5ZXJGYWN0b3J5JztcbmltcG9ydCAqIGFzIGRvbSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgKiBhcyBzaGlwUGxhY2VtZW50IGZyb20gJy4vc2hpcFBsYWNlbWVudCc7XG5cbmNvbnN0IHBsYXllcnMgPSB7XG4gIHAxOiBudWxsLFxuICBjb206IG51bGwsXG59O1xuXG5jb25zdCBjaGVja0dhbWVTdGF0ZSA9IChwbGF5ZXIpID0+IHBsYXllci5ib2FyZC5hbGxTaGlwc1N1bmsoKTtcblxuY29uc3QgbmV3R2FtZSA9ICgpID0+IHtcbiAgLy8gQ2xlYW4gdXAgYm9hcmRcbiAgZG9tLmNsZWFyVUkoKTtcbiAgLy8gQ3JlYXRlIG5ldyBwbGF5ZXIgb2JqZWN0c1xuICBwbGF5ZXJzLnAxID0gcGxheWVyRmFjdG9yeSgxLCB0cnVlKTtcbiAgcGxheWVycy5jb20gPSBwbGF5ZXJGYWN0b3J5KDIsIGZhbHNlKTtcbiAgLy8gRGlzYWJsZSBjb21wdXRlciBldmVudHNcbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSk7XG4gIC8vIEVuYWJsZSBwbGF5ZXIgZXZlbnRzXG4gIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlLCAncGxheWVyJyk7XG4gIC8vIFN0YXJ0IHNoaXAgcGxhY2VtZW50XG5cbiAgLy8gRW5hYmxlIHN0YXJ0IGdhbWUgYnV0dG9uXG59O1xuXG5jb25zdCBzdGFydEdhbWUgPSAoKSA9PiB7XG4gIC8vIHBsYXllcnMucDEgPSBwbGF5ZXJGYWN0b3J5KDEsIHRydWUpO1xuICAvLyBwbGF5ZXJzLmNvbSA9IHBsYXllckZhY3RvcnkoMiwgZmFsc2UpO1xuXG4gIHBsYXllcnMuY29tLmJvYXJkLnBsYWNlU2hpcCgyLCBbMCwgMF0sICd4Jyk7XG4gIHBsYXllcnMucDEuYm9hcmQucGxhY2VTaGlwKDksIFswLCAwXSwgJ3gnKTtcblxuICBkb20udXBkYXRlQm9hcmQocGxheWVycy5wMSk7XG4gIGRvbS51cGRhdGVCb2FyZChwbGF5ZXJzLmNvbSk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlKTtcbiAgZG9tLnJlbmRlclNoaXBzKHBsYXllcnMucDEpO1xufTtcblxuY29uc3QgZW5kR2FtZSA9ICh3aW5uZXIpID0+IHtcbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSk7XG4gIGRvbS5hbm5vdW5jZUdhbWVPdmVyKHdpbm5lcik7XG59O1xuXG5jb25zdCBwbGF5Q29tTW92ZSA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBjb25zdCByYW5kb21Nb3ZlID0gYXdhaXQgaGVscGVycy5nZXRSYW5kb21Nb3ZlKGNvbSk7XG5cbiAgY29tLm1ha2VNb3ZlKHJhbmRvbU1vdmUsIHAxLmJvYXJkKTtcbiAgZG9tLnVwZGF0ZUJvYXJkKHAxKTtcblxuICBjb25zdCB3aW5TdGF0ZSA9IGNoZWNrR2FtZVN0YXRlKHAxKTtcbiAgaWYgKHdpblN0YXRlKSB7XG4gICAgZW5kR2FtZShjb20pO1xuICB9IGVsc2Uge1xuICAgIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlKTtcbiAgfVxufTtcblxuY29uc3QgcmVjZWl2ZVBsYXllck1vdmUgPSAoY29vcmQpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBpZiAoaGVscGVycy5hbHJlYWR5UGxheWVkKHAxLCBjb29yZCkpIHJldHVybjtcbiAgcDEubWFrZU1vdmUoY29vcmQsIGNvbS5ib2FyZCk7XG4gIGRvbS51cGRhdGVCb2FyZChjb20pO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUoY29tKTtcbiAgaWYgKHdpblN0YXRlKSB7XG4gICAgZW5kR2FtZShwMSk7XG4gIH0gZWxzZSB7XG4gICAgcGxheUNvbU1vdmUocDEsIGNvbSk7XG4gIH1cbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSk7XG59O1xuXG5jb25zdCBnZXROZXh0U2hpcCA9ICgpID0+IHtcbiAgY29uc3Qgc2hpcHNQbGFjZWQgPSBwbGF5ZXJzLnAxLmJvYXJkLnNoaXBzLmxlbmd0aDtcbiAgcmV0dXJuIGhlbHBlcnMubmV4dFNoaXBMZW5ndGgoc2hpcHNQbGFjZWQpO1xufTtcblxuY29uc3QgcGxhY2VTaGlwID0gKGUpID0+IHtcbiAgY29uc3QgeyBwMSB9ID0gcGxheWVycztcbiAgaWYgKHAxLmJvYXJkLnNoaXBzLmxlbmd0aCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gIGNvbnN0IHRhcmdldCA9IGhlbHBlcnMuZ2V0Q2VsbEluZm8oZS50YXJnZXQpO1xuICBjb25zdCBsZW5ndGggPSBnZXROZXh0U2hpcCgpO1xuICBjb25zdCBheGlzID0gc2hpcFBsYWNlbWVudC5nZXRBeGlzKCk7XG5cbiAgcDEuYm9hcmQucGxhY2VTaGlwKGxlbmd0aCwgdGFyZ2V0LCBheGlzKTtcbiAgZG9tLnJlbmRlclNoaXBzKHAxKTtcbn07XG5cbmV4cG9ydCB7IG5ld0dhbWUsIHN0YXJ0R2FtZSwgcmVjZWl2ZVBsYXllck1vdmUsIHBsYWNlU2hpcCwgZ2V0TmV4dFNoaXAgfTtcbiIsImltcG9ydCBzaGlwRmFjdG9yeSBmcm9tICcuL3NoaXBGYWN0b3J5JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2FtZWJvYXJkRmFjdG9yeSgpIHtcbiAgY29uc3QgY3JlYXRlQm9hcmQgPSAoKSA9PiB7XG4gICAgY29uc3QgZ2FtZWJvYXJkID0gbmV3IEFycmF5KDEwKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIGdhbWVib2FyZFtpXSA9IHt9O1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIGdhbWVib2FyZFtpXVtqXSA9IHtcbiAgICAgICAgICBoaXQ6IGZhbHNlLFxuICAgICAgICAgIHNoaXBJZDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdhbWVib2FyZDtcbiAgfTtcbiAgLy8gY29uc3QgbWlzc2VzID0gW107XG4gIGNvbnN0IHRpbGVzID0gY3JlYXRlQm9hcmQoKTtcblxuICBjb25zdCBzaGlwcyA9IFtdO1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IChsZW5ndGgsIFt4LCB5XSwgYXhpcykgPT4ge1xuICAgIGNvbnN0IG5ld1NoaXAgPSBzaGlwRmFjdG9yeShzaGlwcy5sZW5ndGgsIGxlbmd0aCk7XG4gICAgc2hpcHMucHVzaChuZXdTaGlwKTtcbiAgICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgICAvLyBQbGFjZSBob3Jpem9udGFsbHlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBuZXdTaGlwLmNvb3Jkcy5wdXNoKFt4LCB5XSk7XG4gICAgICAgIHRpbGVzW3hdW3ldLnNoaXBJZCA9IG5ld1NoaXAuaWQ7XG4gICAgICAgIHggKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgICAgLy8gUGxhY2UgdmVydGljYWxseVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5ld1NoaXAuY29vcmRzLnB1c2goW3gsIHldKTtcbiAgICAgICAgdGlsZXNbeF1beV0uc2hpcElkID0gbmV3U2hpcC5pZDtcbiAgICAgICAgeSArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgaGFzU2hpcCA9ICh0aWxlKSA9PiB0aWxlLnNoaXBJZCAhPT0gbnVsbDtcblxuICBjb25zdCBmaW5kU2hpcCA9IChpZCkgPT4ge1xuICAgIGxldCB0aGlzU2hpcDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2hpcHNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgIHRoaXNTaGlwID0gc2hpcHNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzU2hpcDtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKHRhcmdldCkgPT4ge1xuICAgIGNvbnN0IFt4LCB5XSA9IHRhcmdldDtcbiAgICBjb25zdCB0aGlzVGlsZSA9IHRpbGVzW3hdW3ldO1xuICAgIGlmICh0aGlzVGlsZS5oaXQpIHJldHVybjtcblxuICAgIC8vIGlmICghaGFzU2hpcCh0aGlzVGlsZSkpIHtcbiAgICAvLyAgIG1pc3Nlcy5wdXNoKHRhcmdldCk7XG4gICAgLy8gfVxuICAgIGlmIChoYXNTaGlwKHRoaXNUaWxlKSkge1xuICAgICAgY29uc3QgdGhpc1NoaXAgPSBmaW5kU2hpcCh0aGlzVGlsZS5zaGlwSWQpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzU2hpcC5jb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXNTaGlwLmNvb3Jkc1tpXS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZSA9PT0gdGFyZ2V0W2luZGV4XSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpc1NoaXAuaGVhbHRoW2ldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzVGlsZS5oaXQgPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHNoaXBzUmVtYWluaW5nID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpbHRlclNoaXBzID0gc2hpcHMuZmlsdGVyKChzaGlwKSA9PiBzaGlwLmlzU3VuaygpID09PSBmYWxzZSk7XG4gICAgcmV0dXJuIGZpbHRlclNoaXBzLmxlbmd0aDtcbiAgfTtcblxuICBjb25zdCBhbGxTaGlwc1N1bmsgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3Vua1NoaXBzID0gc2hpcHNSZW1haW5pbmcoKTtcbiAgICByZXR1cm4gc3Vua1NoaXBzID09PSAwO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdGlsZXMsXG4gICAgc2hpcHMsXG4gICAgcGxhY2VTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgc2hpcHNSZW1haW5pbmcsXG4gICAgYWxsU2hpcHNTdW5rLFxuICB9O1xufVxuIiwiY29uc3QgZ2V0Q2VsbEluZm8gPSAodGFyZ2V0KSA9PiB7XG4gIHJldHVybiBbTnVtYmVyKHRhcmdldC5kYXRhc2V0LngpLCBOdW1iZXIodGFyZ2V0LmRhdGFzZXQueSldO1xufTtcblxuY29uc3QgYWxyZWFkeVBsYXllZCA9IChwbGF5ZXIsIHRhcmdldCkgPT4ge1xuICBjb25zdCBwcmV2aW91c01vdmVzID0gcGxheWVyLm1vdmVzO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzTW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocHJldmlvdXNNb3Zlc1tpXS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZSA9PT0gdGFyZ2V0W2luZGV4XSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCB0aW1lb3V0ID0gKG1zKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpO1xuICB9KTtcbn07XG5cbmNvbnN0IGdlbmVyYXRlUmFuZG9tID0gKCkgPT4ge1xuICBjb25zdCByYW5kb20gPSBbXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLFxuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgXTtcbiAgcmV0dXJuIHJhbmRvbTtcbn07XG5cbmNvbnN0IGdldFJhbmRvbU1vdmUgPSBhc3luYyAocGxheWVyKSA9PiB7XG4gIGxldCByYW5kb21Nb3ZlID0gZ2VuZXJhdGVSYW5kb20oKTtcbiAgd2hpbGUgKGFscmVhZHlQbGF5ZWQocGxheWVyLCByYW5kb21Nb3ZlKSkge1xuICAgIHJhbmRvbU1vdmUgPSBnZW5lcmF0ZVJhbmRvbSgpO1xuICB9XG4gIGF3YWl0IHRpbWVvdXQoNDAwKTtcbiAgcmV0dXJuIHJhbmRvbU1vdmU7XG59O1xuXG4vLyBjb25zdCBnZXRUdXJuID0gKG9iaikgPT4ge1xuLy8gICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbi8vICAgICBjb25zdCBwbGF5ZXIgPSBvYmpba2V5c1tpXV07XG4vLyAgICAgaWYgKHBsYXllci50dXJuID09PSBmYWxzZSkge1xuLy8gICAgICAgcmV0dXJuIHBsYXllclxuLy8gICAgIH1cbi8vICAgfVxuLy8gfTtcblxuY29uc3QgbmV4dFNoaXBMZW5ndGggPSAobnVtU2hpcHNQbGFjZWQpID0+IHtcbiAgc3dpdGNoIChudW1TaGlwc1BsYWNlZCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiA1O1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiA0O1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiAzO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiAyO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuZXhwb3J0IHsgZ2V0Q2VsbEluZm8sIGFscmVhZHlQbGF5ZWQsIGdldFJhbmRvbU1vdmUsIG5leHRTaGlwTGVuZ3RoIH07XG4iLCJpbXBvcnQgZ2FtZWJvYXJkRmFjdG9yeSBmcm9tICcuL2dhbWVib2FyZEZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbGF5ZXJGYWN0b3J5KG51bSwgaHVtYW4pIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZWJvYXJkRmFjdG9yeSgpO1xuICBjb25zdCBtb3ZlcyA9IFtdO1xuICBjb25zdCBtYWtlTW92ZSA9ICh0YXJnZXQsIGVuZW15Qm9hcmQpID0+IHtcbiAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2sodGFyZ2V0KTtcbiAgICBtb3Zlcy5wdXNoKHRhcmdldCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgbnVtKCkge1xuICAgICAgcmV0dXJuIG51bTtcbiAgICB9LFxuICAgIGdldCBib2FyZCgpIHtcbiAgICAgIHJldHVybiBnYW1lYm9hcmQ7XG4gICAgfSxcbiAgICBnZXQgaXNIdW1hbigpIHtcbiAgICAgIHJldHVybiBodW1hbjtcbiAgICB9LFxuICAgIC8vIGdldCB0dXJuKCkge1xuICAgIC8vICAgcmV0dXJuIHR1cm47XG4gICAgLy8gfSxcbiAgICBnZXQgbW92ZXMoKSB7XG4gICAgICByZXR1cm4gbW92ZXM7XG4gICAgfSxcbiAgICBtYWtlTW92ZSxcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNoaXBGYWN0b3J5KGlkLCBsZW5ndGgpIHtcbiAgY29uc3QgY3JlYXRlSGVhbHRoID0gKHNpemUpID0+IHtcbiAgICBjb25zdCBhcnJheSA9IFsuLi5BcnJheShzaXplKS5rZXlzKCldO1xuICAgIGNvbnN0IGhlYWx0aCA9IGFycmF5LnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgcHJldltjdXJyXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwge30pO1xuICAgIHJldHVybiBoZWFsdGg7XG4gIH07XG5cbiAgY29uc3QgY29vcmRzID0gW107XG5cbiAgY29uc3QgaGVhbHRoID0gY3JlYXRlSGVhbHRoKGxlbmd0aCk7XG4gIC8vIGhlYWx0aCA9IHsgd2hlcmUgYm9vbCByZXByZXNlbnRzIGhpdC9ubyBoaXRcbiAgLy8gICAwOiBmYWxzZSxcbiAgLy8gICAxOiBmYWxzZSxcbiAgLy8gICAyOiBmYWxzZSxcbiAgLy8gfVxuICBjb25zdCBoaXQgPSAoaW5kZXgpID0+IHtcbiAgICBoZWFsdGhbaW5kZXhdID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoaGVhbHRoKS5ldmVyeSgoaW5kZXgpID0+IGluZGV4ID09PSB0cnVlKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIGxlbmd0aCxcbiAgICBoZWFsdGgsXG4gICAgY29vcmRzLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gIH07XG59XG4iLCJpbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5cbmNvbnN0IGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXllci1ib2FyZCcpO1xuXG5jb25zdCBheGVzID0ge1xuICB4OiB0cnVlLFxuICB5OiBmYWxzZSxcbn07XG5cbmNvbnN0IGdldEF4aXMgPSAoKSA9PiB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhheGVzKTtcbiAgcmV0dXJuIGtleXMuZmlsdGVyKChrZXkpID0+IGF4ZXNba2V5XSA9PT0gdHJ1ZSlbMF07XG59O1xuXG5jb25zdCBzd2l0Y2hBeGlzID0gKCkgPT4ge1xuICBheGVzLnggPSAhYXhlcy54O1xuICBheGVzLnkgPSAhYXhlcy54O1xufTtcblxuY29uc3QgaXNXaXRoaW5Cb3VuZHMgPSAoY2VsbHMsIGxlbmd0aCkgPT4ge1xuICByZXR1cm4gY2VsbHMubGVuZ3RoID09PSBsZW5ndGg7XG59O1xuXG5jb25zdCBwcmV2aWV3U2hpcCA9IChlLCBsZW5ndGgpID0+IHtcbiAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYm9hcmQnKSB8fCBsZW5ndGggPT09IG51bGwpIHJldHVybjtcblxuICBjb25zdCBbeCwgeV0gPSBoZWxwZXJzLmdldENlbGxJbmZvKGUudGFyZ2V0KTtcbiAgY29uc3Qgc2hpcENvb3JkcyA9IFtdO1xuICBjb25zdCBheGlzID0gZ2V0QXhpcygpO1xuXG4gIGlmIChheGlzID09PSAneCcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyA+OSA9IG91dCBvZiBib3VuZHNcbiAgICAgIGlmIChpICsgeCA+IDkpIGJyZWFrO1xuXG4gICAgICBjb25zdCBuZXh0Q2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS14PScke2kgKyB4fSddW2RhdGEteT0nJHt5fSddYFxuICAgICAgKTtcbiAgICAgIHNoaXBDb29yZHMucHVzaChuZXh0Q2VsbCk7XG4gICAgfVxuICB9XG4gIGlmIChheGlzID09PSAneScpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyA+OSA9IG91dCBvZiBib3VuZHNcbiAgICAgIGlmIChpICsgeSA+IDkpIGJyZWFrO1xuXG4gICAgICBjb25zdCBuZXh0Q2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS14PScke3h9J11bZGF0YS15PScke2kgKyB5fSddYFxuICAgICAgKTtcbiAgICAgIHNoaXBDb29yZHMucHVzaChuZXh0Q2VsbCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGlzV2l0aGluQm91bmRzKHNoaXBDb29yZHMsIGxlbmd0aCkpIHtcbiAgICBzaGlwQ29vcmRzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcC1wcmV2aWV3JykpO1xuICB9IGVsc2Uge1xuICAgIHNoaXBDb29yZHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJykpO1xuICB9XG59O1xuXG5jb25zdCBjbGVhclByZXZpZXcgPSAoKSA9PiB7XG4gIGNvbnN0IGNlbGxzID0gYm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwLXByZXZpZXcnLCAnaW52YWxpZCcpKTtcbn07XG5cbmV4cG9ydCB7IGlzV2l0aGluQm91bmRzLCBnZXRBeGlzLCBzd2l0Y2hBeGlzLCBwcmV2aWV3U2hpcCwgY2xlYXJQcmV2aWV3IH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9zdHlsZS5jc3MnO1xuaW1wb3J0ICogYXMgZ2FtZSBmcm9tICcuL21vZHVsZXMvZ2FtZSdcbmltcG9ydCAqIGFzIGRvbSBmcm9tICcuL21vZHVsZXMvZG9tJztcbmltcG9ydCAqIGFzIGV2ZW50Q29udHJvbGxlciBmcm9tICcuL21vZHVsZXMvZXZlbnRDb250cm9sbGVyJ1xuXG5kb20uY3JlYXRlQm9hcmRzKCk7XG5nYW1lLm5ld0dhbWUoKTtcblxuZXZlbnRDb250cm9sbGVyLmluaXRCb2FyZEV2ZW50cygpO1xuZXZlbnRDb250cm9sbGVyLmluaXRHYW1lQnV0dG9ucygpO1xuZXZlbnRDb250cm9sbGVyLmluaXRTaGlwUGxhY2VtZW50KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9