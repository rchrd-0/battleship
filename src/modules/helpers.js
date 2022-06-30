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

export { getCellInfo, alreadyPlayed };
