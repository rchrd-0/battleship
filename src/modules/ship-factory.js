export default function shipFactory(id, length) {
  const createHealth = (size) => {
    const array = [...Array(size).keys()];
    const health = array.reduce((prev, curr) => {
      prev[curr] = false;
      return prev;
    }, {});
    return health;
  };
  const coords = [];
  const health = createHealth(length);
  // health = { where bool represents hit/no hit
  //   0: false,
  //   1: false,
  //   2: false,
  // }
  const hit = (index) => {
    health[index] = true;
  };
  const isSunk = () => {
    return Object.values(health).every((index) => index === true);
  };
  return {
    id,
    length,
    health,
    coords,
    hit,
    isSunk,
  };
}
