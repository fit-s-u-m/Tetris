import * as PIXI from 'pixi.js'

class Tetris {
  constructor() {
    const I = [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]]
    const O = [[1, 1, 0], [1, 1, 0]]
    const T = [[0, 1, 0], [1, 1, 1]]
    const S = [[0, 1, 1], [1, 1, 0]]
    const Z = [[1, 1, 0], [0, 1, 1]]
    const J = [[1, 0, 0], [1, 1, 1]]
    const L = [[0, 0, 1], [1, 1, 1]]
    const tetrisGrid = { 0: I, 1: O, 2: T, 3: S, 4: Z, 5: J, 6: L }
    let rand = Math.floor(Math.random() * 7)
    this.tetris = tetrisGrid[rand] // choose random tetris
    this.tetrisDrawing = new PIXI.Container(); // create tetris container
  }
  showTetris(app, { x, y }, grid) {
    const cellSize = grid[1][0].x - grid[0][0].x
    const numRow = this.tetris.length
    // get pos from coordinate for starting point
    const gridX = grid[x][y].x
    const gridY = grid[x][y].y

    for (let i = 0; i < numRow; i++) { // for every row

      const numCol = this.tetris[i].length
      const tetrisYPos = gridY + i * cellSize

      for (let j = 0; j < numCol; j++) { // for every  column

        const tetrisXPos = gridX + j * cellSize

        if (this.tetris[i][j] == 1) { // if that tetris have value 1 
          const rect = new PIXI.Graphics()
            .rect(tetrisXPos, tetrisYPos, cellSize, cellSize)
            .fill(0x000000);
          this.tetrisDrawing.addChild(rect)
        }
      }
    }
    app.stage.addChild(this.tetrisDrawing);
  }
  rotate(angle) {
    this.tetrisDrawing.rotation = angle
  }
  moveDown(dt, speed) {
    this.tetrisDrawing.position.y += dt * speed
  }
}

class Grid {
  constructor({ x, y }, { width, height }, size) {
    this.grid = []
    this.position = { x: x - width / 2, y: y - height / 2 }
    this.width = width
    this.height = height
    this.size = size
  }

  createGrid() {
    const numCols = Math.floor(this.width / this.size)
    const numRows = Math.floor(this.height / this.size)
    const offset = {  // to center if the grid is not a perfect square
      x: this.width - numCols * this.size,
      y: this.height - numRows * this.size
    }

    for (let i = 0; i < numCols; i++) {
      this.grid[i] = []
      for (let j = 0; j < numRows; j++) {
        const x = this.position.x + (i * this.size) + offset.x / 2
        const y = this.position.y + (j * this.size) + offset.y / 2
        this.grid[i][j] = { x, y }
      }
    }
    return this.grid
  }

  showGrid(app) {
    const border = new PIXI.Graphics() // grid border
      .rect(this.position.x, this.position.y, this.width, this.height)
      .setStrokeStyle(5, 0xff0000, 1, 0)
      .stroke(0xff0000, 5)
    border.zIndex = 1  // show border on top
    app.stage.addChild(border)
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const rect = new PIXI.Graphics()
          .rect(this.grid[i][j].x, this.grid[i][j].y, this.size, this.size)
          .stroke(0x000000)
        app.stage.addChild(rect)
      }
    }
  }
}



const main = async () => {
  const app = new PIXI.Application()
  await app.init({
    background: '#00ffff',
    resizeTo: window
  })
  const gridSize = 50
  const grid = new Grid(
    { x: app.screen.width / 2, y: app.screen.height / 2 },
    { width: 500, height: 630 },
    gridSize,
  )
  const grids = grid.createGrid()
  const tetris = new Tetris()
  const tetris2 = new Tetris()

  grid.showGrid(app)

  tetris.showTetris(
    app,
    { x: 1, y: 0 },
    grids
  )
  tetris2.showTetris(
    app,
    { x: 4, y: 2 },
    grids
  )
  app.ticker.add(time => {
    tetris.moveDown(time.deltaTime, 0.1)
    tetris2.moveDown(time.deltaTime, 0.2)
  })
  document.body.appendChild(app.canvas);
}


main()

