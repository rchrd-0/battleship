const playerBoard = document.querySelector('#player-board');
const compBoard = document.querySelector('#comp-board');

const renderBoard = (player) => {
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
};

export { renderBoard };
