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
export { previewShip };
