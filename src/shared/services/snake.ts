import * as THREE from "three";

type DirectionVector = [1, 0] | [0, 1] | [-1, 0] | [0, -1]; // eg. [-1,0] means next move is -1 on x axis (move left)

// ############# LOGIC ###############
// 1 - diemensional snake, because why not
const snake: number[] = []; // board arr position of each
const board: number[] = [];
let currentDirection: DirectionVector = [1, 0];
const boardSize = 10;
const boardSizeTotal = boardSize * boardSize;
const snakeSpeed = 7;
const snakeColor = new THREE.Color("pink");
const boardColor = new THREE.Color("white");

let tail3d: {
  positionNum: number;
  positionCoords: [number, number];
  animationProgress: number;
};
let head3d: {
  positionNum: number;
  positionCoords: [number, number];
  animationProgress: number;
};

const setupBoard = () => {
  for (let i = 0; i < boardSize * boardSize; i++) {
    board.push(0);
  }
};

const setupSnake = () => {
  let i = 0;
  for (i = 0; i < 3; i++) {
    snake.push(getBoardSquareNum(i + 2, boardSize / 2));
  }

  for (i = 0; i < snake.length; i++) {
    board[snake[i]] = 1;
  }

  console.log(snake);
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
    if ((e.key === "ArrowUp" || e.key === "w") && currentDirection[1] != -1) {
      currentDirection = [0, 1];
    } else if (
      (e.key === "ArrowDown" || e.key === "s") &&
      currentDirection[1] != 1
    ) {
      currentDirection = [0, -1];
    } else if (
      (e.key === "ArrowLeft" || e.key === "a") &&
      currentDirection[0] != 1
    ) {
      currentDirection = [-1, 0];
    } else if (
      (e.key === "ArrowRight" || e.key === "d") &&
      currentDirection[0] != -1
    ) {
      currentDirection = [1, 0];
    }
  });
};

// ############## 3D ANIMATION ###############
let board3d: THREE.InstancedMesh;
const dummy = new THREE.Object3D();

const create3dBoard = (scene: THREE.Scene) => {
  const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: "white",
  });

  board3d = new THREE.InstancedMesh(cubeGeo, material, boardSizeTotal);

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      dummy.position.y = i - boardSize / 2 + 0.02 * i;
      dummy.position.x = j - boardSize / 2 + 0.02 * j;
      dummy.updateMatrix();

      board3d.setColorAt(getBoardSquareNum(j, i), boardColor);
      board3d.setMatrixAt(getBoardSquareNum(j, i), dummy.matrix);
    }
  }

  for (let i = 0; i < snake.length; i++) {
    const snakePartCoords = getBoardSquarePostion(snake[i]);
    dummy.position.x =
      snakePartCoords[0] - boardSize / 2 + 0.02 * snakePartCoords[0];
    dummy.position.y =
      snakePartCoords[1] - boardSize / 2 + 0.02 * snakePartCoords[1];
    dummy.position.z = 1;
    dummy.updateMatrix();
    board3d.setMatrixAt(snake[i], dummy.matrix);
    board3d.setColorAt(snake[i], snakeColor);
  }

  board3d.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(board3d);
};

// assuming we're animating only one head and tail at time
const animateHeadAndTail = () => {
  if (head3d.animationProgress <= 1 || tail3d.animationProgress <= 1) {
    // 1 = one animation ends, another starts, < 1 means animation wont finish before another starts
    const progressSpeed = 3 / snakeSpeed;
    head3d.animationProgress += progressSpeed;
    tail3d.animationProgress += progressSpeed;
    // head
    dummy.position.set(
      head3d.positionCoords[0] -
        boardSize / 2 +
        0.02 * head3d.positionCoords[0],
      head3d.positionCoords[1] -
        boardSize / 2 +
        0.02 * head3d.positionCoords[1],
      head3d.animationProgress / 2 // max 0.5
    );

    dummy.updateMatrix();
    board3d.setMatrixAt(head3d.positionNum, dummy.matrix);
    board3d.setColorAt(
      head3d.positionNum,
      getProgressColorHead(head3d.animationProgress)
    );

    // remove tail 3d
    dummy.position.set(
      tail3d.positionCoords[0] -
        boardSize / 2 +
        0.02 * tail3d.positionCoords[0],
      tail3d.positionCoords[1] -
        boardSize / 2 +
        0.02 * tail3d.positionCoords[1],
      0.5 - tail3d.animationProgress / 2
    );
    dummy.updateMatrix();
    board3d.setMatrixAt(tail3d.positionNum, dummy.matrix);
    board3d.setColorAt(
      tail3d.positionNum,
      getProgressColorTail(tail3d.animationProgress)
    );

    updateBoard();
  }
};

const getProgressColorHead = (progress: number): THREE.Color => {
  const brightness = Math.floor(progress * 255);
  //const rgb = `rbg(${brightness},${brightness},${brightness})`;
  return new THREE.Color(1 - progress, 1 - progress, 1 - progress);
};

const getProgressColorTail = (progress: number): THREE.Color => {
  const brightness = Math.floor(255 - progress * 255);
  //const rgb = `rbg(${brightness},${brightness},${brightness})`;
  return new THREE.Color(progress, progress, progress);
};

const updateBoard = () => {
  (board3d.instanceColor as THREE.InstancedBufferAttribute).needsUpdate = true;
  board3d.instanceMatrix.needsUpdate = true;
};

// ########## EXPORTS ########
const setupGame = (scene: THREE.Scene) => {
  setupKeyListeners();
  setupBoard();
  setupSnake();
  create3dBoard(scene);
};

const moveSnake = (time: number) => {
  if (time % snakeSpeed === 0) {
    const headCoords = getBoardSquarePostion(snake[snake.length - 1]);
    const newX = headCoords[0] + currentDirection[0];
    const newY = headCoords[1] + currentDirection[1];
    console.log(newX, newY);
    if (newX > boardSize - 1 || newX < 0 || newY > boardSize - 1 || newY < 0) {
      return;
    }
    const newHead = getBoardSquareNum(newX, newY);
    board[newHead] = 1;
    snake.push(newHead);
    const tail = snake.shift() as number;
    const [oldX, oldY] = getBoardSquarePostion(tail);
    board[tail] = 0; // shift returns

    // get head and tail ready for animation
    head3d = {
      positionNum: newHead,
      positionCoords: [newX, newY],
      animationProgress: 0,
    };

    tail3d = {
      positionNum: tail,
      positionCoords: [oldX, oldY],
      animationProgress: 0,
    };
    /*
    dummy.position.x = newX - boardSize / 2 + 0.02 * newX;
    dummy.position.y = newY - boardSize / 2 + 0.02 * newY;
    dummy.position.z = 0.5;
    dummy.updateMatrix();
    board3d.setMatrixAt(newHead, dummy.matrix);
    board3d.setColorAt(newHead, snakeColor);

    // remove tail 3d
    
    dummy.position.x = oldX - boardSize / 2 + 0.02 * oldX;
    dummy.position.y = oldY - boardSize / 2 + 0.02 * oldY;
    dummy.position.z = 0;
    dummy.updateMatrix();
    board3d.setMatrixAt(tail, dummy.matrix);
    board3d.setColorAt(tail, boardColor);

    updateBoard();
    */
  }
  if (head3d) {
    animateHeadAndTail();
  }
};

export default { setupGame, moveSnake };
