import * as PIXI from 'pixi.js'

class Grid {
  constructor({ x, y }, { numRow, numCol }, maxHeight) {
    this.grid = []
    const margin = numCol / numRow // add a little margin propotional to the number of cols
    const size = (maxHeight / numRow) - margin

    const width = numCol * size
    const height = numRow * size
    this.position = { x: x - width / 2, y: y - height / 2 }
    this.numRow = numRow
    this.numCol = numCol
    this.size = size
  }

  create() {
    for (let i = 0; i < this.numCol; i++) {
      this.grid[i] = []
      for (let j = 0; j < this.numRow; j++) {
        const x = this.position.x + (i * this.size)
        const y = this.position.y + (j * this.size)
        this.grid[i][j] = { x, y }
      }
    }
    return this.grid
  }

  show() {
    const container = new PIXI.Container()
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const rect = new PIXI.Graphics()
          .rect(this.grid[i][j].x, this.grid[i][j].y, this.size, this.size)
          .stroke(0x000000)
        container.addChild(rect)
      }
    }
    return container
  }
}

class TetrominoFactory {
  static createShape(type) {
    type = type.toUpperCase()
    switch (type) {
      case "I":
        return {
          shape: [[1, 1, 1, 1]],
          color: "#FD3F59" // red
        }
      case 'O':
        return {
          shape: [[1, 1], [1, 1]],
          color: "#800080"  // purple
        }
      case 'T':
        return {
          shape: [[0, 1, 0], [1, 1, 1]],
          color: "#ffff00" // yellow
        }
      case 'S':
        return {
          shape: [[0, 1, 1], [1, 1, 0]],
          color: "#ff7f00" // orange
        }
      case 'Z':
        return {
          shape: [[1, 1, 0], [0, 1, 1]],
          color: "#00ffff" // cyan
        }
      case 'J':
        return {
          shape: [[1, 0, 0], [1, 1, 1]],
          color: "#7f7f7f" // gray
        }
      case 'L':
        return {
          shape: [[0, 0, 1], [1, 1, 1]],
          color: "#00ff00"
        }
      default:
        throw new Error('Unknown Tetromino type');
    }
  }
}

class Tetromino {
  constructor(shape, color, grid) {
    this.shape = shape;
    this.color = color;
    this.position = { x: 0, y: 0 };
    this.rotation = 0;
    this.speed = 2;
    this.cellSize = null;
    this.container = new PIXI.Container();
    this.grid = grid
  }
  show() {
    const cellSize = this.grid[1][0].x - this.grid[0][0].x
    this.cellSize = cellSize
    const numRow = this.shape.length
    // get pos from coordinate for starting point
    const gridX = this.grid[this.position.x][this.position.y].x
    const gridY = this.grid[this.position.x][this.position.y].y

    for (let i = 0; i < numRow; i++) { // for every row

      const numCol = this.shape[i].length
      const tetrominoYPos = gridY + i * cellSize

      for (let j = 0; j < numCol; j++) { // for every  column

        const tetrominoXPos = gridX + j * cellSize

        if (this.shape[i][j] == 1) {
          const rect = new PIXI.Graphics()
            .roundRect(tetrominoXPos, tetrominoYPos, cellSize, cellSize, 5)
            .fill(this.color)
            .stroke("#000");

          this.container.addChild(rect)
        }
      }
    }
    return this.container
  }
  updateContainer(shape = null, color = null) {
    if (shape && color) {
      this.shape = shape
      this.color = color
    }
    this.container.removeChildren()
    this.show()
  }


  rotate() {
    const newShape = this.shape[0].map((_, index) =>
      this.shape.map(row => row[index])
    ).reverse();
    this.updateContainer(newShape, this.color)
  }
  setPosition(x, y) {
    this.container.position = { x: x * this.cellSize, y: y * this.cellSize }
  }

  moveDown() {
    this.container.position.y += this.speed
  }
  moveLeft() {
    if (this.container.position.x >= this.cellSize)
      this.container.position.x -= this.cellSize;
  }

  moveRight() {
    if (this.container.position.x < (this.grid.length - this.shape[0].length) * this.cellSize)
      this.container.position.x += this.cellSize;
  }
}

// Game logic
class Game {
  constructor(mainGrid, sideGrid, app) {
    this.mainGrid = mainGrid;
    this.sideGrid = sideGrid;

    // array of the grid
    this.nowGrid = mainGrid.create();
    this.nextGrid = sideGrid.create();
    this.app = app;

    // create the shape
    const currentShape = TetrominoFactory.createShape(this.getRandomTetrominoType());
    const nextShape = TetrominoFactory.createShape(this.getRandomTetrominoType());

    // create the tetromino
    this.currentTetromino = new Tetromino(currentShape.shape, currentShape.color, this.nowGrid);
    this.nextTetromino = new Tetromino(nextShape.shape, nextShape.color, this.nextGrid);

    // not moving  tetromino after they fall
    this.staticTetrominoShape = []
    this.staticTetrominoContainer = new PIXI.Container()

    // stage everything
    this.app.stage.addChild(
      this.sideGrid.show(),
      this.mainGrid.show(),
      this.currentTetromino.show(),
      this.nextTetromino.show(),
      this.staticTetrominoContainer
    )
  }
  getRandomTetrominoType() {
    const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    return types[Math.floor(Math.random() * (types.length - 1))];
  }
  spawnNewTetromino() {
    this.currentTetromino.updateContainer(this.nextTetromino.shape, this.nextTetromino.color)
    this.currentTetromino.setPosition(0, 0)
    const nextShape = TetrominoFactory.createShape(this.getRandomTetrominoType());
    this.nextTetromino.updateContainer(nextShape.shape, nextShape.color)
  }
  tetrominoLanded() {
    const topRightCorner = this.nowGrid[0][0]
    const cellSize = this.nowGrid[1][0].x - this.nowGrid[0][0].x
    const gridHeight = cellSize * this.nowGrid[0].length
    const currentY = this.currentTetromino.container.getBounds().maxY
    const ground = topRightCorner.y + gridHeight

    if (currentY > ground || this.collidedWithStatic()) { // bottom
      return true
    }
    return false
  }
  drawStaticShapes(shape, pos, col, container) {
    const cellSize = this.nowGrid[1][0].x - this.nowGrid[0][0].x
    const numRow = shape.length

    const gridX = pos.minX
    const gridY = pos.minY

    for (let i = 0; i < numRow; i++) { // for every row

      const numCol = shape[i].length
      const tetrominoYPos = gridY + i * cellSize

      for (let j = 0; j < numCol; j++) { // for every  column

        const tetrominoXPos = gridX + j * cellSize

        if (shape[i][j] == 1) {
          const rect = new PIXI.Graphics()
            .roundRect(tetrominoXPos, tetrominoYPos, cellSize, cellSize, 5)
            .fill(col)
            .stroke("#000");

          container.addChild(rect)
        }
      }
    }
  }
  reDrawStatic() {
    this.staticTetrominoContainer.removeChildren()
    this.staticTetrominoShape.forEach(obj => {
      this.drawStaticShapes(obj.shape, obj.pos, obj.col, this.staticTetrominoContainer)
    })
  }
  collidedWithStatic() { //TODO
    for (let movingRect of this.currentTetromino.container.children) {
      for (let staticRect of this.staticTetrominoContainer.children) {
        const selfBound = movingRect.getBounds()
        const otherBound = staticRect.getBounds()
        const xOverlap = selfBound.maxX >= otherBound.minX && selfBound.minX <= otherBound.maxX
        const yOverlap = selfBound.maxY >= otherBound.minY && selfBound.minY <= otherBound.maxY
        if (yOverlap && xOverlap) {
          console.log("conlided")
          return true
        }
      }
    }
    return false
  }

  // Update the game state
  update() {
    this.currentTetromino.moveDown()
    if (this.tetrominoLanded()) {
      this.staticTetrominoShape.push({
        shape: this.currentTetromino.shape,
        pos: this.currentTetromino.container.getBounds(),
        col: this.currentTetromino.color
      })
      this.spawnNewTetromino()
    }
    this.reDrawStatic()
  }
}



class InputHandler {
  constructor(game) {
    this.game = game
    window.addEventListener('keydown', (event) => this.handleKeyDown(event));
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowLeft':
        this.game.currentTetromino.moveLeft();
        break;
      case 'ArrowRight':
        this.game.currentTetromino.moveRight();
        break;
      case 'ArrowDown':
        this.game.currentTetromino.moveDown();
        break;
      case 'ArrowUp':
        this.game.currentTetromino.rotate();
        break;
    }
  }
}
const main = async () => {
  const app = new PIXI.Application()
  await app.init({
    background: '#fff',
    resizeTo: window
  })
  const mainGrid = new Grid(
    { x: app.screen.width / 2, y: app.screen.height / 2 },
    { numRow: 15, numCol: 10 },
    window.innerHeight
  )
  const smallGrid = new Grid(
    { x: app.screen.width / 2 + 400, y: app.screen.height / 2 },
    { numRow: 4, numCol: 4 },
    150
  )
  const game = new Game(mainGrid, smallGrid, app)
  const inputHandler = new InputHandler(game)
  app.ticker.add(time => {
    game.update(time.deltaTime)
  })

  document.body.appendChild(app.canvas);
}
main()

