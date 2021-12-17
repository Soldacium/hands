import * as THREE from "three";

type DirectionVector = [1, 0] | [0, 1] | [-1, 0] | [0, -1]; // eg. [-1,0] means next move is -1 on x axis (move left)

// ############# LOGIC ###############
// 1 - diemensional snake, because why not
const snake: number[] = []; // board arr position of each
const board: number[] = [];
let currentDirection: DirectionVector = [1, 0];
const boardSize = 10;
const boardSizeTotal = boardSize * boardSize;
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
    if (e.key === ("ArrowUp" || "w") && currentDirection[1] != -1) {
      currentDirection = [0, 1];
    } else if (e.key === ("ArrowDown" || "s") && currentDirection[1] != 1) {
      currentDirection = [0, -1];
    } else if (e.key === ("ArrowLeft" || "a") && currentDirection[0] != 1) {
      currentDirection = [-1, 0];
    } else if (e.key === ("ArrowRight" || "d") && currentDirection[0] != -1) {
      currentDirection = [1, 0];
    }
  });
};

// ############## 3D ANIMATION ###############
let board3d: THREE.InstancedMesh;
const dummy = new THREE.Object3D();

const create3dBoard = (scene: THREE.Scene) => {
  const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({
    color: "white",
  });

  board3d = new THREE.InstancedMesh(cubeGeo, material, boardSizeTotal);
  scene.add(board3d);

  for (let i = 0; i < board3d.count; i++) {}

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      dummy.position.y = i - boardSize;
      dummy.position.x = j - boardSize;
      dummy.updateMatrix();

      board3d.setMatrixAt(getBoardSquareNum(j, i), dummy.matrix);
    }
  }
};

// ########## EXPORTS ########
const setupGame = (scene: THREE.Scene) => {
  // setupKeyListeners();
  setupBoard();
  setupSnake();
  create3dBoard(scene);
};

export default { setupGame };
