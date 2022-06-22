import shipFactory from '../modules/ship-factory';

test('health object & id of ship instance', () => {
  const ship = shipFactory(3, 10);
  expect(ship.id).toBe(10);
  expect(ship.health).toEqual({
    0: false,
    1: false,
    2: false,
  });
});

test('hit method', () => {
  const ship = shipFactory(3, 0);
  ship.hit(0);
  ship.hit(2);
  ship.hit(0);
  expect(ship.health).toEqual({
    0: true,
    1: false,
    2: true,
  });
});

test('isSunk method; case true', () => {
  const ship = shipFactory(3, 0);
  ship.hit(0);
  ship.hit(1);
  ship.hit(2);
  expect(ship.isSunk()).toBe(true);
})

test('isSunk method; case false', () => {
  const ship = shipFactory(3, 0);
  ship.hit(0);
  ship.hit(2);
  expect(ship.isSunk()).toBe(false);
})