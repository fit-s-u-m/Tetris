import { Renderer } from "./renderer"
import { EventObserver } from "./eventListener"
import { BLOCK, PIXICONTAINER, SIDE, TIME, BINARY } from "./types"

export class Grid implements EventObserver {
	numCol: number
	numRow: number
	private cellSize_: number
	protected grid_: number[][]
	position: { x: number, y: number }
	fracPosition: { x: number, y: number }
	fracMaxHeight: number
	container: PIXICONTAINER
	renderer: Renderer

	constructor({ x, y }: { x: number, y: number }, maxHeight: number, numCol: number, numRow: number, renderer: Renderer) {
		this.numCol = numCol;
		this.numRow = numRow;
		const margin = numRow / numCol
		this.fracMaxHeight = maxHeight
		this.cellSize_ = (maxHeight * window.innerHeight - margin) / numRow

		this.init()
		this.renderer = renderer


		this.fracPosition = { x, y }
		const xpos = x * window.innerWidth - (this.numCol * this.cellSize_) / 2
		const ypos = y * window.innerHeight
		this.position = { x: xpos, y: ypos }
		this.container = renderer.createContainer()
		this.renderer.stage(this.container)
	}
	get grid() {
		return this.grid_
	}
	init() {
		this.grid_ = [...Array(this.numRow)]
			.map(_ => Array(this.numCol).fill(0))
	}
	show() {
		for (const [rowIndex, row] of this.grid_.entries()) {
			for (const [colIndex, val] of row.entries()) {
				const square = this.renderer
					.drawSquare(
						colIndex * this.cellSize_ + this.position.x,
						rowIndex * this.cellSize_ + this.position.y,
						this.cellSize_,
						val)
				this.container.addChild(square)
			}
		}
	}
	get cellSize() {
		return this.cellSize_
	}
	redraw() {
		this.container.removeChildren()
		this.show()
	}
	addBlock(block: BLOCK) {
		const blockCoord = block.coordinate()
		blockCoord.forEach(rectCoord => {
			this.grid_[rectCoord.y][rectCoord.x] = block.id
		})
		this.redraw()
	}
	isEmpty(row: number, col: number) {
		if (row > this.numRow - 1) return false
		if (this.grid[row][col] == 0)
			return true
		return false
	}

	blockLanded(block: BLOCK) {
		// landed on the grid
		const gridHeight = this.cellSize_ * this.numRow
		const groundPos = this.container.getGlobalPosition().y + gridHeight
		const blockPos = block.container.getGlobalPosition().y + block.container.getSize().height
		if (blockPos >= groundPos) {
			return true
		}
		else {
			// collision with another tetromino
			const blockCoord = block.coordinate()
			for (const rectCoord of blockCoord) {
				if (!this.isEmpty(rectCoord.y + 1, rectCoord.x))  // if block is not empty
					return true
			}
		}
		return false
	}

	overSide(block: BLOCK, side: SIDE = "both", checkFor: TIME = "future") {
		const needsOne: BINARY = checkFor == "future" ? 1 : 0
		if (side == "left" || side == "both") {
			const outToLeft = block.coordinate().filter(rectCoord => rectCoord.x - needsOne < 0) // -1 to check for the next(future) block pos
			return outToLeft.length != 0
		}
		if (side == "right" || side == "both") {
			const outToRight = block.coordinate().filter(rectCoord => rectCoord.x + needsOne > this.numCol - 1)  // +1 to check for the next(future) block pos
			return outToRight.length != 0
		}
	}
	clearRow() {

	}
	checkIfRowIsFull(row: number) {
		let fulls: number[] = []
		for (const [rowIndex, row] of this.grid_.entries()) {
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
	moveDownRow(rowIndex: number) {
		for (let i = 0; i < this.numCol; i++) {
			const rowToMove = this.grid[rowIndex][i]
			this.grid[rowIndex + 1][i] = rowToMove
		}
	}
	reachTop() {
		const row = this.grid[0]
		for (let i = 0; i < row.length; i++) {
			if (!this.isEmpty(0, i)) { // is not empty
				return true
			}
		}
		return false
	}
	update(data: any, event: string) { // when resized 
		if (event == "resize") {
			const margin = this.numRow / this.numCol
			this.cellSize_ = (this.fracMaxHeight * Math.min(data.h, data.w) - margin) / this.numRow

			const xpos = this.fracPosition.x * data.w - (this.numCol * this.cellSize_) / 2
			const ypos = this.fracPosition.y * data.h
			this.position = { x: xpos, y: ypos }

			if (data.w < data.h) {
				const endPoint = this.position.y + this.cellSize_ * this.numRow
				const leftOverSpace = data.h - endPoint
				this.position.y += leftOverSpace / 2
			}
			this.redraw()
		}
	}
}




