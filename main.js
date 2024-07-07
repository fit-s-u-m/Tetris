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
    const tetrisGrid = {
      0: { val: I, color: "#ff0000" },
      1: { val: O, color: "#00ff00" },
      2: { val: T, color: "#0000ff" },
      3: { val: S, color: "#00ffff" },
      4: { val: Z, color: "#ffff00" },
      5: { val: J, color: "#ff00ff" },
      6: { val: L, color: "#000000" }
    }
    this.tetris = {
      now: null,
      next: null
    }

    let rand1 = Math.floor(Math.random() * 7)
    let rand2 = Math.floor(Math.random() * 7)
    // choose random tetris
    this.tetris.now = tetrisGrid[rand1]
    this.tetris.next = tetrisGrid[rand2]
    this.tetrisDrawing = new PIXI.Container(); // create tetris container
  }
  showTetris(app, { x, y }, grid) {
    const cellSize = grid[1][0].x - grid[0][0].x
    const tetris_now = this.tetris.now
    const numRow = tetris_now.val.length
    // get pos from coordinate for starting point
    const gridX = grid[x][y].x
    const gridY = grid[x][y].y

    for (let i = 0; i < numRow; i++) { // for every row

      const numCol = tetris_now.val[i].length
      const tetrisYPos = gridY + i * cellSize

      for (let j = 0; j < numCol; j++) { // for every  column

        const tetrisXPos = gridX + j * cellSize

        if (tetris_now.val[i][j] == 1) { // if that tetris have value 1 
          const rect = new PIXI.Graphics()
            .rect(tetrisXPos, tetrisYPos, cellSize, cellSize)
            .fill(tetris_now.color);
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
  collidedWith(tetris) { //TODO
    return  // return if collided 
  }
}

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

  createGrid() {
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
    { numRow: 4, numCol: 3 },
    150
  )
  const nowGrid = mainGrid.createGrid()
  const nextGrid = smallGrid.createGrid()

  const now = new Tetris()
  const next = new Tetris()

  mainGrid.showGrid(app)
  smallGrid.showGrid(app)


  now.showTetris(
    app,
    { x: 1, y: 0 }, // position in the grid
    nowGrid
  )
  next.showTetris(
    app,
    { x: 0, y: 0 },
    nextGrid
  )
  app.ticker.add(time => {
    now.moveDown(time.deltaTime, 0.1)
  })
  document.body.appendChild(app.canvas);
}
main()

