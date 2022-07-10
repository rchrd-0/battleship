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

const hideShipCount = (bool) => {
  const shipCounters = document.querySelectorAll('.ship-counter');
  if (bool) {
    shipCounters.forEach((element) => element.classList.add('opacity-0'));
  } else {
    shipCounters.forEach((element) => element.classList.remove('opacity-0'));
  }
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

  const shipKeys = Object.keys(ships);
  shipKeys.forEach((key) => {
    const ship = ships[key];
    const { id } = ship;
    const { coords } = ship;
    for (let i = 0; i < coords.length; i++) {
      const [x, y] = coords[i];
      const thisCell = board.querySelector(`[data-x='${x}'][data-y='${y}']`);
      thisCell.classList.add('ship');
      thisCell.dataset.shipId = id;
    }
  });
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
      cell.removeAttribute('data-ship-id');
    });
  });
  players.forEach((player) => updateShipCount(player));
  styleGameOver(false);
};

const gameMessage = (state, numShips) => {
  const remainingShips = 5 - numShips;
  const messages = {
    setup: `Board setup ... ${remainingShips} ship(s) to place`,
    ready: 'Game ready to start',
    p1Turn: 'Player\'s turn',
    comTurn: 'thinking ...',
  };
  gameInfo.textContent = messages[state];
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

const toggleStart = (state) => {
  const startBtn = document.querySelector('#start-btn');

  if (state) {
    startBtn.setAttribute('disabled', '');
  } else {
    startBtn.removeAttribute('disabled');
  }
};

const readyGame = (length) => {
  if (length === 5) {
    toggleStart(false);
    gameMessage('ready');
  } else {
    toggleStart(true);
    gameMessage('setup', length);
  }
};

const disableBoardFuncs = (bool) => {
  const boardFuncs = document.querySelectorAll('.board-funcs');
  const buttonContainer = document.querySelector('#player-buttons');
  if (bool) {
    boardFuncs.forEach((button) => button.setAttribute('disabled', ''));
    buttonContainer.classList.add('opacity-0');
  } else {
    boardFuncs.forEach((button) => button.removeAttribute('disabled'));
    buttonContainer.classList.remove('opacity-0');
  }
};

export {
  createBoards,
  clearUI,
  renderShips,
  updateBoard,
  disableEvents,
  announceGameOver,
  toggleStart,
  readyGame,
  disableBoardFuncs,
  gameMessage,
  hideShipCount,
};
