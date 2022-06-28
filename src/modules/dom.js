const playerBoard = document.querySelector('#player-board');
const compBoard = document.querySelector('#comp-board');

const renderBoard = (...players) => {
  players.forEach(player => {
    const thisBoard = player.isHuman ? playerBoard : compBoard;
    const boardObj = player.board.gameBoard;
    for (let i = 0; i < boardObj.length; i++) {
      for (let j = 0; j < Object.keys(boardObj[i]).length; j++) {
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

export { renderBoard, renderShips };
