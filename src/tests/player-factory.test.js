import playerFactory from '../modules/player-factory';

let enemy;
beforeEach(() => {
  enemy = playerFactory(2, true);
});

test('player makeMove => enemy receiveAttack', () => {
  const p1 = playerFactory(1, true);
  const enemyReceive = jest.spyOn(enemy.board, 'receiveAttack');

  p1.makeMove([0, 0], enemy.board);
  expect(enemy.board.tiles[0][0].hit).toBe(true);
  expect(enemy.board.tiles[0][1].hit).toBe(false);
  // expect(enemy.board.misses).toEqual(expect.arrayContaining([[0, 0]]));
  expect(enemyReceive).toHaveBeenCalledWith([0, 0]);
});

test('sink ship', () => {
  const p1 = playerFactory(1, true);
  enemy.board.placeShip(2, [0, 0], 'x');
  p1.makeMove([0, 0], enemy.board);
  p1.makeMove([1, 0], enemy.board);
  expect(enemy.board.allShipsSunk()).toBe(true);
});
