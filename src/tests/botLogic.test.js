// import * as botLogic from '../modules/botLogic';

// test('validate whether ship will fit within 10x10 grid', () => {
//   expect(botLogic.shipFits(5, 'x', [0, 0])).toBe(true);
//   expect(botLogic.shipFits(5, 'x', [5, 0])).toBe(true);
//   expect(botLogic.shipFits(5, 'x', [6, 0])).toBe(false);

//   expect(botLogic.shipFits(3, 'y', [0, 0])).toBe(true);
//   expect(botLogic.shipFits(3, 'y', [0, 7])).toBe(true);
//   expect(botLogic.shipFits(3, 'y', [0, 8])).toBe(false);
// });

// test('build ship', () => {
//   expect(botLogic.buildShip([0, 0], 'x', 5)).toEqual(
//     expect.arrayContaining([
//       [0, 0],
//       [1, 0],
//       [2, 0],
//       [3, 0],
//       [4, 0],
//     ])
//   );
//   expect(botLogic.buildShip([3, 5], 'y', 4)).toEqual(
//     expect.arrayContaining([
//       [3, 5],
//       [3, 6],
//       [3, 7],
//       [3, 8],
//     ])
//   );
// });
