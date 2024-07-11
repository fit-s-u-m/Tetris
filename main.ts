import * as PIXI from "pixi.js"

abstract class Block implements EventObserver {
	id: number
	rotationState: 0 | 1 | 2 | 3 = 0
	orientation: { x: number, y: number }[][] = []
	readonly container: PIXI.Container = new PIXI.Container()
	private renderer: Renderer
	speed: number
	grid: Grid
	stage(renderer: Renderer) {
		this.renderer = renderer
		renderer.stage(this.container)
		this.speed = 4
	}

	showBlock(grid: Grid) {
		this.grid = grid
		this.orientation[this.rotationState]
			.forEach(pos => {
				this.container.addChild(
					this.renderer.
						drawSquare(
							grid.position.x + (pos.x * grid.cellSize),
							grid.position.y + (pos.y * grid.cellSize),
							grid.cellSize,
							this.id))
			})
	}
	redraw() {
		this.container.removeChildren()
		this.showBlock(this.grid)
	}
	coordinate(grid: Grid) {
		const blockCoord: { x: number, y: number } = {
			x: 0,
			y: Math.floor(this.container.getBounds().minY / grid.cellSize)
		}
		return blockCoord
	}


	moveDown() {
		this.container.y += this.speed
	}
	moveLeft() {
		if (this.container.getBounds().minX > this.grid.container.getBounds().minX && !this.grid.blockLanded(this)) {
			this.container.x -= this.grid.cellSize
		}
	}
	moveRight() {
		if (this.container.getBounds().maxX < this.grid.container.getBounds().maxX && !this.grid.blockLanded(this)) {
			this.container.x += this.grid.cellSize
		}
	}
	moveUp() {
		this.rotateCW()
	}
	rotateCCW() {
		if (this.rotationState == 0)
			this.rotationState = 3
		else
			this.rotationState--
		this.redraw()
	}
	rotateCW() {
		if (this.rotationState == 3)
			this.rotationState = 0
		else
			this.rotationState++
		if (this.grid.blockLanded(this)) { // if it collide after rotation
			this.rotateCCW() // undo
		}
		else {
			this.redraw()
		}
	}
	update(data: any, event: string) {
		if (event == "resize") {
			this.container.position.set(
				0, 0
			)
			this.redraw()
		}
		else if (event == "keyboard") {
			switch (data) {
				case "ArrowUp":
					this.rotateCW()
					break
				case "ArrowDown":
					this.speed = 5
					break
				case "ArrowRight":
					this.moveRight()
					break
				case "ArrowLeft":
					this.moveLeft()
					break
			}
		}
	}
}

class TetrominoFactory {
	static createRandomBlock() {
		const randomNum = Math.ceil(Math.random() * 7)
		switch (randomNum) {
			case 1:
				return new IBlock()
			case 2:
				return new TBlock()
			case 3:
				return new JBlock()
			case 4:
				return new LBlock()
			case 5:
				return new SBlock()
			case 6:
				return new ZBlock()
			case 7:
				return new OBlock()
			default:
				throw new Error(`can't create ${randomNum} as a block`)
		}
	}
}

class Renderer {
	private app: PIXI.Application
	private color: string[]
	constructor(app: PIXI.Application) {
		this.app = app
		this.color = [
			"#FFFFFF",
			"#FD3F59",
			"#800080",
			"#ffff00",
			"#ff7f00",
			"#00ffff",
			"#7f7f7f",
			"#00A200"
		]
	}
	drawSquare(x: number, y: number, s: number, c: number): PIXI.Graphics {
		return new PIXI.Graphics()
			.roundRect(x, y, s, s, 2)
			.fill(this.color[c])
			.stroke("#000")
	}
	stage(drawing: PIXI.Graphics | PIXI.Container): void {
		this.app.stage.addChild(drawing)
	}
}
interface EventObserver {
	update(data: any, event: string): void
}
class EventListener {
	private resizeObservers: EventObserver[] = []
	private keyboardObservers: EventObserver[] = []

	addEventObserver(observer: EventObserver, event: string): void {
		if (event == "resize")
			this.resizeObservers.push(observer)
		else if (event == "keyboard")
			this.keyboardObservers.push(observer)
		else
			new Error(`Error ${event} has no observer`)
	}
	removeEventObserver(observer: EventObserver, event: string): void {
		if (event == "resize")
			this.resizeObservers = this.resizeObservers.filter(obs => obs != observer)
		else if (event == "keyboard")
			this.keyboardObservers = this.keyboardObservers.filter(obs => obs != observer)
		else
			new Error(`Error ${event} has no observer`)
	}
	notifyEventObserver(data: any, event: string): void {
		if (event == "resize")
			this.resizeObservers.forEach(obs => obs.update(data, "resize"))
		else if (event == "keyboard")
			this.keyboardObservers.forEach(obs => obs.update(data, "keyboard"))
		else
			new Error(`Error ${event} has no observer`)
	}
}


class Grid implements EventObserver {
	numRow: number
	numCol: number
	cellSize: number
	grid: number[][]
	position: { x: number, y: number }
	fracPosition: { x: number, y: number }
	fracMaxHeight: number
	container: PIXI.Container
	renderer: Renderer

	constructor({ x, y }: { x: number, y: number }, maxHeight: number, numRow: number, numCol: number, renderer: Renderer) {
		this.numRow = numRow;
		this.numCol = numCol;
		const margin = numCol / numRow
		this.fracMaxHeight = maxHeight
		this.cellSize = (maxHeight * window.innerHeight - margin) / numCol

		this.init()
		this.renderer = renderer


		this.fracPosition = { x, y }
		const xpos = x * window.innerWidth - (this.numRow * this.cellSize) / 2
		const ypos = y * window.innerHeight
		this.position = { x: xpos, y: ypos }
		this.container = new PIXI.Container()
		this.renderer.stage(this.container)
	}
	init() {
		this.grid = [...Array(this.numRow)]
			.map(_ => Array(this.numCol).fill(0))
	}
	show() {
		for (const [rowIndex, row] of this.grid.entries()) {
			for (const [colIndex, val] of row.entries()) {
				const square = this.renderer
					.drawSquare(
						rowIndex * this.cellSize + this.position.x,
						colIndex * this.cellSize + this.position.y,
						this.cellSize,
						val)
				this.container.addChild(square)
			}
		}
	}
	redraw() {
		this.container.removeChildren()
		this.show()
	}
	update(data: any, event: string) {
		if (event == "resize") {
			const margin = this.numCol / this.numRow
			this.cellSize = (this.fracMaxHeight * data.h - margin) / this.numCol

			const xpos = this.fracPosition.x * data.w - (this.numRow * this.cellSize) / 2
			const ypos = this.fracPosition.y * data.h
			this.position = { x: xpos, y: ypos }
			this.redraw()
		}
	}
	putOnGrid(block: Block) {
		const boundingBox = block.coordinate(this)
		const blockShape = block.orientation[block.rotationState]
		blockShape.forEach(pos => {
			this.grid[pos.x + boundingBox.x][pos.y + boundingBox.y + 1] = block.id
		})
		this.redraw()
	}

	blockLanded(block: Block) {
		const margin = this.numCol / this.numRow
		if (block.container.getBounds().maxY >= this.container.getBounds().maxY - margin) {
			return true
		}
		return false
	}
	checkIfRowIsFull() {
		let fulls: number[] = []
		for (const [rowIndex, row] of this.grid.entries()) {
			let isFull = true
			for (const col of row) {
				if (col == 0)
					isFull = false
			}
			if (isFull) {
				fulls.push(rowIndex)
			}

		}
	}
}





const eventListener = new EventListener()
window.addEventListener('resize', (_event) => {
	const xdata = window.innerWidth
	const ydata = window.innerHeight
	const data = { w: xdata, h: ydata }
	eventListener.notifyEventObserver(data, "resize")
});

window.addEventListener('keydown', (event) => {
	const data = event.key
	eventListener.notifyEventObserver(data, "keyboard")
});



async function main(): Promise<void> {
	const app = new PIXI.Application()
	await app.init({ background: "#fff", resizeTo: window })

	const renderer: Renderer = new Renderer(app)

	const mainGrid: Grid = new Grid({ x: 0.5, y: 0 }, 1, 10, 20, renderer)
	const sideGrid: Grid = new Grid({ x: 0.9, y: 0.5 }, 0.25, 4, 4, renderer)

	let currentBlock: Block = TetrominoFactory.createRandomBlock()
	let nextBlock: Block = TetrominoFactory.createRandomBlock()

	currentBlock.stage(renderer)
	nextBlock.stage(renderer)


	currentBlock.showBlock(mainGrid)
	nextBlock.showBlock(sideGrid)


	mainGrid.show()
	sideGrid.show()

	app.ticker.add((_time) => {
		currentBlock.moveDown()

		if (mainGrid.blockLanded(currentBlock)) {
			mainGrid.putOnGrid(currentBlock)
			currentBlock.container.position.y = 0
		}
	})

	eventListener.addEventObserver(mainGrid, "resize")
	eventListener.addEventObserver(sideGrid, "resize")

	eventListener.addEventObserver(currentBlock, "resize")
	eventListener.addEventObserver(currentBlock, "keyboard")

	eventListener.addEventObserver(nextBlock, "resize")

	document.body.appendChild(app.canvas)
}
main()

class IBlock extends Block {
	constructor() {
		super()
		this.id = 1
		this.orientation[0] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 }]
		this.orientation[1] = [
			{ x: 2, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 2, y: 3 }]
		this.orientation[2] = [
			{ x: 0, y: 2 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 },
			{ x: 3, y: 2 }]
		this.orientation[3] = [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 1, y: 3 }]
	}
}
class TBlock extends Block {
	constructor() {
		super()
		this.id = 2

		this.orientation[0] = [
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }]
		this.orientation[1] = [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 1, y: 2 }]
		this.orientation[2] = [
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 1, y: 2 }]
		this.orientation[3] = [
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 }]

	}
}
class JBlock extends Block {
	constructor() {
		super()
		this.id = 3

		this.orientation[0] = [
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }]
		this.orientation[1] = [
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 }]
		this.orientation[2] = [
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 }]
		this.orientation[3] = [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 0, y: 2 },
			{ x: 1, y: 2 }]


	}
}
class LBlock extends Block {
	constructor() {
		super()
		this.id = 4

		this.orientation[0] = [
			{ x: 2, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }]
		this.orientation[1] = [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 }]
		this.orientation[2] = [
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 0, y: 2 }]
		this.orientation[3] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 }]
	}
}
class SBlock extends Block {
	constructor() {
		super()
		this.id = 5

		this.orientation[0] = [
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }]
		this.orientation[1] = [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 }]
		this.orientation[2] = [
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 0, y: 2 },
			{ x: 1, y: 2 }]
		this.orientation[3] = [
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 }]
	}
}

class ZBlock extends Block {
	constructor() {
		super()
		this.id = 6

		this.orientation[0] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }]
		this.orientation[1] = [
			{ x: 2, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 1, y: 2 }]
		this.orientation[2] = [
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 }]
		this.orientation[3] = [
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 0, y: 2 }]
	}
}
class OBlock extends Block {
	constructor() {
		super()
		this.id = 7

		this.orientation[0] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }]
		this.orientation[1] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }]
		this.orientation[2] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }]
		this.orientation[3] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }]

	}
}
