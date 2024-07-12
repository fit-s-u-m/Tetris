import { Renderer } from "./renderer"
import { EventObserver } from "./eventListener"
import { BLOCK, PIXICONTAINER } from "./types"


export class Grid implements EventObserver {
	numCol: number
	numRow: number
	private cellSize_: number
	grid: number[][]
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
	init() {
		this.grid = [...Array(this.numCol)]
			.map(_ => Array(this.numRow).fill(0))
	}
	show() {
		for (const [rowIndex, row] of this.grid.entries()) {
			for (const [colIndex, val] of row.entries()) {
				const square = this.renderer
					.drawSquare(
						rowIndex * this.cellSize_ + this.position.x,
						colIndex * this.cellSize_ + this.position.y,
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
		const boundingBox = block.coordinate(this)
		const blockShape = block.orientation[block.rotationState]
		blockShape.forEach(pos => {
			this.grid[pos.x + boundingBox.x][pos.y + boundingBox.y] = block.id
		})
		this.redraw()
	}

	blockLanded(block: BLOCK) {
		const gridHeight = this.cellSize_ * (this.numRow)
		const groundPos = this.container.getGlobalPosition().y + gridHeight
		const blockPos = block.container.getGlobalPosition().y + block.container.getSize().height
		if (blockPos >= groundPos) {
			return true
		}


		// const blockCoor = block.coordinate(this)
		const blockX = block.container.getGlobalPosition().x
		const blockY = block.container.getGlobalPosition().y
		for (const orientation of block.orientation) {
			const pos = orientation[block.rotationState]
			if (this.grid[blockX + pos.x][blockY + pos.y] != 0) { // already painted
				return true
			}
		}

		return false
	}
	overSide(block: BLOCK) {
		const gridWidth = this.cellSize_ * this.numCol
		const blockSize = block.container.getSize().width
		const blockX = block.container.getGlobalPosition().x
		const gridX = this.container.getGlobalPosition().x
		if (blockX + blockSize >= gridX + gridWidth) // collide with right
			return true
		if (blockX < gridX)  // collide with left
			return true
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
				// console.log(leftOverSpace)
				this.position.y += leftOverSpace / 2
			}
			this.redraw()
		}
	}
}




