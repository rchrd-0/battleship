const board = document.querySelector('#player-board');

const axes = {
  x: true,
  y: false,
  getAxis() {
    const keys = Object.keys(this);
    return keys.filter((key) => this[key] === true)[0];
  },
};

const switchAxis = () => {
  axes.x = !axes.x;
  axes.y = !axes.x;
};

const isWithinBounds = (cells, length) => {
  return cells.length === length;
};

const previewShip = (e, length = 5) => {
  if (e.target.classList.contains('board')) return;

  const { target } = e;
  const [x, y] = [Number(target.dataset.x), Number(target.dataset.y)];
  const shipCoords = [];
  const axis = axes.getAxis();

  if (axis === 'x') {
    for (let i = 0; i < length; i++) {
      // >9 = out of bounds
      if (i + x > 9) break;

      const nextCell = board.querySelector(
        `[data-x='${i + x}'][data-y='${y}']`
      );
      shipCoords.push(nextCell);
    }
  }
  if (axis === 'y') {
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
  cells.forEach((cell) => cell.classList.remove('ship-preview', 'invalid'));
};

export { switchAxis, previewShip, clearPreview };
