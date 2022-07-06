import * as helpers from './helpers';

const board = document.querySelector('#player-board');

const axes = {
  x: true,
  y: false,
};

const getAxis = () => {
  const keys = Object.keys(axes);
  return keys.filter((key) => axes[key] === true)[0];
};

const switchAxis = () => {
  axes.x = !axes.x;
  axes.y = !axes.x;
};

const isValid = (coords, length) => {
  const isWithinBounds = coords.length === length;
  const noOverlap = coords.every((coord) => !coord.classList.contains('ship'));
  return isWithinBounds && noOverlap;
};

const previewShip = (e, length) => {
  if (e.target.classList.contains('board') || length === null) return;

  const [x, y] = helpers.getCellInfo(e.target);
  const shipCoords = [];
  const axis = getAxis();

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

  if (isValid(shipCoords, length)) {
    shipCoords.forEach((cell) => cell.classList.add('ship-preview'));
  } else {
    shipCoords.forEach((cell) => cell.classList.add('invalid'));
  }
};

const clearPreview = () => {
  const cells = board.querySelectorAll('.board-cell');
  cells.forEach((cell) => cell.classList.remove('ship-preview', 'invalid'));
};

const getPreview = () => [...board.querySelectorAll('.ship-preview')];

export { isValid, getAxis, switchAxis, previewShip, clearPreview, getPreview };
