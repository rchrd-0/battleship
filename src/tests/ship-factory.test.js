import shipFactory from '../modules/ship-factory';

let ship;
beforeEach(() => {
  ship = shipFactory(10, 3);
})

test('health object & id of ship instance', () => {
  expect(ship.id).toBe(10);
  expect(ship.health).toEqual({
    0: false,
    1: false,
    2: false,
  });
});

test('hit method', () => {
  const ship = shipFactory(10, 3);
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
  ship.hit(0);
  ship.hit(1);
  ship.hit(2);
  expect(ship.isSunk()).toBe(true);
})

test('isSunk method; case false', () => {
  ship.hit(0);
  ship.hit(2);
  expect(ship.isSunk()).toBe(false);
})