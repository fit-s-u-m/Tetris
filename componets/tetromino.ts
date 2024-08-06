import { Block } from "./block"
import { EVENT, GRID, RENDERER } from "./types"
import { tetrominoShapes } from "../util/tetrominoData"

export class MainBlock extends Block {
	normalSpeed: number = 1
	maxSpeed: number = 5
	speed: number = this.normalSpeed
	rotationState: 0 | 1 | 2 | 3 = 0
	tetromino: string
	ghost: GhostBlock
	constructor(renderer: RENDERER) {
		super()
		this.renderer = renderer
		this.container = renderer.createContainer() // create a container at the start
		renderer.stage(this.container)

		const tetrominos = ['I', 'T', 'J', 'L', 'S', 'Z', 'O']
		const randomNum = Math.floor(Math.random() * 6)
		this.id = randomNum + 1
		this.tetromino = tetrominos[randomNum]
		this.orientation = tetrominoShapes[tetrominos[randomNum]].shapes
		this.currentOrientation = this.orientation[this.rotationState]
	}
	// movement
	moveDown(speed: number = this.normalSpeed) {
		this.speed = speed
		const position = this.container.getPosition()
		position.y += this.speed
		this.container.setPosition(position)
		this.speed = this.normalSpeed
	}
	moveLeft() {
		if (!this.grid.overSide(this, { x: -1, y: 0 }) && !this.grid.blockLanded(this, { x: -1, y: 0 })) {
			const position = this.container.getPosition()
			position.x -= this.grid.cellSize
			this.container.setPosition(position)
			this.ghost.shadow()
		}
	}
	moveRight() {
		if (!this.grid.overSide(this, { x: 1, y: 0 }) && !this.grid.blockLanded(this, { x: 1, y: 0 })) {
			const position = this.container.getPosition()
			position.x += this.grid.cellSize
			this.container.setPosition(position)
			this.ghost.shadow()
		}
	}

	// rotation
	rotateCCW() {
		const beforeRotate = this.rotationState
		this.rotationState == 0 ? this.rotationState = 3 : this.rotationState--
		this.currentOrientation = this.orientation[this.rotationState]
		this.redraw()
		if (!this.grid.isValidPosition(this, { x: 0, y: 0 })) {
			const kickKey = `${beforeRotate}-${this.rotationState}`;
			const kicks = tetrominoShapes[this.tetromino].wallKicks[kickKey]
			for (const kick of kicks) {
				if (this.grid.isValidPosition(this, { x: kick[0], y: kick[1] })) {
					const position = this.container.getPosition()
					position.x += kick[0] * this.grid.cellSize
					position.y += kick[1] * this.grid.cellSize
					this.container.position(position)
					return
				}
			}
			this.rotateCW()
		}
		this.redraw()
	}
	rotateCW() {
		const beforeRotate = this.rotationState
		this.rotationState === 3 ? this.rotationState = 0 : this.rotationState++
		this.currentOrientation = this.orientation[this.rotationState]
		this.redraw()
		if (!this.grid.isValidPosition(this, { x: 0, y: 0 })) {
			const kickKey = `${beforeRotate}-${this.rotationState}`;
			const kicks = tetrominoShapes[this.tetromino].wallKicks[kickKey]
			for (const kick of kicks) {
				if (this.grid.isValidPosition(this, { x: kick[0], y: kick[1] })) {
					const position = this.container.getPosition()
					position.x += kick[0] * this.grid.cellSize
					position.y += kick[1] * this.grid.cellSize
					this.container.position(position)
					return
				}
			}
			this.rotateCCW()
		}
		this.redraw()
		this.ghost.shadow()
	}
	update(data: any, event: EVENT): void {
		if (event == "resize") {
			if (this.container.getPosition())
				this.container.setPosition({ x: 0, y: 0 })
			if (this.grid)
				this.redraw()
		}
		else if (event == "keyboard") {
			switch (data) {
				case "k":
				case "ArrowUp":
					this.rotateCW()
					break
				case "j":
				case "ArrowDown":
					this.moveDown(this.maxSpeed)
					break
				case "l":
				case "ArrowRight":
					this.moveRight()
					break
				case "h":
				case "ArrowLeft":
					this.moveLeft()
					break
				case "x":
					this.rotateCW()
					break
				case "z":
					this.rotateCCW()
					break

			}
		}

	}
	setShadow(block: GhostBlock) {
		this.ghost = block

	}
	createNew(block: PreviewBlock) {
		this.id = block.id
		this.orientation = block.orientation
		this.rotationState = 0
		this.currentOrientation = this.orientation[this.rotationState]
		this.container.setPosition({ x: 0, y: 0 })
		this.redraw()
	}
}
export class PreviewBlock extends Block {
	constructor(renderer: RENDERER, grid: GRID) {
		super()
		this.container = renderer.createContainer()
		this.renderer = renderer
		this.renderer.stage(this.container)
		this.grid = grid
		this.createNew()
	}
	createNew() {
		const tetrominos = ['I', 'T', 'J', 'L', 'S', 'Z', 'O']
		const randomNum = Math.floor(Math.random() * 6)
		this.id = randomNum + 1
		this.orientation = tetrominoShapes[tetrominos[randomNum]].shapes
		this.currentOrientation = this.orientation[0]
		this.redraw()
	}
}
export class GhostBlock extends Block {
	private block: MainBlock
	constructor(block: MainBlock) {
		super()
		this.renderer = block.renderer
		this.container = block.container
		this.currentOrientation = block.currentOrientation

		this.container = this.renderer.createContainer()
		this.renderer.stage(this.container)
		this.alpha = 0.5
		this.block = block
	}
	shadow() {
		this.orientation = this.block.orientation
		this.currentOrientation = this.block.currentOrientation
		this.grid = this.block.grid
		this.id = this.block.id

		// Calculate the block's coordinates on the grid
		const blockPos = this.block.container.position()
		const rows = new Set()
		const nextRotation = this.block.rotationState === 3 ? 0 : this.block.rotationState + 1
		const nextOrientation = this.orientation[nextRotation]

		for (const pos of nextOrientation) {
			rows.add(pos.x)
		}
		const numOfRow = rows.size
		const blockCoord = {
			x: Math.round(blockPos.x / this.grid.cellSize),
			y: Math.round((blockPos.y) / this.grid.cellSize) + numOfRow
		}
		const position = {
			x: blockCoord.x * this.grid.cellSize,
			y: blockCoord.y * this.grid.cellSize
		}
		this.container.setPosition(position)
		while (this.grid.isValidPosition(this, { x: 0, y: 1 })) {
			const position = this.container.getPosition()
			position.y += this.grid.cellSize
			this.container.setPosition(position)
		}
		this.redraw()
	}
	update(data: any, event: EVENT): void {
		if (this.grid)
			this.shadow()
	}
}
