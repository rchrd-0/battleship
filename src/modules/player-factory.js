import gameBoardFactory from './gameboard-factory';

export default function playerFactory(name, num, human) {
  const playerName = name === '' ? `Player ${num}` : name;
  const gameBoard = gameBoardFactory();
  const moves = [];
  const makeMove = (target, enemyBoard) => {
    enemyBoard.receiveAttack(target);
    moves.push(target);
  };

  return {
    get name() {
      return playerName;
    },
    get board() {
      return gameBoard;
    },
    get isHuman() {
      return human;
    },
    makeMove,
  };
}
