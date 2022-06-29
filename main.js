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
/* harmony export */   "renderBoard": () => (/* binding */ renderBoard),
/* harmony export */   "renderShips": () => (/* binding */ renderShips),
/* harmony export */   "updateBoard": () => (/* binding */ updateBoard)
/* harmony export */ });
const playerBoard = document.querySelector('#player-board');
const compBoard = document.querySelector('#comp-board');

const renderBoard = (...players) => {
  players.forEach(player => {
    const thisBoard = player.isHuman ? playerBoard : compBoard;
    const {tiles} = player.board;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < Object.keys(tiles[i]).length; j++) {
        const boardCell = document.createElement('div');
        boardCell.classList.add('board-cell');
        boardCell.dataset.x = i;
        boardCell.dataset.y = j;
        thisBoard.appendChild(boardCell);
      }
    }
  })
};

const renderShips = (player) => {
  const { ships } = player.board;
  const coords = ships.map((ship) => ship.coords);
  for (let i = 0; i < coords.length; i++) {
    for (let j = 0; j < coords[i].length; j++) {
      const [x, y] = [coords[i][j][0], coords[i][j][1]];
      const thisCell = playerBoard.querySelector(`[data-x='${x}'][data-y='${y}']`)
      thisCell.classList.add('ship');
    }
  }
};

const updateBoard = (player) => {
  const thisBoard = player.isHuman ? playerBoard : compBoard;
  const {tiles} = player.board;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < Object.keys(tiles[i]).length; j++) {
      if (tiles[i][j].hit) {
        const thisCell = thisBoard.querySelector(`[data-x='${i}'][data-y='${j}']`)
        thisCell.classList.add('hit')
      }
    }
  }
}




/***/ }),

/***/ "./src/modules/game.js":
/*!*****************************!*\
  !*** ./src/modules/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "players": () => (/* binding */ players),
/* harmony export */   "startGame": () => (/* binding */ startGame)
/* harmony export */ });
/* harmony import */ var _player_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player-factory */ "./src/modules/player-factory.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/modules/dom.js");



const players = {
  p1: null,
  com: null,
};

function startGame() {
  players.p1 = (0,_player_factory__WEBPACK_IMPORTED_MODULE_0__["default"])('', 1, true);
  players.com = (0,_player_factory__WEBPACK_IMPORTED_MODULE_0__["default"])('', 2, false);
  _dom__WEBPACK_IMPORTED_MODULE_1__.renderBoard(players.p1, players.com);
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
  const misses = [];
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
    if (!hasShip(thisTile)) {
      misses.push(target);
    } else if (hasShip(thisTile)) {
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
  return { tiles, misses, ships, placeShip, receiveAttack, allShipsSunk };
}


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


function playerFactory(name, num, human) {
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



_modules_game__WEBPACK_IMPORTED_MODULE_1__.startGame();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLG9CQUFvQixrQkFBa0I7QUFDdEMsc0JBQXNCLGtDQUFrQztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBLFVBQVUsUUFBUTtBQUNsQjtBQUNBLGtCQUFrQixtQkFBbUI7QUFDckMsb0JBQW9CLHNCQUFzQjtBQUMxQztBQUNBLDZEQUE2RCxFQUFFLGFBQWEsRUFBRTtBQUM5RTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUyxPQUFPO0FBQ2hCLGtCQUFrQixrQkFBa0I7QUFDcEMsb0JBQW9CLGtDQUFrQztBQUN0RDtBQUNBLDZEQUE2RCxFQUFFLGFBQWEsRUFBRTtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVpRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUNKO0FBQ2pCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsMkRBQWE7QUFDNUIsZ0JBQWdCLDJEQUFhO0FBQzdCLEVBQUUsNkNBQWU7QUFDakI7O0FBRThCOzs7Ozs7Ozs7Ozs7Ozs7O0FDZFc7O0FBRTFCO0FBQ2Y7QUFDQTtBQUNBLG9CQUFvQixRQUFRO0FBQzVCO0FBQ0Esc0JBQXNCLFFBQVE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHlEQUFXO0FBQy9CO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixvQkFBb0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isb0JBQW9CO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixrQkFBa0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0Esc0JBQXNCLDRCQUE0QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7Ozs7Ozs7Ozs7Ozs7OztBQ3hFbUQ7O0FBRXBDO0FBQ2YsNkNBQTZDLElBQUk7QUFDakQsb0JBQW9CLDhEQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN2QmU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxJQUFJO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUM5QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOcUI7QUFDaUI7O0FBRXRDLG9EQUFjLEciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZG9tLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lYm9hcmQtZmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXAtZmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKTtcbmNvbnN0IGNvbXBCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb21wLWJvYXJkJyk7XG5cbmNvbnN0IHJlbmRlckJvYXJkID0gKC4uLnBsYXllcnMpID0+IHtcbiAgcGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgY29uc3QgdGhpc0JvYXJkID0gcGxheWVyLmlzSHVtYW4gPyBwbGF5ZXJCb2FyZCA6IGNvbXBCb2FyZDtcbiAgICBjb25zdCB7dGlsZXN9ID0gcGxheWVyLmJvYXJkO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgT2JqZWN0LmtleXModGlsZXNbaV0pLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGJvYXJkQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBib2FyZENlbGwuY2xhc3NMaXN0LmFkZCgnYm9hcmQtY2VsbCcpO1xuICAgICAgICBib2FyZENlbGwuZGF0YXNldC54ID0gaTtcbiAgICAgICAgYm9hcmRDZWxsLmRhdGFzZXQueSA9IGo7XG4gICAgICAgIHRoaXNCb2FyZC5hcHBlbmRDaGlsZChib2FyZENlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfSlcbn07XG5cbmNvbnN0IHJlbmRlclNoaXBzID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB7IHNoaXBzIH0gPSBwbGF5ZXIuYm9hcmQ7XG4gIGNvbnN0IGNvb3JkcyA9IHNoaXBzLm1hcCgoc2hpcCkgPT4gc2hpcC5jb29yZHMpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29vcmRzW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBbY29vcmRzW2ldW2pdWzBdLCBjb29yZHNbaV1bal1bMV1dO1xuICAgICAgY29uc3QgdGhpc0NlbGwgPSBwbGF5ZXJCb2FyZC5xdWVyeVNlbGVjdG9yKGBbZGF0YS14PScke3h9J11bZGF0YS15PScke3l9J11gKVxuICAgICAgdGhpc0NlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgdXBkYXRlQm9hcmQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNCb2FyZCA9IHBsYXllci5pc0h1bWFuID8gcGxheWVyQm9hcmQgOiBjb21wQm9hcmQ7XG4gIGNvbnN0IHt0aWxlc30gPSBwbGF5ZXIuYm9hcmQ7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IE9iamVjdC5rZXlzKHRpbGVzW2ldKS5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKHRpbGVzW2ldW2pdLmhpdCkge1xuICAgICAgICBjb25zdCB0aGlzQ2VsbCA9IHRoaXNCb2FyZC5xdWVyeVNlbGVjdG9yKGBbZGF0YS14PScke2l9J11bZGF0YS15PScke2p9J11gKVxuICAgICAgICB0aGlzQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyByZW5kZXJCb2FyZCwgcmVuZGVyU2hpcHMsIHVwZGF0ZUJvYXJkIH07XG4iLCJpbXBvcnQgcGxheWVyRmFjdG9yeSBmcm9tICcuL3BsYXllci1mYWN0b3J5JztcbmltcG9ydCAqIGFzIGRvbSBmcm9tICcuL2RvbSdcblxuY29uc3QgcGxheWVycyA9IHtcbiAgcDE6IG51bGwsXG4gIGNvbTogbnVsbCxcbn07XG5cbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgcGxheWVycy5wMSA9IHBsYXllckZhY3RvcnkoJycsIDEsIHRydWUpO1xuICBwbGF5ZXJzLmNvbSA9IHBsYXllckZhY3RvcnkoJycsIDIsIGZhbHNlKTtcbiAgZG9tLnJlbmRlckJvYXJkKHBsYXllcnMucDEsIHBsYXllcnMuY29tKTtcbn1cblxuZXhwb3J0IHsgcGxheWVycywgc3RhcnRHYW1lIH07XG4iLCJpbXBvcnQgc2hpcEZhY3RvcnkgZnJvbSAnLi9zaGlwLWZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnYW1lQm9hcmRGYWN0b3J5KCkge1xuICBjb25zdCBjcmVhdGVCb2FyZCA9ICgpID0+IHtcbiAgICBjb25zdCBnYW1lQm9hcmQgPSBuZXcgQXJyYXkoMTApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZ2FtZUJvYXJkW2ldID0ge307XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgZ2FtZUJvYXJkW2ldW2pdID0ge1xuICAgICAgICAgIGhpdDogZmFsc2UsXG4gICAgICAgICAgc2hpcElkOiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2FtZUJvYXJkO1xuICB9O1xuICBjb25zdCBtaXNzZXMgPSBbXTtcbiAgY29uc3QgdGlsZXMgPSBjcmVhdGVCb2FyZCgpO1xuICBjb25zdCBzaGlwcyA9IFtdO1xuICBjb25zdCBwbGFjZVNoaXAgPSAobGVuZ3RoLCBbeCwgeV0sIGF4aXMpID0+IHtcbiAgICBjb25zdCBuZXdTaGlwID0gc2hpcEZhY3Rvcnkoc2hpcHMubGVuZ3RoLCBsZW5ndGgpO1xuICAgIHNoaXBzLnB1c2gobmV3U2hpcCk7XG4gICAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgICAgLy8gUGxhY2UgaG9yaXpvbnRhbGx5XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1NoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmV3U2hpcC5jb29yZHMucHVzaChbeCwgeV0pO1xuICAgICAgICB0aWxlc1t4XVt5XS5zaGlwSWQgPSBuZXdTaGlwLmlkO1xuICAgICAgICB4ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChheGlzID09PSAneScpIHtcbiAgICAgIC8vIFBsYWNlIHZlcnRpY2FsbHlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBuZXdTaGlwLmNvb3Jkcy5wdXNoKFt4LCB5XSk7XG4gICAgICAgIHRpbGVzW3hdW3ldLnNoaXBJZCA9IG5ld1NoaXAuaWQ7XG4gICAgICAgIHkgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IGhhc1NoaXAgPSAodGlsZSkgPT4gdGlsZS5zaGlwSWQgIT09IG51bGw7XG4gIGNvbnN0IGZpbmRTaGlwID0gKGlkKSA9PiB7XG4gICAgbGV0IHRoaXNTaGlwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzaGlwc1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgdGhpc1NoaXAgPSBzaGlwc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNTaGlwO1xuICB9O1xuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKHRhcmdldCkgPT4ge1xuICAgIGNvbnN0IFt4LCB5XSA9IHRhcmdldDtcbiAgICBjb25zdCB0aGlzVGlsZSA9IHRpbGVzW3hdW3ldO1xuICAgIGlmICh0aGlzVGlsZS5oaXQpIHJldHVybjtcbiAgICBpZiAoIWhhc1NoaXAodGhpc1RpbGUpKSB7XG4gICAgICBtaXNzZXMucHVzaCh0YXJnZXQpO1xuICAgIH0gZWxzZSBpZiAoaGFzU2hpcCh0aGlzVGlsZSkpIHtcbiAgICAgIGNvbnN0IHRoaXNTaGlwID0gZmluZFNoaXAodGhpc1RpbGUuc2hpcElkKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpc1NoaXAuY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzU2hpcC5jb29yZHNbaV0uZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHRhcmdldFtpbmRleF0pXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXNTaGlwLmhlYWx0aFtpXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpc1RpbGUuaGl0ID0gdHJ1ZTtcbiAgfTtcbiAgY29uc3QgYWxsU2hpcHNTdW5rID0gKCkgPT4ge1xuICAgIGNvbnN0IHN1bmtTaGlwcyA9IHNoaXBzLmZpbHRlcigoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSA9PT0gdHJ1ZSk7XG4gICAgcmV0dXJuIHN1bmtTaGlwcy5sZW5ndGggPiAwO1xuICB9O1xuICByZXR1cm4geyB0aWxlcywgbWlzc2VzLCBzaGlwcywgcGxhY2VTaGlwLCByZWNlaXZlQXR0YWNrLCBhbGxTaGlwc1N1bmsgfTtcbn1cbiIsImltcG9ydCBnYW1lQm9hcmRGYWN0b3J5IGZyb20gJy4vZ2FtZWJvYXJkLWZhY3RvcnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbGF5ZXJGYWN0b3J5KG5hbWUsIG51bSwgaHVtYW4pIHtcbiAgY29uc3QgcGxheWVyTmFtZSA9IG5hbWUgPT09ICcnID8gYFBsYXllciAke251bX1gIDogbmFtZTtcbiAgY29uc3QgZ2FtZUJvYXJkID0gZ2FtZUJvYXJkRmFjdG9yeSgpO1xuICBjb25zdCBtb3ZlcyA9IFtdO1xuICBjb25zdCBtYWtlTW92ZSA9ICh0YXJnZXQsIGVuZW15Qm9hcmQpID0+IHtcbiAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2sodGFyZ2V0KTtcbiAgICBtb3Zlcy5wdXNoKHRhcmdldCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgIHJldHVybiBwbGF5ZXJOYW1lO1xuICAgIH0sXG4gICAgZ2V0IGJvYXJkKCkge1xuICAgICAgcmV0dXJuIGdhbWVCb2FyZDtcbiAgICB9LFxuICAgIGdldCBpc0h1bWFuKCkge1xuICAgICAgcmV0dXJuIGh1bWFuO1xuICAgIH0sXG4gICAgbWFrZU1vdmUsXG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGlwRmFjdG9yeShpZCwgbGVuZ3RoKSB7XG4gIGNvbnN0IGNyZWF0ZUhlYWx0aCA9IChzaXplKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBbLi4uQXJyYXkoc2l6ZSkua2V5cygpXTtcbiAgICBjb25zdCBoZWFsdGggPSBhcnJheS5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgIHByZXZbY3Vycl0gPSBmYWxzZTtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gaGVhbHRoO1xuICB9O1xuICBjb25zdCBjb29yZHMgPSBbXTtcbiAgY29uc3QgaGVhbHRoID0gY3JlYXRlSGVhbHRoKGxlbmd0aCk7XG4gIC8vIGhlYWx0aCA9IHsgd2hlcmUgYm9vbCByZXByZXNlbnRzIGhpdC9ubyBoaXRcbiAgLy8gICAwOiBmYWxzZSxcbiAgLy8gICAxOiBmYWxzZSxcbiAgLy8gICAyOiBmYWxzZSxcbiAgLy8gfVxuICBjb25zdCBoaXQgPSAoaW5kZXgpID0+IHtcbiAgICBoZWFsdGhbaW5kZXhdID0gdHJ1ZTtcbiAgfTtcbiAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGhlYWx0aCkuZXZlcnkoKGluZGV4KSA9PiBpbmRleCA9PT0gdHJ1ZSk7XG4gIH07XG4gIHJldHVybiB7XG4gICAgaWQsXG4gICAgbGVuZ3RoLFxuICAgIGhlYWx0aCxcbiAgICBjb29yZHMsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5pbXBvcnQgKiBhcyBnYW1lIGZyb20gJy4vbW9kdWxlcy9nYW1lJ1xuXG5nYW1lLnN0YXJ0R2FtZSgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==