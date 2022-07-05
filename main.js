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
      _game__WEBPACK_IMPORTED_MODULE_0__.receiveMove(coord);
    });
  });
};

const initGameButtons = () => {
  // const restartBtn = document.querySelector('#restart-btn');
  // restartBtn.addEventListener('click', game.newGame);
};

const initShipPlacement = () => {
  const playerBoard = document.querySelector('#player-board');

  // mouseover => renderPreview
  // mouseout => clearPreview
  // click => placeShip -- valid??
  playerBoard.addEventListener('mouseover', _shipPlacement__WEBPACK_IMPORTED_MODULE_2__.previewShip);
};




/***/ }),

/***/ "./src/modules/game.js":
/*!*****************************!*\
  !*** ./src/modules/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "newGame": () => (/* binding */ newGame),
/* harmony export */   "players": () => (/* binding */ players),
/* harmony export */   "receiveMove": () => (/* binding */ receiveMove),
/* harmony export */   "startGame": () => (/* binding */ startGame)
/* harmony export */ });
/* harmony import */ var _playerFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./playerFactory */ "./src/modules/playerFactory.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/modules/dom.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./src/modules/helpers.js");




const players = {
  p1: null,
  com: null,
};

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
  
}

const startGame = () => {
  // players.p1 = playerFactory(1, true);
  // players.com = playerFactory(2, false);

  players.com.board.placeShip(2, [0, 0], 'x');
  players.p1.board.placeShip(9, [0, 0], 'x');

  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(players.p1)
  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(players.com)
  _dom__WEBPACK_IMPORTED_MODULE_1__.disableEvents(false);
  _dom__WEBPACK_IMPORTED_MODULE_1__.renderShips(players.p1);
};

const checkGameState = (player) => player.board.allShipsSunk();

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

const receiveMove = (coord) => {
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
/* harmony export */   "getRandomMove": () => (/* binding */ getRandomMove)
/* harmony export */ });
const getCellInfo = (targetCell) => {
  return [Number(targetCell.dataset.x), Number(targetCell.dataset.y)];
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
/* harmony export */   "previewShip": () => (/* binding */ previewShip)
/* harmony export */ });
const board = document.querySelector('#player-board');

const isWithinBounds = (cells, length) => {
  return cells.length === length;
};

const previewShip = (e, orientation = 'y', length = 5) => {
  if (e.target.classList.contains('board')) return;

  const { target } = e;
  const [x, y] = [Number(target.dataset.x), Number(target.dataset.y)];
  const shipCoords = [];

  if (orientation === 'x') {
    for (let i = 0; i < length; i++) {
      // >9 = out of bounds
      if (i + x > 9) break;

      const nextCell = board.querySelector(
        `[data-x='${i + x}'][data-y='${y}']`
      );
      shipCoords.push(nextCell);
    }
  }
  if (orientation === 'y') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbENBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFVBQVUsU0FBUztBQUNuQjtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixNQUFNLGFBQWEsRUFBRTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixFQUFFLGFBQWEsTUFBTTtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUN1Qjs7Ozs7OztVQzFDdkI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ05xQjtBQUNpQjtBQUNEO0FBQ3VCOztBQUU1RCxzREFBZ0I7QUFDaEIsa0RBQVk7O0FBRVoscUVBQStCO0FBQy9CLHFFQUErQjtBQUMvQix1RUFBaUMsRyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2V2ZW50Q29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvaGVscGVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXBQbGFjZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiY29uc3QgZ2FtZWJvYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZCcpO1xuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyLWJvYXJkJyk7XG5jb25zdCBjb21wQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29tcC1ib2FyZCcpO1xuY29uc3QgZ2FtZUluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ2FtZS1pbmZvJyk7XG5cbmNvbnN0IHVwZGF0ZVNoaXBDb3VudCA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbXBCb2FyZDtcbiAgY29uc3Qgc2hpcENvdW50ZXIgPSB0aGlzQm9hcmQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgY29uc3Qgc2hpcHNSZW1haW5pbmcgPSBwbGF5ZXIuYm9hcmQuc2hpcHNSZW1haW5pbmcoKTtcblxuICBzaGlwQ291bnRlci50ZXh0Q29udGVudCA9IGBTaGlwcyByZW1haW5pbmc6ICR7c2hpcHNSZW1haW5pbmd9YDtcbn07XG5cbmNvbnN0IGNyZWF0ZUJvYXJkcyA9ICgpID0+IHtcbiAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGJvYXJkQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIGJvYXJkQ2VsbC5jbGFzc0xpc3QuYWRkKCdib2FyZC1jZWxsJyk7XG4gICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnggPSBqO1xuICAgICAgICBib2FyZENlbGwuZGF0YXNldC55ID0gaTtcbiAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRDZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuLy8gY29uc3QgY3JlYXRlQm9hcmQgPSAoLi4ucGxheWVycykgPT4ge1xuLy8gICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuLy8gICAgIHVwZGF0ZVNoaXBDb3VudChwbGF5ZXIpO1xuLy8gICAgIGNvbnN0IHRoaXNCb2FyZCA9IHBsYXllci5pc0h1bWFuID8gcGxheWVyQm9hcmQgOiBjb21wQm9hcmQ7XG4vLyAgICAgY29uc3QgeyB0aWxlcyB9ID0gcGxheWVyLmJvYXJkO1xuLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbi8vICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgT2JqZWN0LmtleXModGlsZXNbaV0pLmxlbmd0aDsgaisrKSB7XG4vLyAgICAgICAgIGNvbnN0IGJvYXJkQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuLy8gICAgICAgICBib2FyZENlbGwuY2xhc3NMaXN0LmFkZCgnYm9hcmQtY2VsbCcpO1xuLy8gICAgICAgICBib2FyZENlbGwuZGF0YXNldC54ID0gajtcbi8vICAgICAgICAgYm9hcmRDZWxsLmRhdGFzZXQueSA9IGk7XG4vLyAgICAgICAgIHRoaXNCb2FyZC5hcHBlbmRDaGlsZChib2FyZENlbGwpO1xuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgfSk7XG4vLyB9O1xuXG5jb25zdCByZW5kZXJTaGlwcyA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgeyBzaGlwcyB9ID0gcGxheWVyLmJvYXJkO1xuICBjb25zdCBjb29yZHMgPSBzaGlwcy5tYXAoKHNoaXApID0+IHNoaXAuY29vcmRzKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29vcmRzW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBbY29vcmRzW2ldW2pdWzBdLCBjb29yZHNbaV1bal1bMV1dO1xuICAgICAgY29uc3QgdGhpc0NlbGwgPSBwbGF5ZXJCb2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEteD0nJHt4fSddW2RhdGEteT0nJHt5fSddYFxuICAgICAgKTtcbiAgICAgIHRoaXNDZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHVwZGF0ZUJvYXJkID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB0aGlzQm9hcmQgPSBwbGF5ZXIuaXNIdW1hbiA/IHBsYXllckJvYXJkIDogY29tcEJvYXJkO1xuICBjb25zdCB7IHRpbGVzIH0gPSBwbGF5ZXIuYm9hcmQ7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgT2JqZWN0LmtleXModGlsZXNbaV0pLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB0aGlzVGlsZSA9IHRpbGVzW2ldW2pdO1xuICAgICAgY29uc3QgaGFzU2hpcCA9IHRoaXNUaWxlLnNoaXBJZCAhPT0gbnVsbDtcbiAgICAgIGlmICh0aGlzVGlsZS5oaXQpIHtcbiAgICAgICAgY29uc3QgdGhpc0NlbGwgPSB0aGlzQm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgW2RhdGEteD0nJHtpfSddW2RhdGEteT0nJHtqfSddYFxuICAgICAgICApO1xuICAgICAgICBpZiAoaGFzU2hpcCkge1xuICAgICAgICAgIHRoaXNDZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXNDZWxsLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICB1cGRhdGVTaGlwQ291bnQocGxheWVyKTtcbn07XG5cbmNvbnN0IGNsZWFyVUkgPSAoKSA9PiB7XG4gIGdhbWVib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IHtcbiAgICBjb25zdCBjZWxscyA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdtaXNzJywgJ2hpdCcsICdzaGlwJyk7XG4gICAgfSk7XG4gIH0pO1xuICAvLyBnYW1lIG92ZXIgcmVzZXRcbn07XG5cbmNvbnN0IGFubm91bmNlR2FtZU92ZXIgPSAod2lubmVyKSA9PiB7XG4gIGNvbnN0IHdpbk1lc3NhZ2UgPVxuICAgIHdpbm5lci5udW0gPT09IDFcbiAgICAgID8gJ0NvbmdyYXR1bGF0aW9ucyEgWW91IHdpbiEnXG4gICAgICA6ICdHYW1lIG92ZXIgLi4uIENvbXB1dGVyIHdpbnMhJztcblxuICBnYW1lYm9hcmRzLmZvckVhY2goKGJvYXJkKSA9PiBib2FyZC5jbGFzc0xpc3QuYWRkKCdnYW1lLW92ZXInKSk7XG4gIGdhbWVJbmZvLnRleHRDb250ZW50ID0gd2luTWVzc2FnZTtcbn07XG5cbmNvbnN0IGRpc2FibGVFdmVudHMgPSAoYm9vbCwgYm9hcmQgPSAnY29tcCcpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gKGJvYXJkID09PSAnY29tcCcpID8gY29tcEJvYXJkIDogcGxheWVyQm9hcmRcbiAgaWYgKGJvb2wpIHtcbiAgICB0aGlzQm9hcmQuY2xhc3NMaXN0LmFkZCgnbm8tZXZlbnRzJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpc0JvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ25vLWV2ZW50cycpO1xuICB9XG59O1xuXG5leHBvcnQge1xuICBjcmVhdGVCb2FyZHMsXG4gIGNsZWFyVUksXG4gIHJlbmRlclNoaXBzLFxuICB1cGRhdGVCb2FyZCxcbiAgZGlzYWJsZUV2ZW50cyxcbiAgYW5ub3VuY2VHYW1lT3Zlcixcbn07XG4iLCJpbXBvcnQgKiBhcyBnYW1lIGZyb20gJy4vZ2FtZSc7XG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgKiBhcyBzaGlwUGxhY2VtZW50IGZyb20gJy4vc2hpcFBsYWNlbWVudCc7XG5cbmNvbnN0IGluaXRCb2FyZEV2ZW50cyA9ICgpID0+IHtcbiAgY29uc3QgY29tcENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2NvbXAtYm9hcmQgLmJvYXJkLWNlbGwnKTtcbiAgY29tcENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaGVscGVycy5nZXRDZWxsSW5mbyhlLnRhcmdldCk7XG4gICAgICBnYW1lLnJlY2VpdmVNb3ZlKGNvb3JkKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5jb25zdCBpbml0R2FtZUJ1dHRvbnMgPSAoKSA9PiB7XG4gIC8vIGNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzdGFydC1idG4nKTtcbiAgLy8gcmVzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUubmV3R2FtZSk7XG59O1xuXG5jb25zdCBpbml0U2hpcFBsYWNlbWVudCA9ICgpID0+IHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyLWJvYXJkJyk7XG5cbiAgLy8gbW91c2VvdmVyID0+IHJlbmRlclByZXZpZXdcbiAgLy8gbW91c2VvdXQgPT4gY2xlYXJQcmV2aWV3XG4gIC8vIGNsaWNrID0+IHBsYWNlU2hpcCAtLSB2YWxpZD8/XG4gIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHNoaXBQbGFjZW1lbnQucHJldmlld1NoaXApO1xufTtcblxuZXhwb3J0IHsgaW5pdEJvYXJkRXZlbnRzLCBpbml0R2FtZUJ1dHRvbnMsIGluaXRTaGlwUGxhY2VtZW50IH07XG4iLCJpbXBvcnQgcGxheWVyRmFjdG9yeSBmcm9tICcuL3BsYXllckZhY3RvcnknO1xuaW1wb3J0ICogYXMgZG9tIGZyb20gJy4vZG9tJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcblxuY29uc3QgcGxheWVycyA9IHtcbiAgcDE6IG51bGwsXG4gIGNvbTogbnVsbCxcbn07XG5cbmNvbnN0IG5ld0dhbWUgPSAoKSA9PiB7XG4gIC8vIENsZWFuIHVwIGJvYXJkXG4gIGRvbS5jbGVhclVJKCk7XG4gIC8vIENyZWF0ZSBuZXcgcGxheWVyIG9iamVjdHNcbiAgcGxheWVycy5wMSA9IHBsYXllckZhY3RvcnkoMSwgdHJ1ZSk7XG4gIHBsYXllcnMuY29tID0gcGxheWVyRmFjdG9yeSgyLCBmYWxzZSk7XG4gIC8vIERpc2FibGUgY29tcHV0ZXIgZXZlbnRzXG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUpO1xuICAvLyBFbmFibGUgcGxheWVyIGV2ZW50c1xuICBkb20uZGlzYWJsZUV2ZW50cyhmYWxzZSwgJ3BsYXllcicpO1xuICAvLyBTdGFydCBzaGlwIHBsYWNlbWVudFxuICBcbiAgLy8gRW5hYmxlIHN0YXJ0IGdhbWUgYnV0dG9uXG4gIFxufVxuXG5jb25zdCBzdGFydEdhbWUgPSAoKSA9PiB7XG4gIC8vIHBsYXllcnMucDEgPSBwbGF5ZXJGYWN0b3J5KDEsIHRydWUpO1xuICAvLyBwbGF5ZXJzLmNvbSA9IHBsYXllckZhY3RvcnkoMiwgZmFsc2UpO1xuXG4gIHBsYXllcnMuY29tLmJvYXJkLnBsYWNlU2hpcCgyLCBbMCwgMF0sICd4Jyk7XG4gIHBsYXllcnMucDEuYm9hcmQucGxhY2VTaGlwKDksIFswLCAwXSwgJ3gnKTtcblxuICBkb20udXBkYXRlQm9hcmQocGxheWVycy5wMSlcbiAgZG9tLnVwZGF0ZUJvYXJkKHBsYXllcnMuY29tKVxuICBkb20uZGlzYWJsZUV2ZW50cyhmYWxzZSk7XG4gIGRvbS5yZW5kZXJTaGlwcyhwbGF5ZXJzLnAxKTtcbn07XG5cbmNvbnN0IGNoZWNrR2FtZVN0YXRlID0gKHBsYXllcikgPT4gcGxheWVyLmJvYXJkLmFsbFNoaXBzU3VuaygpO1xuXG5jb25zdCBlbmRHYW1lID0gKHdpbm5lcikgPT4ge1xuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlKTtcbiAgZG9tLmFubm91bmNlR2FtZU92ZXIod2lubmVyKTtcbn07XG5cbmNvbnN0IHBsYXlDb21Nb3ZlID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCB7IHAxLCBjb20gfSA9IHBsYXllcnM7XG4gIGNvbnN0IHJhbmRvbU1vdmUgPSBhd2FpdCBoZWxwZXJzLmdldFJhbmRvbU1vdmUoY29tKTtcbiAgXG4gIGNvbS5tYWtlTW92ZShyYW5kb21Nb3ZlLCBwMS5ib2FyZCk7XG4gIGRvbS51cGRhdGVCb2FyZChwMSk7XG5cbiAgY29uc3Qgd2luU3RhdGUgPSBjaGVja0dhbWVTdGF0ZShwMSk7XG4gIGlmICh3aW5TdGF0ZSkge1xuICAgIGVuZEdhbWUoY29tKTtcbiAgfSBlbHNlIHtcbiAgICBkb20uZGlzYWJsZUV2ZW50cyhmYWxzZSk7XG4gIH1cbn07XG5cbmNvbnN0IHJlY2VpdmVNb3ZlID0gKGNvb3JkKSA9PiB7XG4gIGNvbnN0IHsgcDEsIGNvbSB9ID0gcGxheWVycztcbiAgaWYgKGhlbHBlcnMuYWxyZWFkeVBsYXllZChwMSwgY29vcmQpKSByZXR1cm47XG4gIHAxLm1ha2VNb3ZlKGNvb3JkLCBjb20uYm9hcmQpO1xuICBkb20udXBkYXRlQm9hcmQoY29tKTtcblxuICBjb25zdCB3aW5TdGF0ZSA9IGNoZWNrR2FtZVN0YXRlKGNvbSk7XG4gIGlmICh3aW5TdGF0ZSkge1xuICAgIGVuZEdhbWUocDEpO1xuICB9IGVsc2Uge1xuICAgIHBsYXlDb21Nb3ZlKHAxLCBjb20pO1xuICB9XG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUpO1xufTtcblxuZXhwb3J0IHsgcGxheWVycywgbmV3R2FtZSwgc3RhcnRHYW1lLCByZWNlaXZlTW92ZSB9O1xuIiwiaW1wb3J0IHNoaXBGYWN0b3J5IGZyb20gJy4vc2hpcEZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnYW1lYm9hcmRGYWN0b3J5KCkge1xuICBjb25zdCBjcmVhdGVCb2FyZCA9ICgpID0+IHtcbiAgICBjb25zdCBnYW1lYm9hcmQgPSBuZXcgQXJyYXkoMTApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZ2FtZWJvYXJkW2ldID0ge307XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgZ2FtZWJvYXJkW2ldW2pdID0ge1xuICAgICAgICAgIGhpdDogZmFsc2UsXG4gICAgICAgICAgc2hpcElkOiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2FtZWJvYXJkO1xuICB9O1xuICAvLyBjb25zdCBtaXNzZXMgPSBbXTtcbiAgY29uc3QgdGlsZXMgPSBjcmVhdGVCb2FyZCgpO1xuXG4gIGNvbnN0IHNoaXBzID0gW107XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKGxlbmd0aCwgW3gsIHldLCBheGlzKSA9PiB7XG4gICAgY29uc3QgbmV3U2hpcCA9IHNoaXBGYWN0b3J5KHNoaXBzLmxlbmd0aCwgbGVuZ3RoKTtcbiAgICBzaGlwcy5wdXNoKG5ld1NoaXApO1xuICAgIGlmIChheGlzID09PSAneCcpIHtcbiAgICAgIC8vIFBsYWNlIGhvcml6b250YWxseVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5ld1NoaXAuY29vcmRzLnB1c2goW3gsIHldKTtcbiAgICAgICAgdGlsZXNbeF1beV0uc2hpcElkID0gbmV3U2hpcC5pZDtcbiAgICAgICAgeCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXhpcyA9PT0gJ3knKSB7XG4gICAgICAvLyBQbGFjZSB2ZXJ0aWNhbGx5XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1NoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmV3U2hpcC5jb29yZHMucHVzaChbeCwgeV0pO1xuICAgICAgICB0aWxlc1t4XVt5XS5zaGlwSWQgPSBuZXdTaGlwLmlkO1xuICAgICAgICB5ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBoYXNTaGlwID0gKHRpbGUpID0+IHRpbGUuc2hpcElkICE9PSBudWxsO1xuXG4gIGNvbnN0IGZpbmRTaGlwID0gKGlkKSA9PiB7XG4gICAgbGV0IHRoaXNTaGlwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzaGlwc1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgdGhpc1NoaXAgPSBzaGlwc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNTaGlwO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAodGFyZ2V0KSA9PiB7XG4gICAgY29uc3QgW3gsIHldID0gdGFyZ2V0O1xuICAgIGNvbnN0IHRoaXNUaWxlID0gdGlsZXNbeF1beV07XG4gICAgaWYgKHRoaXNUaWxlLmhpdCkgcmV0dXJuO1xuXG4gICAgLy8gaWYgKCFoYXNTaGlwKHRoaXNUaWxlKSkge1xuICAgIC8vICAgbWlzc2VzLnB1c2godGFyZ2V0KTtcbiAgICAvLyB9XG4gICAgaWYgKGhhc1NoaXAodGhpc1RpbGUpKSB7XG4gICAgICBjb25zdCB0aGlzU2hpcCA9IGZpbmRTaGlwKHRoaXNUaWxlLnNoaXBJZCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXNTaGlwLmNvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpc1NoaXAuY29vcmRzW2ldLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSB0YXJnZXRbaW5kZXhdKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzU2hpcC5oZWFsdGhbaV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXNUaWxlLmhpdCA9IHRydWU7XG4gIH07XG5cbiAgY29uc3Qgc2hpcHNSZW1haW5pbmcgPSAoKSA9PiB7XG4gICAgY29uc3QgZmlsdGVyU2hpcHMgPSBzaGlwcy5maWx0ZXIoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkgPT09IGZhbHNlKTtcbiAgICByZXR1cm4gZmlsdGVyU2hpcHMubGVuZ3RoO1xuICB9O1xuXG4gIGNvbnN0IGFsbFNoaXBzU3VuayA9ICgpID0+IHtcbiAgICBjb25zdCBzdW5rU2hpcHMgPSBzaGlwc1JlbWFpbmluZygpO1xuICAgIHJldHVybiBzdW5rU2hpcHMgPT09IDA7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB0aWxlcyxcbiAgICBzaGlwcyxcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBzaGlwc1JlbWFpbmluZyxcbiAgICBhbGxTaGlwc1N1bmssXG4gIH07XG59XG4iLCJjb25zdCBnZXRDZWxsSW5mbyA9ICh0YXJnZXRDZWxsKSA9PiB7XG4gIHJldHVybiBbTnVtYmVyKHRhcmdldENlbGwuZGF0YXNldC54KSwgTnVtYmVyKHRhcmdldENlbGwuZGF0YXNldC55KV07XG59O1xuXG5jb25zdCBhbHJlYWR5UGxheWVkID0gKHBsYXllciwgdGFyZ2V0KSA9PiB7XG4gIGNvbnN0IHByZXZpb3VzTW92ZXMgPSBwbGF5ZXIubW92ZXM7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNNb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwcmV2aW91c01vdmVzW2ldLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSB0YXJnZXRbaW5kZXhdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IHRpbWVvdXQgPSAobXMpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XG4gIH0pO1xufTtcblxuY29uc3QgZ2VuZXJhdGVSYW5kb20gPSAoKSA9PiB7XG4gIGNvbnN0IHJhbmRvbSA9IFtcbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLFxuICBdO1xuICByZXR1cm4gcmFuZG9tO1xufTtcblxuY29uc3QgZ2V0UmFuZG9tTW92ZSA9IGFzeW5jIChwbGF5ZXIpID0+IHtcbiAgbGV0IHJhbmRvbU1vdmUgPSBnZW5lcmF0ZVJhbmRvbSgpO1xuICB3aGlsZSAoYWxyZWFkeVBsYXllZChwbGF5ZXIsIHJhbmRvbU1vdmUpKSB7XG4gICAgcmFuZG9tTW92ZSA9IGdlbmVyYXRlUmFuZG9tKCk7XG4gIH1cbiAgYXdhaXQgdGltZW91dCg0MDApO1xuICByZXR1cm4gcmFuZG9tTW92ZTtcbn07XG5cbi8vIGNvbnN0IGdldFR1cm4gPSAob2JqKSA9PiB7XG4vLyAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuXG4vLyAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuLy8gICAgIGNvbnN0IHBsYXllciA9IG9ialtrZXlzW2ldXTtcbi8vICAgICBpZiAocGxheWVyLnR1cm4gPT09IGZhbHNlKSB7XG4vLyAgICAgICByZXR1cm4gcGxheWVyXG4vLyAgICAgfVxuLy8gICB9XG4vLyB9O1xuXG5leHBvcnQgeyBnZXRDZWxsSW5mbywgYWxyZWFkeVBsYXllZCwgZ2V0UmFuZG9tTW92ZSB9O1xuIiwiaW1wb3J0IGdhbWVib2FyZEZhY3RvcnkgZnJvbSAnLi9nYW1lYm9hcmRGYWN0b3J5JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGxheWVyRmFjdG9yeShudW0sIGh1bWFuKSB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IGdhbWVib2FyZEZhY3RvcnkoKTtcbiAgY29uc3QgbW92ZXMgPSBbXTtcbiAgY29uc3QgbWFrZU1vdmUgPSAodGFyZ2V0LCBlbmVteUJvYXJkKSA9PiB7XG4gICAgZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKHRhcmdldCk7XG4gICAgbW92ZXMucHVzaCh0YXJnZXQpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZ2V0IG51bSgpIHtcbiAgICAgIHJldHVybiBudW07XG4gICAgfSxcbiAgICBnZXQgYm9hcmQoKSB7XG4gICAgICByZXR1cm4gZ2FtZWJvYXJkO1xuICAgIH0sXG4gICAgZ2V0IGlzSHVtYW4oKSB7XG4gICAgICByZXR1cm4gaHVtYW47XG4gICAgfSxcbiAgICAvLyBnZXQgdHVybigpIHtcbiAgICAvLyAgIHJldHVybiB0dXJuO1xuICAgIC8vIH0sXG4gICAgZ2V0IG1vdmVzKCkge1xuICAgICAgcmV0dXJuIG1vdmVzO1xuICAgIH0sXG4gICAgbWFrZU1vdmUsXG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGlwRmFjdG9yeShpZCwgbGVuZ3RoKSB7XG4gIGNvbnN0IGNyZWF0ZUhlYWx0aCA9IChzaXplKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBbLi4uQXJyYXkoc2l6ZSkua2V5cygpXTtcbiAgICBjb25zdCBoZWFsdGggPSBhcnJheS5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgIHByZXZbY3Vycl0gPSBmYWxzZTtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gaGVhbHRoO1xuICB9O1xuXG4gIGNvbnN0IGNvb3JkcyA9IFtdO1xuXG4gIGNvbnN0IGhlYWx0aCA9IGNyZWF0ZUhlYWx0aChsZW5ndGgpO1xuICAvLyBoZWFsdGggPSB7IHdoZXJlIGJvb2wgcmVwcmVzZW50cyBoaXQvbm8gaGl0XG4gIC8vICAgMDogZmFsc2UsXG4gIC8vICAgMTogZmFsc2UsXG4gIC8vICAgMjogZmFsc2UsXG4gIC8vIH1cbiAgY29uc3QgaGl0ID0gKGluZGV4KSA9PiB7XG4gICAgaGVhbHRoW2luZGV4XSA9IHRydWU7XG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGhlYWx0aCkuZXZlcnkoKGluZGV4KSA9PiBpbmRleCA9PT0gdHJ1ZSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpZCxcbiAgICBsZW5ndGgsXG4gICAgaGVhbHRoLFxuICAgIGNvb3JkcyxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICB9O1xufVxuIiwiY29uc3QgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyLWJvYXJkJyk7XG5cbmNvbnN0IGlzV2l0aGluQm91bmRzID0gKGNlbGxzLCBsZW5ndGgpID0+IHtcbiAgcmV0dXJuIGNlbGxzLmxlbmd0aCA9PT0gbGVuZ3RoO1xufTtcblxuY29uc3QgcHJldmlld1NoaXAgPSAoZSwgb3JpZW50YXRpb24gPSAneScsIGxlbmd0aCA9IDUpID0+IHtcbiAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYm9hcmQnKSkgcmV0dXJuO1xuXG4gIGNvbnN0IHsgdGFyZ2V0IH0gPSBlO1xuICBjb25zdCBbeCwgeV0gPSBbTnVtYmVyKHRhcmdldC5kYXRhc2V0LngpLCBOdW1iZXIodGFyZ2V0LmRhdGFzZXQueSldO1xuICBjb25zdCBzaGlwQ29vcmRzID0gW107XG5cbiAgaWYgKG9yaWVudGF0aW9uID09PSAneCcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyA+OSA9IG91dCBvZiBib3VuZHNcbiAgICAgIGlmIChpICsgeCA+IDkpIGJyZWFrO1xuXG4gICAgICBjb25zdCBuZXh0Q2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS14PScke2kgKyB4fSddW2RhdGEteT0nJHt5fSddYFxuICAgICAgKTtcbiAgICAgIHNoaXBDb29yZHMucHVzaChuZXh0Q2VsbCk7XG4gICAgfVxuICB9XG4gIGlmIChvcmllbnRhdGlvbiA9PT0gJ3knKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgLy8gPjkgPSBvdXQgb2YgYm91bmRzXG4gICAgICBpZiAoaSArIHkgPiA5KSBicmVhaztcblxuICAgICAgY29uc3QgbmV4dENlbGwgPSBib2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEteD0nJHt4fSddW2RhdGEteT0nJHtpICsgeX0nXWBcbiAgICAgICk7XG4gICAgICBzaGlwQ29vcmRzLnB1c2gobmV4dENlbGwpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChpc1dpdGhpbkJvdW5kcyhzaGlwQ29vcmRzLCBsZW5ndGgpKSB7XG4gICAgc2hpcENvb3Jkcy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAtcHJldmlldycpKTtcbiAgfSBlbHNlIHtcbiAgICBzaGlwQ29vcmRzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgnaW52YWxpZCcpKTtcbiAgfVxufTtcbmV4cG9ydCB7IHByZXZpZXdTaGlwIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9zdHlsZS5jc3MnO1xuaW1wb3J0ICogYXMgZ2FtZSBmcm9tICcuL21vZHVsZXMvZ2FtZSdcbmltcG9ydCAqIGFzIGRvbSBmcm9tICcuL21vZHVsZXMvZG9tJztcbmltcG9ydCAqIGFzIGV2ZW50Q29udHJvbGxlciBmcm9tICcuL21vZHVsZXMvZXZlbnRDb250cm9sbGVyJ1xuXG5kb20uY3JlYXRlQm9hcmRzKCk7XG5nYW1lLm5ld0dhbWUoKTtcblxuZXZlbnRDb250cm9sbGVyLmluaXRCb2FyZEV2ZW50cygpO1xuZXZlbnRDb250cm9sbGVyLmluaXRHYW1lQnV0dG9ucygpO1xuZXZlbnRDb250cm9sbGVyLmluaXRTaGlwUGxhY2VtZW50KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9