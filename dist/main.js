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
/* harmony export */   "createBoard": () => (/* binding */ createBoard),
/* harmony export */   "disableEvents": () => (/* binding */ disableEvents),
/* harmony export */   "renderShips": () => (/* binding */ renderShips),
/* harmony export */   "updateBoard": () => (/* binding */ updateBoard)
/* harmony export */ });
const playerBoard = document.querySelector('#player-board');
const compBoard = document.querySelector('#comp-board');

const updateShipCount = (player) => {
  const thisBoard = player.isHuman ? playerBoard : compBoard;
  const shipCounter = thisBoard.querySelector('.ship-counter');
  const shipsRemaining = player.board.shipsRemaining();
  shipCounter.textContent = `Ships remaining: ${shipsRemaining}`;
};

const createBoard = (...players) => {
  players.forEach((player) => {
    updateShipCount(player);
    const thisBoard = player.isHuman ? playerBoard : compBoard;
    const { tiles } = player.board;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < Object.keys(tiles[i]).length; j++) {
        const boardCell = document.createElement('div');
        boardCell.classList.add('board-cell');
        boardCell.dataset.x = j;
        boardCell.dataset.y = i;
        thisBoard.appendChild(boardCell);
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

const announceGameOver = (winner) => {
  const gameInfo = document.querySelector('#game-info');
  const winMessage =
    winner.num === 1
      ? 'Congratulations! You win!'
      : 'Game over ... Computer wins!';
  [playerBoard, compBoard].forEach((board) => board.classList.add('game-over'));
  gameInfo.textContent = winMessage;
};

const disableEvents = (bool) => {
  if (bool) {
    compBoard.classList.add('no-events');
  } else {
    compBoard.classList.remove('no-events');
  }
};




/***/ }),

/***/ "./src/modules/event-controller.js":
/*!*****************************************!*\
  !*** ./src/modules/event-controller.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initBoardEvents": () => (/* binding */ initBoardEvents)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/modules/game.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/modules/helpers.js");



const initBoardEvents = () => {
  const playerCells = document.querySelectorAll('#comp-board .board-cell');
  playerCells.forEach((cell) => {
    cell.addEventListener('click', (e) => {
      const coord = _helpers__WEBPACK_IMPORTED_MODULE_1__.getCellInfo(e.target);
      _game__WEBPACK_IMPORTED_MODULE_0__.receiveMove(coord);
    });
  });
};




/***/ }),

/***/ "./src/modules/game.js":
/*!*****************************!*\
  !*** ./src/modules/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "receiveMove": () => (/* binding */ receiveMove),
/* harmony export */   "startGame": () => (/* binding */ startGame)
/* harmony export */ });
/* harmony import */ var _player_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player-factory */ "./src/modules/player-factory.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/modules/dom.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./src/modules/helpers.js");




const players = {
  p1: null,
  com: null,
};

const startGame = () => {
  players.p1 = (0,_player_factory__WEBPACK_IMPORTED_MODULE_0__["default"])(1, true);
  players.com = (0,_player_factory__WEBPACK_IMPORTED_MODULE_0__["default"])(2, false);

  players.com.board.placeShip(2, [0, 0], 'x');
  players.p1.board.placeShip(9, [0, 0], 'x');

  _dom__WEBPACK_IMPORTED_MODULE_1__.createBoard(players.p1, players.com);
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

/***/ "./src/modules/gameboard-factory.js":
/*!******************************************!*\
  !*** ./src/modules/gameboard-factory.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ gameBoardFactory)
/* harmony export */ });
/* harmony import */ var _ship_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship-factory */ "./src/modules/ship-factory.js");


function gameBoardFactory() {
  const createBoard = () => {
    const gameBoard = new Array(10);
    for (let i = 0; i < 10; i++) {
      gameBoard[i] = {};
      for (let j = 0; j < 10; j++) {
        gameBoard[i][j] = {
          hit: false,
          shipId: null,
        };
      }
    }
    return gameBoard;
  };
  // const misses = [];
  const tiles = createBoard();

  const ships = [];

  const placeShip = (length, [x, y], axis) => {
    const newShip = (0,_ship_factory__WEBPACK_IMPORTED_MODULE_0__["default"])(ships.length, length);
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

/***/ "./src/modules/player-factory.js":
/*!***************************************!*\
  !*** ./src/modules/player-factory.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ playerFactory)
/* harmony export */ });
/* harmony import */ var _gameboard_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard-factory */ "./src/modules/gameboard-factory.js");


function playerFactory(num, human) {
  const gameBoard = (0,_gameboard_factory__WEBPACK_IMPORTED_MODULE_0__["default"])();
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
      return gameBoard;
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

/***/ "./src/modules/ship-factory.js":
/*!*************************************!*\
  !*** ./src/modules/ship-factory.js ***!
  \*************************************/
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
/* harmony import */ var _modules_event_controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/event-controller */ "./src/modules/event-controller.js");




_modules_game__WEBPACK_IMPORTED_MODULE_1__.startGame();
_modules_event_controller__WEBPACK_IMPORTED_MODULE_2__.initBoardEvents();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7QUNOcUI7QUFDaUI7QUFDdUI7O0FBRTdELG9EQUFjO0FBQ2Qsc0VBQStCLEciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZG9tLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9ldmVudC1jb250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lYm9hcmQtZmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvaGVscGVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXAtZmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcbmNvbnN0IGNvbXBCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb21wLWJvYXJkJyk7XG5cbmNvbnN0IHVwZGF0ZVNoaXBDb3VudCA9IChwbGF5ZXIpID0+IHtcbiAgY29uc3QgdGhpc0JvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbXBCb2FyZDtcbiAgY29uc3Qgc2hpcENvdW50ZXIgPSB0aGlzQm9hcmQucXVlcnlTZWxlY3RvcignLnNoaXAtY291bnRlcicpO1xuICBjb25zdCBzaGlwc1JlbWFpbmluZyA9IHBsYXllci5ib2FyZC5zaGlwc1JlbWFpbmluZygpO1xuICBzaGlwQ291bnRlci50ZXh0Q29udGVudCA9IGBTaGlwcyByZW1haW5pbmc6ICR7c2hpcHNSZW1haW5pbmd9YDtcbn07XG5cbmNvbnN0IGNyZWF0ZUJvYXJkID0gKC4uLnBsYXllcnMpID0+IHtcbiAgcGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICB1cGRhdGVTaGlwQ291bnQocGxheWVyKTtcbiAgICBjb25zdCB0aGlzQm9hcmQgPSBwbGF5ZXIuaXNIdW1hbiA/IHBsYXllckJvYXJkIDogY29tcEJvYXJkO1xuICAgIGNvbnN0IHsgdGlsZXMgfSA9IHBsYXllci5ib2FyZDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IE9iamVjdC5rZXlzKHRpbGVzW2ldKS5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBib2FyZENlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9hcmRDZWxsLmNsYXNzTGlzdC5hZGQoJ2JvYXJkLWNlbGwnKTtcbiAgICAgICAgYm9hcmRDZWxsLmRhdGFzZXQueCA9IGo7XG4gICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnkgPSBpO1xuICAgICAgICB0aGlzQm9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRDZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3QgcmVuZGVyU2hpcHMgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHsgc2hpcHMgfSA9IHBsYXllci5ib2FyZDtcbiAgY29uc3QgY29vcmRzID0gc2hpcHMubWFwKChzaGlwKSA9PiBzaGlwLmNvb3Jkcyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb29yZHNbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IFtjb29yZHNbaV1bal1bMF0sIGNvb3Jkc1tpXVtqXVsxXV07XG4gICAgICBjb25zdCB0aGlzQ2VsbCA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS14PScke3h9J11bZGF0YS15PScke3l9J11gXG4gICAgICApO1xuICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgdXBkYXRlQm9hcmQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IHBsYXllci5pc0h1bWFuID8gcGxheWVyQm9hcmQgOiBjb21wQm9hcmQ7XG4gIGNvbnN0IHsgdGlsZXMgfSA9IHBsYXllci5ib2FyZDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgT2JqZWN0LmtleXModGlsZXNbaV0pLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCB0aGlzVGlsZSA9IHRpbGVzW2ldW2pdO1xuICAgICAgY29uc3QgaGFzU2hpcCA9IHRoaXNUaWxlLnNoaXBJZCAhPT0gbnVsbDtcbiAgICAgIGlmICh0aGlzVGlsZS5oaXQpIHtcbiAgICAgICAgY29uc3QgdGhpc0NlbGwgPSB0aGlzQm9hcmQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgW2RhdGEteD0nJHtpfSddW2RhdGEteT0nJHtqfSddYFxuICAgICAgICApO1xuICAgICAgICBpZiAoaGFzU2hpcCkge1xuICAgICAgICAgIHRoaXNDZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXNDZWxsLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICB1cGRhdGVTaGlwQ291bnQocGxheWVyKTtcbn07XG5cbmNvbnN0IGFubm91bmNlR2FtZU92ZXIgPSAod2lubmVyKSA9PiB7XG4gIGNvbnN0IGdhbWVJbmZvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhbWUtaW5mbycpO1xuICBjb25zdCB3aW5NZXNzYWdlID1cbiAgICB3aW5uZXIubnVtID09PSAxXG4gICAgICA/ICdDb25ncmF0dWxhdGlvbnMhIFlvdSB3aW4hJ1xuICAgICAgOiAnR2FtZSBvdmVyIC4uLiBDb21wdXRlciB3aW5zISc7XG4gIFtwbGF5ZXJCb2FyZCwgY29tcEJvYXJkXS5mb3JFYWNoKChib2FyZCkgPT4gYm9hcmQuY2xhc3NMaXN0LmFkZCgnZ2FtZS1vdmVyJykpO1xuICBnYW1lSW5mby50ZXh0Q29udGVudCA9IHdpbk1lc3NhZ2U7XG59O1xuXG5jb25zdCBkaXNhYmxlRXZlbnRzID0gKGJvb2wpID0+IHtcbiAgaWYgKGJvb2wpIHtcbiAgICBjb21wQm9hcmQuY2xhc3NMaXN0LmFkZCgnbm8tZXZlbnRzJyk7XG4gIH0gZWxzZSB7XG4gICAgY29tcEJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ25vLWV2ZW50cycpO1xuICB9XG59O1xuXG5leHBvcnQge1xuICBjcmVhdGVCb2FyZCxcbiAgcmVuZGVyU2hpcHMsXG4gIHVwZGF0ZUJvYXJkLFxuICBkaXNhYmxlRXZlbnRzLFxuICBhbm5vdW5jZUdhbWVPdmVyLFxufTtcbiIsImltcG9ydCAqIGFzIGdhbWUgZnJvbSAnLi9nYW1lJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcblxuY29uc3QgaW5pdEJvYXJkRXZlbnRzID0gKCkgPT4ge1xuICBjb25zdCBwbGF5ZXJDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjb21wLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gIHBsYXllckNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkID0gaGVscGVycy5nZXRDZWxsSW5mbyhlLnRhcmdldCk7XG4gICAgICBnYW1lLnJlY2VpdmVNb3ZlKGNvb3JkKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5leHBvcnQgeyBpbml0Qm9hcmRFdmVudHMgfTtcbiIsImltcG9ydCBwbGF5ZXJGYWN0b3J5IGZyb20gJy4vcGxheWVyLWZhY3RvcnknO1xuaW1wb3J0ICogYXMgZG9tIGZyb20gJy4vZG9tJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcblxuY29uc3QgcGxheWVycyA9IHtcbiAgcDE6IG51bGwsXG4gIGNvbTogbnVsbCxcbn07XG5cbmNvbnN0IHN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgcGxheWVycy5wMSA9IHBsYXllckZhY3RvcnkoMSwgdHJ1ZSk7XG4gIHBsYXllcnMuY29tID0gcGxheWVyRmFjdG9yeSgyLCBmYWxzZSk7XG5cbiAgcGxheWVycy5jb20uYm9hcmQucGxhY2VTaGlwKDIsIFswLCAwXSwgJ3gnKTtcbiAgcGxheWVycy5wMS5ib2FyZC5wbGFjZVNoaXAoOSwgWzAsIDBdLCAneCcpO1xuXG4gIGRvbS5jcmVhdGVCb2FyZChwbGF5ZXJzLnAxLCBwbGF5ZXJzLmNvbSk7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKGZhbHNlKTtcbiAgZG9tLnJlbmRlclNoaXBzKHBsYXllcnMucDEpO1xufTtcblxuY29uc3QgY2hlY2tHYW1lU3RhdGUgPSAocGxheWVyKSA9PiBwbGF5ZXIuYm9hcmQuYWxsU2hpcHNTdW5rKCk7XG5cbmNvbnN0IGVuZEdhbWUgPSAod2lubmVyKSA9PiB7XG4gIGRvbS5kaXNhYmxlRXZlbnRzKHRydWUpO1xuICBkb20uYW5ub3VuY2VHYW1lT3Zlcih3aW5uZXIpO1xufTtcblxuY29uc3QgcGxheUNvbU1vdmUgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHsgcDEsIGNvbSB9ID0gcGxheWVycztcbiAgY29uc3QgcmFuZG9tTW92ZSA9IGF3YWl0IGhlbHBlcnMuZ2V0UmFuZG9tTW92ZShjb20pO1xuICBjb20ubWFrZU1vdmUocmFuZG9tTW92ZSwgcDEuYm9hcmQpO1xuICBkb20udXBkYXRlQm9hcmQocDEpO1xuXG4gIGNvbnN0IHdpblN0YXRlID0gY2hlY2tHYW1lU3RhdGUocDEpO1xuICBpZiAod2luU3RhdGUpIHtcbiAgICBlbmRHYW1lKGNvbSk7XG4gIH0gZWxzZSB7XG4gICAgZG9tLmRpc2FibGVFdmVudHMoZmFsc2UpO1xuICB9XG59O1xuXG5jb25zdCByZWNlaXZlTW92ZSA9IChjb29yZCkgPT4ge1xuICBjb25zdCB7IHAxLCBjb20gfSA9IHBsYXllcnM7XG4gIGlmIChoZWxwZXJzLmFscmVhZHlQbGF5ZWQocDEsIGNvb3JkKSkgcmV0dXJuO1xuICBwMS5tYWtlTW92ZShjb29yZCwgY29tLmJvYXJkKTtcbiAgZG9tLnVwZGF0ZUJvYXJkKGNvbSk7XG5cbiAgY29uc3Qgd2luU3RhdGUgPSBjaGVja0dhbWVTdGF0ZShjb20pO1xuICBpZiAod2luU3RhdGUpIHtcbiAgICBlbmRHYW1lKHAxKTtcbiAgfSBlbHNlIHtcbiAgICBwbGF5Q29tTW92ZShwMSwgY29tKTtcbiAgfVxuICBkb20uZGlzYWJsZUV2ZW50cyh0cnVlKTtcbn07XG5cbmV4cG9ydCB7IHN0YXJ0R2FtZSwgcmVjZWl2ZU1vdmUgfTtcbiIsImltcG9ydCBzaGlwRmFjdG9yeSBmcm9tICcuL3NoaXAtZmFjdG9yeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdhbWVCb2FyZEZhY3RvcnkoKSB7XG4gIGNvbnN0IGNyZWF0ZUJvYXJkID0gKCkgPT4ge1xuICAgIGNvbnN0IGdhbWVCb2FyZCA9IG5ldyBBcnJheSgxMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBnYW1lQm9hcmRbaV0gPSB7fTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBnYW1lQm9hcmRbaV1bal0gPSB7XG4gICAgICAgICAgaGl0OiBmYWxzZSxcbiAgICAgICAgICBzaGlwSWQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBnYW1lQm9hcmQ7XG4gIH07XG4gIC8vIGNvbnN0IG1pc3NlcyA9IFtdO1xuICBjb25zdCB0aWxlcyA9IGNyZWF0ZUJvYXJkKCk7XG5cbiAgY29uc3Qgc2hpcHMgPSBbXTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAobGVuZ3RoLCBbeCwgeV0sIGF4aXMpID0+IHtcbiAgICBjb25zdCBuZXdTaGlwID0gc2hpcEZhY3Rvcnkoc2hpcHMubGVuZ3RoLCBsZW5ndGgpO1xuICAgIHNoaXBzLnB1c2gobmV3U2hpcCk7XG4gICAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgICAgLy8gUGxhY2UgaG9yaXpvbnRhbGx5XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1NoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmV3U2hpcC5jb29yZHMucHVzaChbeCwgeV0pO1xuICAgICAgICB0aWxlc1t4XVt5XS5zaGlwSWQgPSBuZXdTaGlwLmlkO1xuICAgICAgICB4ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChheGlzID09PSAneScpIHtcbiAgICAgIC8vIFBsYWNlIHZlcnRpY2FsbHlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBuZXdTaGlwLmNvb3Jkcy5wdXNoKFt4LCB5XSk7XG4gICAgICAgIHRpbGVzW3hdW3ldLnNoaXBJZCA9IG5ld1NoaXAuaWQ7XG4gICAgICAgIHkgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IGhhc1NoaXAgPSAodGlsZSkgPT4gdGlsZS5zaGlwSWQgIT09IG51bGw7XG5cbiAgY29uc3QgZmluZFNoaXAgPSAoaWQpID0+IHtcbiAgICBsZXQgdGhpc1NoaXA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNoaXBzW2ldLmlkID09PSBpZCkge1xuICAgICAgICB0aGlzU2hpcCA9IHNoaXBzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1NoaXA7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9ICh0YXJnZXQpID0+IHtcbiAgICBjb25zdCBbeCwgeV0gPSB0YXJnZXQ7XG4gICAgY29uc3QgdGhpc1RpbGUgPSB0aWxlc1t4XVt5XTtcbiAgICBpZiAodGhpc1RpbGUuaGl0KSByZXR1cm47XG5cbiAgICAvLyBpZiAoIWhhc1NoaXAodGhpc1RpbGUpKSB7XG4gICAgLy8gICBtaXNzZXMucHVzaCh0YXJnZXQpO1xuICAgIC8vIH1cbiAgICBpZiAoaGFzU2hpcCh0aGlzVGlsZSkpIHtcbiAgICAgIGNvbnN0IHRoaXNTaGlwID0gZmluZFNoaXAodGhpc1RpbGUuc2hpcElkKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpc1NoaXAuY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzU2hpcC5jb29yZHNbaV0uZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHRhcmdldFtpbmRleF0pXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXNTaGlwLmhlYWx0aFtpXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpc1RpbGUuaGl0ID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBzaGlwc1JlbWFpbmluZyA9ICgpID0+IHtcbiAgICBjb25zdCBmaWx0ZXJTaGlwcyA9IHNoaXBzLmZpbHRlcigoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSA9PT0gZmFsc2UpO1xuICAgIHJldHVybiBmaWx0ZXJTaGlwcy5sZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgYWxsU2hpcHNTdW5rID0gKCkgPT4ge1xuICAgIGNvbnN0IHN1bmtTaGlwcyA9IHNoaXBzUmVtYWluaW5nKCk7XG4gICAgcmV0dXJuIHN1bmtTaGlwcyA9PT0gMDtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHRpbGVzLFxuICAgIHNoaXBzLFxuICAgIHBsYWNlU2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIHNoaXBzUmVtYWluaW5nLFxuICAgIGFsbFNoaXBzU3VuayxcbiAgfTtcbn1cbiIsImNvbnN0IGdldENlbGxJbmZvID0gKHRhcmdldENlbGwpID0+IHtcbiAgcmV0dXJuIFtOdW1iZXIodGFyZ2V0Q2VsbC5kYXRhc2V0LngpLCBOdW1iZXIodGFyZ2V0Q2VsbC5kYXRhc2V0LnkpXTtcbn07XG5cbmNvbnN0IGFscmVhZHlQbGF5ZWQgPSAocGxheWVyLCB0YXJnZXQpID0+IHtcbiAgY29uc3QgcHJldmlvdXNNb3ZlcyA9IHBsYXllci5tb3ZlcztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aW91c01vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHByZXZpb3VzTW92ZXNbaV0uZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHRhcmdldFtpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgdGltZW91dCA9IChtcykgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKTtcbiAgfSk7XG59O1xuXG5jb25zdCBnZW5lcmF0ZVJhbmRvbSA9ICgpID0+IHtcbiAgY29uc3QgcmFuZG9tID0gW1xuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gIF07XG4gIHJldHVybiByYW5kb207XG59O1xuXG5jb25zdCBnZXRSYW5kb21Nb3ZlID0gYXN5bmMgKHBsYXllcikgPT4ge1xuICBsZXQgcmFuZG9tTW92ZSA9IGdlbmVyYXRlUmFuZG9tKCk7XG4gIHdoaWxlIChhbHJlYWR5UGxheWVkKHBsYXllciwgcmFuZG9tTW92ZSkpIHtcbiAgICByYW5kb21Nb3ZlID0gZ2VuZXJhdGVSYW5kb20oKTtcbiAgfVxuICBhd2FpdCB0aW1lb3V0KDQwMCk7XG4gIHJldHVybiByYW5kb21Nb3ZlO1xufTtcblxuLy8gY29uc3QgZ2V0VHVybiA9IChvYmopID0+IHtcbi8vICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbi8vICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgY29uc3QgcGxheWVyID0gb2JqW2tleXNbaV1dO1xuLy8gICAgIGlmIChwbGF5ZXIudHVybiA9PT0gZmFsc2UpIHtcbi8vICAgICAgIHJldHVybiBwbGF5ZXJcbi8vICAgICB9XG4vLyAgIH1cbi8vIH07XG5cbmV4cG9ydCB7IGdldENlbGxJbmZvLCBhbHJlYWR5UGxheWVkLCBnZXRSYW5kb21Nb3ZlIH07XG4iLCJpbXBvcnQgZ2FtZUJvYXJkRmFjdG9yeSBmcm9tICcuL2dhbWVib2FyZC1mYWN0b3J5JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGxheWVyRmFjdG9yeShudW0sIGh1bWFuKSB7XG4gIGNvbnN0IGdhbWVCb2FyZCA9IGdhbWVCb2FyZEZhY3RvcnkoKTtcbiAgY29uc3QgbW92ZXMgPSBbXTtcbiAgY29uc3QgbWFrZU1vdmUgPSAodGFyZ2V0LCBlbmVteUJvYXJkKSA9PiB7XG4gICAgZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKHRhcmdldCk7XG4gICAgbW92ZXMucHVzaCh0YXJnZXQpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZ2V0IG51bSgpIHtcbiAgICAgIHJldHVybiBudW07XG4gICAgfSxcbiAgICBnZXQgYm9hcmQoKSB7XG4gICAgICByZXR1cm4gZ2FtZUJvYXJkO1xuICAgIH0sXG4gICAgZ2V0IGlzSHVtYW4oKSB7XG4gICAgICByZXR1cm4gaHVtYW47XG4gICAgfSxcbiAgICAvLyBnZXQgdHVybigpIHtcbiAgICAvLyAgIHJldHVybiB0dXJuO1xuICAgIC8vIH0sXG4gICAgZ2V0IG1vdmVzKCkge1xuICAgICAgcmV0dXJuIG1vdmVzO1xuICAgIH0sXG4gICAgbWFrZU1vdmUsXG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGlwRmFjdG9yeShpZCwgbGVuZ3RoKSB7XG4gIGNvbnN0IGNyZWF0ZUhlYWx0aCA9IChzaXplKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBbLi4uQXJyYXkoc2l6ZSkua2V5cygpXTtcbiAgICBjb25zdCBoZWFsdGggPSBhcnJheS5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgIHByZXZbY3Vycl0gPSBmYWxzZTtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gaGVhbHRoO1xuICB9O1xuXG4gIGNvbnN0IGNvb3JkcyA9IFtdO1xuXG4gIGNvbnN0IGhlYWx0aCA9IGNyZWF0ZUhlYWx0aChsZW5ndGgpO1xuICAvLyBoZWFsdGggPSB7IHdoZXJlIGJvb2wgcmVwcmVzZW50cyBoaXQvbm8gaGl0XG4gIC8vICAgMDogZmFsc2UsXG4gIC8vICAgMTogZmFsc2UsXG4gIC8vICAgMjogZmFsc2UsXG4gIC8vIH1cbiAgY29uc3QgaGl0ID0gKGluZGV4KSA9PiB7XG4gICAgaGVhbHRoW2luZGV4XSA9IHRydWU7XG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGhlYWx0aCkuZXZlcnkoKGluZGV4KSA9PiBpbmRleCA9PT0gdHJ1ZSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpZCxcbiAgICBsZW5ndGgsXG4gICAgaGVhbHRoLFxuICAgIGNvb3JkcyxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICB9O1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vc3R5bGUuY3NzJztcbmltcG9ydCAqIGFzIGdhbWUgZnJvbSAnLi9tb2R1bGVzL2dhbWUnXG5pbXBvcnQgKiBhcyBldmVudENvbnRyb2xsZXIgZnJvbSAnLi9tb2R1bGVzL2V2ZW50LWNvbnRyb2xsZXInXG5cbmdhbWUuc3RhcnRHYW1lKCk7XG5ldmVudENvbnRyb2xsZXIuaW5pdEJvYXJkRXZlbnRzKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9