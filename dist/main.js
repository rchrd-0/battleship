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
  playerBoard.addEventListener('mouseout', _shipPlacement__WEBPACK_IMPORTED_MODULE_2__.clearPreview);
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
/* harmony export */   "clearPreview": () => (/* binding */ clearPreview),
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

const clearPreview = () => {
  const cells = board.querySelectorAll('.board-cell');
  cells.forEach(cell => cell.classList.remove('ship-preview', 'invalid'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0EsS0FBSyxJQUFJO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDbENBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFVBQVUsU0FBUztBQUNuQjtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixNQUFNLGFBQWEsRUFBRTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixFQUFFLGFBQWEsTUFBTTtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFcUM7Ozs7Ozs7VUNoRHJDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNOcUI7QUFDaUI7QUFDRDtBQUN1Qjs7QUFFNUQsc0RBQWdCO0FBQ2hCLGtEQUFZOztBQUVaLHFFQUErQjtBQUMvQixxRUFBK0I7QUFDL0IsdUVBQWlDLEciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZG9tLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9ldmVudENvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3BsYXllckZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXBGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwUGxhY2VtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImNvbnN0IGdhbWVib2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQnKTtcbmNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXllci1ib2FyZCcpO1xuY29uc3QgY29tcEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbXAtYm9hcmQnKTtcbmNvbnN0IGdhbWVJbmZvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhbWUtaW5mbycpO1xuXG5jb25zdCB1cGRhdGVTaGlwQ291bnQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IHBsYXllci5pc0h1bWFuID8gcGxheWVyQm9hcmQgOiBjb21wQm9hcmQ7XG4gIGNvbnN0IHNoaXBDb3VudGVyID0gdGhpc0JvYXJkLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gIGNvbnN0IHNoaXBzUmVtYWluaW5nID0gcGxheWVyLmJvYXJkLnNoaXBzUmVtYWluaW5nKCk7XG5cbiAgc2hpcENvdW50ZXIudGV4dENvbnRlbnQgPSBgU2hpcHMgcmVtYWluaW5nOiAke3NoaXBzUmVtYWluaW5nfWA7XG59O1xuXG5jb25zdCBjcmVhdGVCb2FyZHMgPSAoKSA9PiB7XG4gIGdhbWVib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBjb25zdCBib2FyZENlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICBib2FyZENlbGwuY2xhc3NMaXN0LmFkZCgnYm9hcmQtY2VsbCcpO1xuICAgICAgICBib2FyZENlbGwuZGF0YXNldC54ID0gajtcbiAgICAgICAgYm9hcmRDZWxsLmRhdGFzZXQueSA9IGk7XG4gICAgICAgIGJvYXJkLmFwcGVuZENoaWxkKGJvYXJkQ2VsbCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbi8vIGNvbnN0IGNyZWF0ZUJvYXJkID0gKC4uLnBsYXllcnMpID0+IHtcbi8vICAgcGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbi8vICAgICB1cGRhdGVTaGlwQ291bnQocGxheWVyKTtcbi8vICAgICBjb25zdCB0aGlzQm9hcmQgPSBwbGF5ZXIuaXNIdW1hbiA/IHBsYXllckJvYXJkIDogY29tcEJvYXJkO1xuLy8gICAgIGNvbnN0IHsgdGlsZXMgfSA9IHBsYXllci5ib2FyZDtcbi8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzLmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IE9iamVjdC5rZXlzKHRpbGVzW2ldKS5sZW5ndGg7IGorKykge1xuLy8gICAgICAgICBjb25zdCBib2FyZENlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbi8vICAgICAgICAgYm9hcmRDZWxsLmNsYXNzTGlzdC5hZGQoJ2JvYXJkLWNlbGwnKTtcbi8vICAgICAgICAgYm9hcmRDZWxsLmRhdGFzZXQueCA9IGo7XG4vLyAgICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnkgPSBpO1xuLy8gICAgICAgICB0aGlzQm9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRDZWxsKTtcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH0pO1xuLy8gfTtcblxuY29uc3QgcmVuZGVyU2hpcHMgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHsgc2hpcHMgfSA9IHBsYXllci5ib2FyZDtcbiAgY29uc3QgY29vcmRzID0gc2hpcHMubWFwKChzaGlwKSA9PiBzaGlwLmNvb3Jkcyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvb3Jkc1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgW3gsIHldID0gW2Nvb3Jkc1tpXVtqXVswXSwgY29vcmRzW2ldW2pdWzFdXTtcbiAgICAgIGNvbnN0IHRoaXNDZWxsID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7eH0nXVtkYXRhLXk9JyR7eX0nXWBcbiAgICAgICk7XG4gICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCB1cGRhdGVCb2FyZCA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbXBCb2FyZDtcbiAgY29uc3QgeyB0aWxlcyB9ID0gcGxheWVyLmJvYXJkO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IE9iamVjdC5rZXlzKHRpbGVzW2ldKS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdGhpc1RpbGUgPSB0aWxlc1tpXVtqXTtcbiAgICAgIGNvbnN0IGhhc1NoaXAgPSB0aGlzVGlsZS5zaGlwSWQgIT09IG51bGw7XG4gICAgICBpZiAodGhpc1RpbGUuaGl0KSB7XG4gICAgICAgIGNvbnN0IHRoaXNDZWxsID0gdGhpc0JvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgYFtkYXRhLXg9JyR7aX0nXVtkYXRhLXk9JyR7an0nXWBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGhhc1NoaXApIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdXBkYXRlU2hpcENvdW50KHBsYXllcik7XG59O1xuXG5jb25zdCBjbGVhclVJID0gKCkgPT4ge1xuICBnYW1lYm9hcmRzLmZvckVhY2goKGJvYXJkKSA9PiB7XG4gICAgY29uc3QgY2VsbHMgPSBib2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQtY2VsbCcpO1xuICAgIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnbWlzcycsICdoaXQnLCAnc2hpcCcpO1xuICAgIH0pO1xuICB9KTtcbiAgLy8gZ2FtZSBvdmVyIHJlc2V0XG59O1xuXG5jb25zdCBhbm5vdW5jZUdhbWVPdmVyID0gKHdpbm5lcikgPT4ge1xuICBjb25zdCB3aW5NZXNzYWdlID1cbiAgICB3aW5uZXIubnVtID09PSAxXG4gICAgICA/ICdDb25ncmF0dWxhdGlvbnMhIFlvdSB3aW4hJ1xuICAgICAgOiAnR2FtZSBvdmVyIC4uLiBDb21wdXRlciB3aW5zISc7XG5cbiAgZ2FtZWJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4gYm9hcmQuY2xhc3NMaXN0LmFkZCgnZ2FtZS1vdmVyJykpO1xuICBnYW1lSW5mby50ZXh0Q29udGVudCA9IHdpbk1lc3NhZ2U7XG59O1xuXG5jb25zdCBkaXNhYmxlRXZlbnRzID0gKGJvb2wsIGJvYXJkID0gJ2NvbXAnKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IChib2FyZCA9PT0gJ2NvbXAnKSA/IGNvbXBCb2FyZCA6IHBsYXllckJvYXJkXG4gIGlmIChib29sKSB7XG4gICAgdGhpc0JvYXJkLmNsYXNzTGlzdC5hZGQoJ25vLWV2ZW50cycpO1xuICB9IGVsc2Uge1xuICAgIHRoaXNCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKCduby1ldmVudHMnKTtcbiAgfVxufTtcblxuZXhwb3J0IHtcbiAgY3JlYXRlQm9hcmRzLFxuICBjbGVhclVJLFxuICByZW5kZXJTaGlwcyxcbiAgdXBkYXRlQm9hcmQsXG4gIGRpc2FibGVFdmVudHMsXG4gIGFubm91bmNlR2FtZU92ZXIsXG59O1xuIiwiaW1wb3J0ICogYXMgZ2FtZSBmcm9tICcuL2dhbWUnO1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0ICogYXMgc2hpcFBsYWNlbWVudCBmcm9tICcuL3NoaXBQbGFjZW1lbnQnO1xuXG5jb25zdCBpbml0Qm9hcmRFdmVudHMgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbXBDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjb21wLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gIGNvbXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBjb25zdCBjb29yZCA9IGhlbHBlcnMuZ2V0Q2VsbEluZm8oZS50YXJnZXQpO1xuICAgICAgZ2FtZS5yZWNlaXZlTW92ZShjb29yZCk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuY29uc3QgaW5pdEdhbWVCdXR0b25zID0gKCkgPT4ge1xuICAvLyBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc3RhcnQtYnRuJyk7XG4gIC8vIHJlc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLm5ld0dhbWUpO1xufTtcblxuY29uc3QgaW5pdFNoaXBQbGFjZW1lbnQgPSAoKSA9PiB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXllci1ib2FyZCcpO1xuXG4gIC8vIG1vdXNlb3ZlciA9PiByZW5kZXJQcmV2aWV3XG4gIC8vIG1vdXNlb3V0ID0+IGNsZWFyUHJldmlld1xuICAvLyBjbGljayA9PiBwbGFjZVNoaXAgLS0gdmFsaWQ/P1xuICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBzaGlwUGxhY2VtZW50LnByZXZpZXdTaGlwKTtcbiAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBzaGlwUGxhY2VtZW50LmNsZWFyUHJldmlldyk7XG59O1xuXG5leHBvcnQgeyBpbml0Qm9hcmRFdmVudHMsIGluaXRHYW1lQnV0dG9ucywgaW5pdFNoaXBQbGFjZW1lbnQgfTtcbiIsImltcG9ydCBwbGF5ZXJGYWN0b3J5IGZyb20gJy4vcGxheWVyRmFjdG9yeSc7XG5pbXBvcnQgKiBhcyBkb20gZnJvbSAnLi9kb20nO1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuXG5jb25zdCBwbGF5ZXJzID0ge1xuICBwMTogbnVsbCxcbiAgY29tOiBudWxsLFxufTtcblxuY29uc3QgbmV3R2FtZSA9ICgpID0+IHtcbiAgLy8gQ2xlYW4gdXAgYm9hcmRcbiAgZG9tLmNsZWFyVUkoKTtcbiAgLy8gQ3JlYXRlIG5ldyBwbGF5ZXIgb2JqZWN0c1xuICBwbGF5ZXJzLnAxID0gcGxheWVyRmFjdG9yeSgxLCB0cnVlKTtcbiAgcGxheWVycy5jb20gPSBwbGF5ZXJGYWN0b3J5KDIsIGZhbHNlKTtcbiAgLy8gRGlzYWJsZSBjb21wdXRlciBldmVudHNcbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSk7XG4gIC8vIEVuYWJsZSBwbGF5ZXIgZXZlbnRzXG4gIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlLCAncGxheWVyJyk7XG4gIC8vIFN0YXJ0IHNoaXAgcGxhY2VtZW50XG4gIFxuICAvLyBFbmFibGUgc3RhcnQgZ2FtZSBidXR0b25cbiAgXG59XG5cbmNvbnN0IHN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgLy8gcGxheWVycy5wMSA9IHBsYXllckZhY3RvcnkoMSwgdHJ1ZSk7XG4gIC8vIHBsYXllcnMuY29tID0gcGxheWVyRmFjdG9yeSgyLCBmYWxzZSk7XG5cbiAgcGxheWVycy5jb20uYm9hcmQucGxhY2VTaGlwKDIsIFswLCAwXSwgJ3gnKTtcbiAgcGxheWVycy5wMS5ib2FyZC5wbGFjZVNoaXAoOSwgWzAsIDBdLCAneCcpO1xuXG4gIGRvbS51cGRhdGVCb2FyZChwbGF5ZXJzLnAxKVxuICBkb20udXBkYXRlQm9hcmQocGxheWVycy5jb20pXG4gIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlKTtcbiAgZG9tLnJlbmRlclNoaXBzKHBsYXllcnMucDEpO1xufTtcblxuY29uc3QgY2hlY2tHYW1lU3RhdGUgPSAocGxheWVyKSA9PiBwbGF5ZXIuYm9hcmQuYWxsU2hpcHNTdW5rKCk7XG5cbmNvbnN0IGVuZEdhbWUgPSAod2lubmVyKSA9PiB7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUpO1xuICBkb20uYW5ub3VuY2VHYW1lT3Zlcih3aW5uZXIpO1xufTtcblxuY29uc3QgcGxheUNvbU1vdmUgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHsgcDEsIGNvbSB9ID0gcGxheWVycztcbiAgY29uc3QgcmFuZG9tTW92ZSA9IGF3YWl0IGhlbHBlcnMuZ2V0UmFuZG9tTW92ZShjb20pO1xuICBcbiAgY29tLm1ha2VNb3ZlKHJhbmRvbU1vdmUsIHAxLmJvYXJkKTtcbiAgZG9tLnVwZGF0ZUJvYXJkKHAxKTtcblxuICBjb25zdCB3aW5TdGF0ZSA9IGNoZWNrR2FtZVN0YXRlKHAxKTtcbiAgaWYgKHdpblN0YXRlKSB7XG4gICAgZW5kR2FtZShjb20pO1xuICB9IGVsc2Uge1xuICAgIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlKTtcbiAgfVxufTtcblxuY29uc3QgcmVjZWl2ZU1vdmUgPSAoY29vcmQpID0+IHtcbiAgY29uc3QgeyBwMSwgY29tIH0gPSBwbGF5ZXJzO1xuICBpZiAoaGVscGVycy5hbHJlYWR5UGxheWVkKHAxLCBjb29yZCkpIHJldHVybjtcbiAgcDEubWFrZU1vdmUoY29vcmQsIGNvbS5ib2FyZCk7XG4gIGRvbS51cGRhdGVCb2FyZChjb20pO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUoY29tKTtcbiAgaWYgKHdpblN0YXRlKSB7XG4gICAgZW5kR2FtZShwMSk7XG4gIH0gZWxzZSB7XG4gICAgcGxheUNvbU1vdmUocDEsIGNvbSk7XG4gIH1cbiAgZG9tLmRpc2FibGVFdmVudHModHJ1ZSk7XG59O1xuXG5leHBvcnQgeyBwbGF5ZXJzLCBuZXdHYW1lLCBzdGFydEdhbWUsIHJlY2VpdmVNb3ZlIH07XG4iLCJpbXBvcnQgc2hpcEZhY3RvcnkgZnJvbSAnLi9zaGlwRmFjdG9yeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdhbWVib2FyZEZhY3RvcnkoKSB7XG4gIGNvbnN0IGNyZWF0ZUJvYXJkID0gKCkgPT4ge1xuICAgIGNvbnN0IGdhbWVib2FyZCA9IG5ldyBBcnJheSgxMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBnYW1lYm9hcmRbaV0gPSB7fTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBnYW1lYm9hcmRbaV1bal0gPSB7XG4gICAgICAgICAgaGl0OiBmYWxzZSxcbiAgICAgICAgICBzaGlwSWQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBnYW1lYm9hcmQ7XG4gIH07XG4gIC8vIGNvbnN0IG1pc3NlcyA9IFtdO1xuICBjb25zdCB0aWxlcyA9IGNyZWF0ZUJvYXJkKCk7XG5cbiAgY29uc3Qgc2hpcHMgPSBbXTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAobGVuZ3RoLCBbeCwgeV0sIGF4aXMpID0+IHtcbiAgICBjb25zdCBuZXdTaGlwID0gc2hpcEZhY3Rvcnkoc2hpcHMubGVuZ3RoLCBsZW5ndGgpO1xuICAgIHNoaXBzLnB1c2gobmV3U2hpcCk7XG4gICAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgICAgLy8gUGxhY2UgaG9yaXpvbnRhbGx5XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1NoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmV3U2hpcC5jb29yZHMucHVzaChbeCwgeV0pO1xuICAgICAgICB0aWxlc1t4XVt5XS5zaGlwSWQgPSBuZXdTaGlwLmlkO1xuICAgICAgICB4ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChheGlzID09PSAneScpIHtcbiAgICAgIC8vIFBsYWNlIHZlcnRpY2FsbHlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBuZXdTaGlwLmNvb3Jkcy5wdXNoKFt4LCB5XSk7XG4gICAgICAgIHRpbGVzW3hdW3ldLnNoaXBJZCA9IG5ld1NoaXAuaWQ7XG4gICAgICAgIHkgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IGhhc1NoaXAgPSAodGlsZSkgPT4gdGlsZS5zaGlwSWQgIT09IG51bGw7XG5cbiAgY29uc3QgZmluZFNoaXAgPSAoaWQpID0+IHtcbiAgICBsZXQgdGhpc1NoaXA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNoaXBzW2ldLmlkID09PSBpZCkge1xuICAgICAgICB0aGlzU2hpcCA9IHNoaXBzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1NoaXA7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9ICh0YXJnZXQpID0+IHtcbiAgICBjb25zdCBbeCwgeV0gPSB0YXJnZXQ7XG4gICAgY29uc3QgdGhpc1RpbGUgPSB0aWxlc1t4XVt5XTtcbiAgICBpZiAodGhpc1RpbGUuaGl0KSByZXR1cm47XG5cbiAgICAvLyBpZiAoIWhhc1NoaXAodGhpc1RpbGUpKSB7XG4gICAgLy8gICBtaXNzZXMucHVzaCh0YXJnZXQpO1xuICAgIC8vIH1cbiAgICBpZiAoaGFzU2hpcCh0aGlzVGlsZSkpIHtcbiAgICAgIGNvbnN0IHRoaXNTaGlwID0gZmluZFNoaXAodGhpc1RpbGUuc2hpcElkKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpc1NoaXAuY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzU2hpcC5jb29yZHNbaV0uZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHRhcmdldFtpbmRleF0pXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXNTaGlwLmhlYWx0aFtpXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpc1RpbGUuaGl0ID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBzaGlwc1JlbWFpbmluZyA9ICgpID0+IHtcbiAgICBjb25zdCBmaWx0ZXJTaGlwcyA9IHNoaXBzLmZpbHRlcigoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSA9PT0gZmFsc2UpO1xuICAgIHJldHVybiBmaWx0ZXJTaGlwcy5sZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgYWxsU2hpcHNTdW5rID0gKCkgPT4ge1xuICAgIGNvbnN0IHN1bmtTaGlwcyA9IHNoaXBzUmVtYWluaW5nKCk7XG4gICAgcmV0dXJuIHN1bmtTaGlwcyA9PT0gMDtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHRpbGVzLFxuICAgIHNoaXBzLFxuICAgIHBsYWNlU2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIHNoaXBzUmVtYWluaW5nLFxuICAgIGFsbFNoaXBzU3VuayxcbiAgfTtcbn1cbiIsImNvbnN0IGdldENlbGxJbmZvID0gKHRhcmdldENlbGwpID0+IHtcbiAgcmV0dXJuIFtOdW1iZXIodGFyZ2V0Q2VsbC5kYXRhc2V0LngpLCBOdW1iZXIodGFyZ2V0Q2VsbC5kYXRhc2V0LnkpXTtcbn07XG5cbmNvbnN0IGFscmVhZHlQbGF5ZWQgPSAocGxheWVyLCB0YXJnZXQpID0+IHtcbiAgY29uc3QgcHJldmlvdXNNb3ZlcyA9IHBsYXllci5tb3ZlcztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aW91c01vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHByZXZpb3VzTW92ZXNbaV0uZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHRhcmdldFtpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgdGltZW91dCA9IChtcykgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKTtcbiAgfSk7XG59O1xuXG5jb25zdCBnZW5lcmF0ZVJhbmRvbSA9ICgpID0+IHtcbiAgY29uc3QgcmFuZG9tID0gW1xuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gIF07XG4gIHJldHVybiByYW5kb207XG59O1xuXG5jb25zdCBnZXRSYW5kb21Nb3ZlID0gYXN5bmMgKHBsYXllcikgPT4ge1xuICBsZXQgcmFuZG9tTW92ZSA9IGdlbmVyYXRlUmFuZG9tKCk7XG4gIHdoaWxlIChhbHJlYWR5UGxheWVkKHBsYXllciwgcmFuZG9tTW92ZSkpIHtcbiAgICByYW5kb21Nb3ZlID0gZ2VuZXJhdGVSYW5kb20oKTtcbiAgfVxuICBhd2FpdCB0aW1lb3V0KDQwMCk7XG4gIHJldHVybiByYW5kb21Nb3ZlO1xufTtcblxuLy8gY29uc3QgZ2V0VHVybiA9IChvYmopID0+IHtcbi8vICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbi8vICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgY29uc3QgcGxheWVyID0gb2JqW2tleXNbaV1dO1xuLy8gICAgIGlmIChwbGF5ZXIudHVybiA9PT0gZmFsc2UpIHtcbi8vICAgICAgIHJldHVybiBwbGF5ZXJcbi8vICAgICB9XG4vLyAgIH1cbi8vIH07XG5cbmV4cG9ydCB7IGdldENlbGxJbmZvLCBhbHJlYWR5UGxheWVkLCBnZXRSYW5kb21Nb3ZlIH07XG4iLCJpbXBvcnQgZ2FtZWJvYXJkRmFjdG9yeSBmcm9tICcuL2dhbWVib2FyZEZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbGF5ZXJGYWN0b3J5KG51bSwgaHVtYW4pIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZWJvYXJkRmFjdG9yeSgpO1xuICBjb25zdCBtb3ZlcyA9IFtdO1xuICBjb25zdCBtYWtlTW92ZSA9ICh0YXJnZXQsIGVuZW15Qm9hcmQpID0+IHtcbiAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2sodGFyZ2V0KTtcbiAgICBtb3Zlcy5wdXNoKHRhcmdldCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgbnVtKCkge1xuICAgICAgcmV0dXJuIG51bTtcbiAgICB9LFxuICAgIGdldCBib2FyZCgpIHtcbiAgICAgIHJldHVybiBnYW1lYm9hcmQ7XG4gICAgfSxcbiAgICBnZXQgaXNIdW1hbigpIHtcbiAgICAgIHJldHVybiBodW1hbjtcbiAgICB9LFxuICAgIC8vIGdldCB0dXJuKCkge1xuICAgIC8vICAgcmV0dXJuIHR1cm47XG4gICAgLy8gfSxcbiAgICBnZXQgbW92ZXMoKSB7XG4gICAgICByZXR1cm4gbW92ZXM7XG4gICAgfSxcbiAgICBtYWtlTW92ZSxcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNoaXBGYWN0b3J5KGlkLCBsZW5ndGgpIHtcbiAgY29uc3QgY3JlYXRlSGVhbHRoID0gKHNpemUpID0+IHtcbiAgICBjb25zdCBhcnJheSA9IFsuLi5BcnJheShzaXplKS5rZXlzKCldO1xuICAgIGNvbnN0IGhlYWx0aCA9IGFycmF5LnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgcHJldltjdXJyXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwge30pO1xuICAgIHJldHVybiBoZWFsdGg7XG4gIH07XG5cbiAgY29uc3QgY29vcmRzID0gW107XG5cbiAgY29uc3QgaGVhbHRoID0gY3JlYXRlSGVhbHRoKGxlbmd0aCk7XG4gIC8vIGhlYWx0aCA9IHsgd2hlcmUgYm9vbCByZXByZXNlbnRzIGhpdC9ubyBoaXRcbiAgLy8gICAwOiBmYWxzZSxcbiAgLy8gICAxOiBmYWxzZSxcbiAgLy8gICAyOiBmYWxzZSxcbiAgLy8gfVxuICBjb25zdCBoaXQgPSAoaW5kZXgpID0+IHtcbiAgICBoZWFsdGhbaW5kZXhdID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoaGVhbHRoKS5ldmVyeSgoaW5kZXgpID0+IGluZGV4ID09PSB0cnVlKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIGxlbmd0aCxcbiAgICBoZWFsdGgsXG4gICAgY29vcmRzLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gIH07XG59XG4iLCJjb25zdCBib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcblxuY29uc3QgaXNXaXRoaW5Cb3VuZHMgPSAoY2VsbHMsIGxlbmd0aCkgPT4ge1xuICByZXR1cm4gY2VsbHMubGVuZ3RoID09PSBsZW5ndGg7XG59O1xuXG5jb25zdCBwcmV2aWV3U2hpcCA9IChlLCBvcmllbnRhdGlvbiA9ICd5JywgbGVuZ3RoID0gNSkgPT4ge1xuICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdib2FyZCcpKSByZXR1cm47XG5cbiAgY29uc3QgeyB0YXJnZXQgfSA9IGU7XG4gIGNvbnN0IFt4LCB5XSA9IFtOdW1iZXIodGFyZ2V0LmRhdGFzZXQueCksIE51bWJlcih0YXJnZXQuZGF0YXNldC55KV07XG4gIGNvbnN0IHNoaXBDb29yZHMgPSBbXTtcblxuICBpZiAob3JpZW50YXRpb24gPT09ICd4Jykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vID45ID0gb3V0IG9mIGJvdW5kc1xuICAgICAgaWYgKGkgKyB4ID4gOSkgYnJlYWs7XG5cbiAgICAgIGNvbnN0IG5leHRDZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXg9JyR7aSArIHh9J11bZGF0YS15PScke3l9J11gXG4gICAgICApO1xuICAgICAgc2hpcENvb3Jkcy5wdXNoKG5leHRDZWxsKTtcbiAgICB9XG4gIH1cbiAgaWYgKG9yaWVudGF0aW9uID09PSAneScpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyA+OSA9IG91dCBvZiBib3VuZHNcbiAgICAgIGlmIChpICsgeSA+IDkpIGJyZWFrO1xuXG4gICAgICBjb25zdCBuZXh0Q2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS14PScke3h9J11bZGF0YS15PScke2kgKyB5fSddYFxuICAgICAgKTtcbiAgICAgIHNoaXBDb29yZHMucHVzaChuZXh0Q2VsbCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGlzV2l0aGluQm91bmRzKHNoaXBDb29yZHMsIGxlbmd0aCkpIHtcbiAgICBzaGlwQ29vcmRzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcC1wcmV2aWV3JykpO1xuICB9IGVsc2Uge1xuICAgIHNoaXBDb29yZHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJykpO1xuICB9XG59O1xuXG5jb25zdCBjbGVhclByZXZpZXcgPSAoKSA9PiB7XG4gIGNvbnN0IGNlbGxzID0gYm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgY2VsbHMuZm9yRWFjaChjZWxsID0+IGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnc2hpcC1wcmV2aWV3JywgJ2ludmFsaWQnKSk7XG59XG5cbmV4cG9ydCB7IHByZXZpZXdTaGlwLCBjbGVhclByZXZpZXcgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5pbXBvcnQgKiBhcyBnYW1lIGZyb20gJy4vbW9kdWxlcy9nYW1lJ1xuaW1wb3J0ICogYXMgZG9tIGZyb20gJy4vbW9kdWxlcy9kb20nO1xuaW1wb3J0ICogYXMgZXZlbnRDb250cm9sbGVyIGZyb20gJy4vbW9kdWxlcy9ldmVudENvbnRyb2xsZXInXG5cbmRvbS5jcmVhdGVCb2FyZHMoKTtcbmdhbWUubmV3R2FtZSgpO1xuXG5ldmVudENvbnRyb2xsZXIuaW5pdEJvYXJkRXZlbnRzKCk7XG5ldmVudENvbnRyb2xsZXIuaW5pdEdhbWVCdXR0b25zKCk7XG5ldmVudENvbnRyb2xsZXIuaW5pdFNoaXBQbGFjZW1lbnQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=