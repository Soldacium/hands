type DirectionVector = [1, 0] | [0, 1] | [-1, 0] | [0, -1]; // eg. [-1,0] means next move is -1 on x axis (move left)

// 1 - diemensional snake, because why not
const snake: number[] = []; // board arr position of each
const board: number[] = [];
let currentDirection: DirectionVector = [1, 0];
const boardSize = 10;
const snakeSpeed = 1;

const setupBoard = () => {
  for (let i = 0; i < boardSize * boardSize; i++) {
    board.push(0);
  }
};

const setupSnake = () => {
  let i = 0;
  for (i = 0; i < 3; i++) {
    board[getBoardSquareNum(i + 2, boardSize / 2)];
  }
};

const moveSnake = () => {
  const headCoords = getBoardSquarePostion(snake[snake.length - 1]);
  const newX = headCoords[0] + currentDirection[0];
  const newY = headCoords[1] + currentDirection[1];
  if (newX > boardSize - 1 || newX < 0 || newY > boardSize - 1 || newY < 0) {
    console.log("kekw");
    return;
  }
  const newHead = getBoardSquareNum(newX, newY);
  board[newHead] = 1;
  snake.push(newHead);
  board[snake.shift() as number] = 0; // shift returns
};

const addFruitToBoard = () => {
  let fruitPos: number;
  do {
    fruitPos = Math.floor(Math.random() * Math.sqrt(boardSize));
  } while (snake.includes(fruitPos));

  board[fruitPos] = 2;
};

// square as in literal square
const getBoardSquareNum = (x: number, y: number): number => {
  [x, y] = [Math.floor(x), Math.floor(y)];
  return y * boardSize + x;
};

const getBoardSquarePostion = (n: number): [number, number] => {
  return [n % boardSize, (n - (n % boardSize)) / boardSize];
};

const setupKeyListeners = () => {
  // snake cant do a 180 deg turn at once
  window.addEventListener("keydown", (e) => {
    if (e.key === ("ArrowUp" || "w") && currentDirection !== [0, -1]) {
      currentDirection = [0, 1];
    } else if (e.key === ("ArrowDown" || "s") && currentDirection !== [0, 1]) {
      currentDirection = [0, -1];
    } else if (e.key === ("ArrowLeft" || "a") && currentDirection !== [1, 0]) {
      currentDirection = [-1, 0];
    } else if (
      e.key === ("ArrowRight" || "d") &&
      currentDirection !== [-1, 0]
    ) {
      currentDirection = [1, 0];
    }
  });
};
