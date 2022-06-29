const getCellInfo = (targetCell) => {
  const cellInfo = [
    targetCell.parentNode.dataset.board,
    [Number(targetCell.dataset.x), Number(targetCell.dataset.y)],
  ];
  return cellInfo;
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

export { getCellInfo };
