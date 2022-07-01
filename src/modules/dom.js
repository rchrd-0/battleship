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
};

const toggleEvents = () => compBoard.classList.toggle('no-events');

export { createBoard, renderShips, updateBoard, toggleEvents };
