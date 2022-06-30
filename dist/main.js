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
/* harmony export */   "createBoard": () => (/* binding */ createBoard),
/* harmony export */   "renderShips": () => (/* binding */ renderShips),
/* harmony export */   "updateBoard": () => (/* binding */ updateBoard)
/* harmony export */ });
const playerBoard = document.querySelector('#player-board');
const compBoard = document.querySelector('#comp-board');

const createBoard = (...players) => {
  players.forEach((player) => {
    const thisBoard = player.isHuman ? playerBoard : compBoard;
    const { tiles } = player.board;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < Object.keys(tiles[i]).length; j++) {
        const boardCell = document.createElement('div');
        boardCell.classList.add('board-cell');
        boardCell.dataset.x = i;
        boardCell.dataset.y = j;
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
      const [opponent, coord] = _helpers__WEBPACK_IMPORTED_MODULE_1__.getCellInfo(e.target);
      _game__WEBPACK_IMPORTED_MODULE_0__.receiveMove(opponent, coord);
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
  players.p1 = (0,_player_factory__WEBPACK_IMPORTED_MODULE_0__["default"])('', 1, true, true);
  players.com = (0,_player_factory__WEBPACK_IMPORTED_MODULE_0__["default"])('', 2, false, false);
  _dom__WEBPACK_IMPORTED_MODULE_1__.createBoard(players.p1, players.com);
}

const receiveMove = (target, coord) => {
  const playing = (target === 'p1') ? players.com : players.p1
  const enemy = players[target];
  if (_helpers__WEBPACK_IMPORTED_MODULE_2__.alreadyPlayed(playing, coord)) return
  playing.makeMove(coord, enemy.board)
  _dom__WEBPACK_IMPORTED_MODULE_1__.updateBoard(enemy)
}




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
  const allShipsSunk = () => {
    const sunkShips = ships.filter((ship) => ship.isSunk() === true);
    return sunkShips.length > 0;
  };
  return { tiles, ships, placeShip, receiveAttack, allShipsSunk };
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
/* harmony export */   "getCellInfo": () => (/* binding */ getCellInfo)
/* harmony export */ });
const getCellInfo = (targetCell) => {
  const cellInfo = [
    targetCell.parentNode.dataset.board,
    [Number(targetCell.dataset.x), Number(targetCell.dataset.y)],
  ];
  return cellInfo;
};

const alreadyPlayed = (playing, target) => {
  const previousMoves = playing.moves;
  for (let i = 0; i < previousMoves.length; i++) {
    if (previousMoves[i].every((value, index) => value === target[index])) {
      return true;
    }
  }
  return false;
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


function playerFactory(name, num, human, turn) {
  const playerName = name === '' ? `Player ${num}` : name;
  const gameBoard = (0,_gameboard_factory__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const moves = [];
  const makeMove = (target, enemyBoard) => {
    enemyBoard.receiveAttack(target);
    moves.push(target);
  };

  return {
    get name() {
      return playerName;
    },
    get board() {
      return gameBoard;
    },
    get isHuman() {
      return human;
    },
    get turn() {
      return turn;
    },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUM5QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTnFCO0FBQ2lCO0FBQ3VCOztBQUU3RCxvREFBYztBQUNkLHNFQUErQixHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZXZlbnQtY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkLWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3BsYXllci1mYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyLWJvYXJkJyk7XG5jb25zdCBjb21wQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29tcC1ib2FyZCcpO1xuXG5jb25zdCBjcmVhdGVCb2FyZCA9ICguLi5wbGF5ZXJzKSA9PiB7XG4gIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgY29uc3QgdGhpc0JvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbXBCb2FyZDtcbiAgICBjb25zdCB7IHRpbGVzIH0gPSBwbGF5ZXIuYm9hcmQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBPYmplY3Qua2V5cyh0aWxlc1tpXSkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3QgYm9hcmRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGJvYXJkQ2VsbC5jbGFzc0xpc3QuYWRkKCdib2FyZC1jZWxsJyk7XG4gICAgICAgIGJvYXJkQ2VsbC5kYXRhc2V0LnggPSBpO1xuICAgICAgICBib2FyZENlbGwuZGF0YXNldC55ID0gajtcbiAgICAgICAgdGhpc0JvYXJkLmFwcGVuZENoaWxkKGJvYXJkQ2VsbCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbmNvbnN0IHJlbmRlclNoaXBzID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB7IHNoaXBzIH0gPSBwbGF5ZXIuYm9hcmQ7XG4gIGNvbnN0IGNvb3JkcyA9IHNoaXBzLm1hcCgoc2hpcCkgPT4gc2hpcC5jb29yZHMpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29vcmRzW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBbY29vcmRzW2ldW2pdWzBdLCBjb29yZHNbaV1bal1bMV1dO1xuICAgICAgY29uc3QgdGhpc0NlbGwgPSBwbGF5ZXJCb2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEteD0nJHt4fSddW2RhdGEteT0nJHt5fSddYFxuICAgICAgKTtcbiAgICAgIHRoaXNDZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHVwZGF0ZUJvYXJkID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB0aGlzQm9hcmQgPSBwbGF5ZXIuaXNIdW1hbiA/IHBsYXllckJvYXJkIDogY29tcEJvYXJkO1xuICBjb25zdCB7IHRpbGVzIH0gPSBwbGF5ZXIuYm9hcmQ7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IE9iamVjdC5rZXlzKHRpbGVzW2ldKS5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgdGhpc1RpbGUgPSB0aWxlc1tpXVtqXTtcbiAgICAgIGNvbnN0IGhhc1NoaXAgPSB0aGlzVGlsZS5zaGlwSWQgIT09IG51bGw7XG4gICAgICBpZiAodGhpc1RpbGUuaGl0KSB7XG4gICAgICAgIGNvbnN0IHRoaXNDZWxsID0gdGhpc0JvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgYFtkYXRhLXg9JyR7aX0nXVtkYXRhLXk9JyR7an0nXWBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGhhc1NoaXApIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB7IGNyZWF0ZUJvYXJkLCByZW5kZXJTaGlwcywgdXBkYXRlQm9hcmQgfTtcbiIsImltcG9ydCAqIGFzIGdhbWUgZnJvbSAnLi9nYW1lJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcblxuY29uc3QgaW5pdEJvYXJkRXZlbnRzID0gKCkgPT4ge1xuICBjb25zdCBwbGF5ZXJDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjb21wLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gIHBsYXllckNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IFtvcHBvbmVudCwgY29vcmRdID0gaGVscGVycy5nZXRDZWxsSW5mbyhlLnRhcmdldCk7XG4gICAgICBnYW1lLnJlY2VpdmVNb3ZlKG9wcG9uZW50LCBjb29yZCk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IHsgaW5pdEJvYXJkRXZlbnRzIH07XG4iLCJpbXBvcnQgcGxheWVyRmFjdG9yeSBmcm9tICcuL3BsYXllci1mYWN0b3J5JztcbmltcG9ydCAqIGFzIGRvbSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycydcblxuY29uc3QgcGxheWVycyA9IHtcbiAgcDE6IG51bGwsXG4gIGNvbTogbnVsbCxcbn07XG5cbmNvbnN0IHN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgcGxheWVycy5wMSA9IHBsYXllckZhY3RvcnkoJycsIDEsIHRydWUsIHRydWUpO1xuICBwbGF5ZXJzLmNvbSA9IHBsYXllckZhY3RvcnkoJycsIDIsIGZhbHNlLCBmYWxzZSk7XG4gIGRvbS5jcmVhdGVCb2FyZChwbGF5ZXJzLnAxLCBwbGF5ZXJzLmNvbSk7XG59XG5cbmNvbnN0IHJlY2VpdmVNb3ZlID0gKHRhcmdldCwgY29vcmQpID0+IHtcbiAgY29uc3QgcGxheWluZyA9ICh0YXJnZXQgPT09ICdwMScpID8gcGxheWVycy5jb20gOiBwbGF5ZXJzLnAxXG4gIGNvbnN0IGVuZW15ID0gcGxheWVyc1t0YXJnZXRdO1xuICBpZiAoaGVscGVycy5hbHJlYWR5UGxheWVkKHBsYXlpbmcsIGNvb3JkKSkgcmV0dXJuXG4gIHBsYXlpbmcubWFrZU1vdmUoY29vcmQsIGVuZW15LmJvYXJkKVxuICBkb20udXBkYXRlQm9hcmQoZW5lbXkpXG59XG5cbmV4cG9ydCB7IHN0YXJ0R2FtZSwgcmVjZWl2ZU1vdmUgfTtcbiIsImltcG9ydCBzaGlwRmFjdG9yeSBmcm9tICcuL3NoaXAtZmFjdG9yeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdhbWVCb2FyZEZhY3RvcnkoKSB7XG4gIGNvbnN0IGNyZWF0ZUJvYXJkID0gKCkgPT4ge1xuICAgIGNvbnN0IGdhbWVCb2FyZCA9IG5ldyBBcnJheSgxMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBnYW1lQm9hcmRbaV0gPSB7fTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBnYW1lQm9hcmRbaV1bal0gPSB7XG4gICAgICAgICAgaGl0OiBmYWxzZSxcbiAgICAgICAgICBzaGlwSWQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBnYW1lQm9hcmQ7XG4gIH07XG4gIC8vIGNvbnN0IG1pc3NlcyA9IFtdO1xuICBjb25zdCB0aWxlcyA9IGNyZWF0ZUJvYXJkKCk7XG4gIGNvbnN0IHNoaXBzID0gW107XG4gIGNvbnN0IHBsYWNlU2hpcCA9IChsZW5ndGgsIFt4LCB5XSwgYXhpcykgPT4ge1xuICAgIGNvbnN0IG5ld1NoaXAgPSBzaGlwRmFjdG9yeShzaGlwcy5sZW5ndGgsIGxlbmd0aCk7XG4gICAgc2hpcHMucHVzaChuZXdTaGlwKTtcbiAgICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgICAvLyBQbGFjZSBob3Jpem9udGFsbHlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBuZXdTaGlwLmNvb3Jkcy5wdXNoKFt4LCB5XSk7XG4gICAgICAgIHRpbGVzW3hdW3ldLnNoaXBJZCA9IG5ld1NoaXAuaWQ7XG4gICAgICAgIHggKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgICAgLy8gUGxhY2UgdmVydGljYWxseVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5ld1NoaXAuY29vcmRzLnB1c2goW3gsIHldKTtcbiAgICAgICAgdGlsZXNbeF1beV0uc2hpcElkID0gbmV3U2hpcC5pZDtcbiAgICAgICAgeSArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgaGFzU2hpcCA9ICh0aWxlKSA9PiB0aWxlLnNoaXBJZCAhPT0gbnVsbDtcbiAgY29uc3QgZmluZFNoaXAgPSAoaWQpID0+IHtcbiAgICBsZXQgdGhpc1NoaXA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNoaXBzW2ldLmlkID09PSBpZCkge1xuICAgICAgICB0aGlzU2hpcCA9IHNoaXBzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1NoaXA7XG4gIH07XG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAodGFyZ2V0KSA9PiB7XG4gICAgY29uc3QgW3gsIHldID0gdGFyZ2V0O1xuICAgIGNvbnN0IHRoaXNUaWxlID0gdGlsZXNbeF1beV07XG4gICAgaWYgKHRoaXNUaWxlLmhpdCkgcmV0dXJuO1xuICAgIFxuICAgIC8vIGlmICghaGFzU2hpcCh0aGlzVGlsZSkpIHtcbiAgICAvLyAgIG1pc3Nlcy5wdXNoKHRhcmdldCk7XG4gICAgLy8gfSBcbiAgICBpZiAoaGFzU2hpcCh0aGlzVGlsZSkpIHtcbiAgICAgIGNvbnN0IHRoaXNTaGlwID0gZmluZFNoaXAodGhpc1RpbGUuc2hpcElkKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpc1NoaXAuY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzU2hpcC5jb29yZHNbaV0uZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHRhcmdldFtpbmRleF0pXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXNTaGlwLmhlYWx0aFtpXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpc1RpbGUuaGl0ID0gdHJ1ZTtcbiAgfTtcbiAgY29uc3QgYWxsU2hpcHNTdW5rID0gKCkgPT4ge1xuICAgIGNvbnN0IHN1bmtTaGlwcyA9IHNoaXBzLmZpbHRlcigoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSA9PT0gdHJ1ZSk7XG4gICAgcmV0dXJuIHN1bmtTaGlwcy5sZW5ndGggPiAwO1xuICB9O1xuICByZXR1cm4geyB0aWxlcywgc2hpcHMsIHBsYWNlU2hpcCwgcmVjZWl2ZUF0dGFjaywgYWxsU2hpcHNTdW5rIH07XG59XG4iLCJjb25zdCBnZXRDZWxsSW5mbyA9ICh0YXJnZXRDZWxsKSA9PiB7XG4gIGNvbnN0IGNlbGxJbmZvID0gW1xuICAgIHRhcmdldENlbGwucGFyZW50Tm9kZS5kYXRhc2V0LmJvYXJkLFxuICAgIFtOdW1iZXIodGFyZ2V0Q2VsbC5kYXRhc2V0LngpLCBOdW1iZXIodGFyZ2V0Q2VsbC5kYXRhc2V0LnkpXSxcbiAgXTtcbiAgcmV0dXJuIGNlbGxJbmZvO1xufTtcblxuY29uc3QgYWxyZWFkeVBsYXllZCA9IChwbGF5aW5nLCB0YXJnZXQpID0+IHtcbiAgY29uc3QgcHJldmlvdXNNb3ZlcyA9IHBsYXlpbmcubW92ZXM7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNNb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwcmV2aW91c01vdmVzW2ldLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSB0YXJnZXRbaW5kZXhdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIGNvbnN0IGdldFR1cm4gPSAob2JqKSA9PiB7XG4vLyAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuXG4vLyAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuLy8gICAgIGNvbnN0IHBsYXllciA9IG9ialtrZXlzW2ldXTtcbi8vICAgICBpZiAocGxheWVyLnR1cm4gPT09IGZhbHNlKSB7XG4vLyAgICAgICByZXR1cm4gcGxheWVyXG4vLyAgICAgfVxuLy8gICB9XG4vLyB9O1xuXG5leHBvcnQgeyBnZXRDZWxsSW5mbywgYWxyZWFkeVBsYXllZCB9O1xuIiwiaW1wb3J0IGdhbWVCb2FyZEZhY3RvcnkgZnJvbSAnLi9nYW1lYm9hcmQtZmFjdG9yeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBsYXllckZhY3RvcnkobmFtZSwgbnVtLCBodW1hbiwgdHVybikge1xuICBjb25zdCBwbGF5ZXJOYW1lID0gbmFtZSA9PT0gJycgPyBgUGxheWVyICR7bnVtfWAgOiBuYW1lO1xuICBjb25zdCBnYW1lQm9hcmQgPSBnYW1lQm9hcmRGYWN0b3J5KCk7XG4gIGNvbnN0IG1vdmVzID0gW107XG4gIGNvbnN0IG1ha2VNb3ZlID0gKHRhcmdldCwgZW5lbXlCb2FyZCkgPT4ge1xuICAgIGVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayh0YXJnZXQpO1xuICAgIG1vdmVzLnB1c2godGFyZ2V0KTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGdldCBuYW1lKCkge1xuICAgICAgcmV0dXJuIHBsYXllck5hbWU7XG4gICAgfSxcbiAgICBnZXQgYm9hcmQoKSB7XG4gICAgICByZXR1cm4gZ2FtZUJvYXJkO1xuICAgIH0sXG4gICAgZ2V0IGlzSHVtYW4oKSB7XG4gICAgICByZXR1cm4gaHVtYW47XG4gICAgfSxcbiAgICBnZXQgdHVybigpIHtcbiAgICAgIHJldHVybiB0dXJuO1xuICAgIH0sXG4gICAgZ2V0IG1vdmVzKCkge1xuICAgICAgcmV0dXJuIG1vdmVzO1xuICAgIH0sXG4gICAgbWFrZU1vdmUsXG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGlwRmFjdG9yeShpZCwgbGVuZ3RoKSB7XG4gIGNvbnN0IGNyZWF0ZUhlYWx0aCA9IChzaXplKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBbLi4uQXJyYXkoc2l6ZSkua2V5cygpXTtcbiAgICBjb25zdCBoZWFsdGggPSBhcnJheS5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgIHByZXZbY3Vycl0gPSBmYWxzZTtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gaGVhbHRoO1xuICB9O1xuICBjb25zdCBjb29yZHMgPSBbXTtcbiAgY29uc3QgaGVhbHRoID0gY3JlYXRlSGVhbHRoKGxlbmd0aCk7XG4gIC8vIGhlYWx0aCA9IHsgd2hlcmUgYm9vbCByZXByZXNlbnRzIGhpdC9ubyBoaXRcbiAgLy8gICAwOiBmYWxzZSxcbiAgLy8gICAxOiBmYWxzZSxcbiAgLy8gICAyOiBmYWxzZSxcbiAgLy8gfVxuICBjb25zdCBoaXQgPSAoaW5kZXgpID0+IHtcbiAgICBoZWFsdGhbaW5kZXhdID0gdHJ1ZTtcbiAgfTtcbiAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGhlYWx0aCkuZXZlcnkoKGluZGV4KSA9PiBpbmRleCA9PT0gdHJ1ZSk7XG4gIH07XG4gIHJldHVybiB7XG4gICAgaWQsXG4gICAgbGVuZ3RoLFxuICAgIGhlYWx0aCxcbiAgICBjb29yZHMsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5pbXBvcnQgKiBhcyBnYW1lIGZyb20gJy4vbW9kdWxlcy9nYW1lJ1xuaW1wb3J0ICogYXMgZXZlbnRDb250cm9sbGVyIGZyb20gJy4vbW9kdWxlcy9ldmVudC1jb250cm9sbGVyJ1xuXG5nYW1lLnN0YXJ0R2FtZSgpO1xuZXZlbnRDb250cm9sbGVyLmluaXRCb2FyZEV2ZW50cygpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==