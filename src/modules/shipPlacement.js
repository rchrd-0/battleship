import * as helpers from './helpers';

const playerBoard = document.querySelector('#player-board');

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

const fillCoords = (start, length, axis, board) => {
  const [x, y] = start;
  const shipCoords = [];

  if (axis === 'x') {
    for (let i = 0; i < length; i++) {
      // >9 = out of bounds
      if (i + x > 9) break;
      const nextCell = board.querySelector(
        `[data-x='${i + x}'][data-y='${y}']`
      )
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

  return shipCoords;
}

const previewShip = (e, length) => {
  if (e.target.classList.contains('board') || length === null) return;

  const startingIndex = helpers.getCellInfo(e.target);
  const axis = getAxis();
  const shipCoords = fillCoords(startingIndex, length, axis, playerBoard);
  const valid = isValid(shipCoords, length);

  if (valid) {
    shipCoords.forEach((cell) => cell.classList.add('ship-preview'));
  } else {
    shipCoords.forEach((cell) => cell.classList.add('invalid'));
  }
};

const clearPreview = () => {
  const cells = playerBoard.querySelectorAll('.board-cell');
  cells.forEach((cell) => cell.classList.remove('ship-preview', 'invalid'));
};

const getPreview = () => [...playerBoard.querySelectorAll('.ship-preview')];

export { isValid, getAxis, switchAxis, previewShip, clearPreview, getPreview };
