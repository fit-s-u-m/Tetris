import { Renderer } from "./renderer"
import { EventObserver } from "./eventListener"
import { BLOCK, PIXICONTAINER, SIDE, TIME, BINARY, POSITION } from "./types"


export class Grid implements EventObserver {
	numCol: number
	numRow: number
	private cellSize_: number
	protected grid_: number[][]
	position: { x: number, y: number }
	size: { w: number, h: number }
	fracPosition: { x: number, y: number }
	fracMaxHeight: number
	container: PIXICONTAINER
	renderer: Renderer
	shadowGrid: number[][]
	clearRowIndex = 0
	moveDownIndex = 0
	protected spiralIteration = 0
	protected spiralIndices: { i: number, j: number }[]

	constructor({ x, y }: { x: number, y: number }, maxHeight: number, numCol: number, numRow: number, renderer: Renderer) {
		this.numCol = numCol;
		this.numRow = numRow;
		const margin = numRow / numCol
		this.fracMaxHeight = maxHeight
		this.cellSize_ = (maxHeight * window.innerHeight - margin) / numRow
		this.size = { w: numCol * this.cellSize_, h: numRow * this.cellSize_ }

		this.init()
		this.renderer = renderer
		this.spiralIteration = 0


		this.fracPosition = { x, y }
		const xpos = x * window.innerWidth - (this.size.w) / 2
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
		this.spiralIndices = this.generateSpiralIndices()
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
	isEmptyCell(row: number, col: number) {
		if (row > this.numRow - 1) return false
		if (col > this.numCol - 1) return false
		return (this.grid[row][col] == 0 || this.grid[row][col] == 8)
	}
	isEmptyRow(row: number) {
		if (row > this.numRow - 1) return false
		for (let i = 0; i < this.numCol; i++) {
			if (!this.isEmptyCell(row, i)) {
				return false
			}
		}
		return true

	}
	blockLanded(block: BLOCK, offset: POSITION) {
		// landed on the grid
		const gridHeight = this.cellSize_ * this.numRow
		const groundPos = this.container.getGlobalPosition().y + gridHeight
		const blockPos = block.container.getGlobalPosition().y + block.container.getSize().height
		if (blockPos >= groundPos)
			return true
		else { // collision with another tetromino
			const blockCoord = block.coordinate()
			return this.checkBlockIsOnAnother(blockCoord, offset)
		}
	}
	checkBlockIsOnAnother(blockCoord: { x: number, y: number }[], offset: POSITION) {
		for (const rectCoord of blockCoord) {
			if (!this.isEmptyCell(
				rectCoord.y + offset.y,
				rectCoord.x + offset.x
			))
				return true
		}
		return false
	}

	overSide(block: BLOCK, offset: POSITION) {
		const outToLeft = block.coordinate().filter(rectCoord => rectCoord.x + offset.x < 0) // -1 to check for the next(future) block pos
		return outToLeft.length != 0
	}
	isValidPosition(block: BLOCK, offset: POSITION) {
		return !(this.overSide(block, offset) || this.blockLanded(block, offset))
	}
	colorGrid(row: number, col: number, color: number) {
		this.grid[row][col] = color
		this.redraw()
	}
	colorRow(row: number, color: number) {
		for (let i = 0; i < this.numCol; i++) {
			this.grid[row][i] = color // set to empty
		}
		this.redraw()

	}
	async clearEntireRow(row: number) {
		for (let i = 0; i < this.numCol; i++) {
			this.grid[row][i] = 0; // set to empty
			await this.sleep(20)
			this.redraw();
			this.renderer.updateLoop()
		}
	}
	sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	clearRow(row: number) {
		this.colorRow(row, 0)
	}
	checkIfRowIsFull(row: number) {
		for (let i = 0; i < this.numCol; i++) {
			if (this.isEmptyCell(row, i)) {
				return false
			}
		}
		return true
	}
	async moveDownRow(rowIndex: number, num: number) {
		if (num > 0) {
			for (let i = 0; i < this.numCol; i++) {
				const rowToMove = this.grid[rowIndex][i]
				this.grid[rowIndex + num][i] = rowToMove
			}
			this.clearRow(rowIndex)
			this.redraw()
			this.renderer.updateLoop()
			await this.sleep(10);
		}

	}
	reachTop() {
		const row = this.grid[0]
		for (let i = 0; i < row.length; i++) {
			if (!this.isEmptyCell(0, i)) { // is not empty
				return true
			}
		}
		return false
	}
	protected generateSpiralIndices() {
		let result: { i: number, j: number }[] = [];
		let top = 0, bottom = this.numRow - 1, left = 0, right = this.numCol - 1;

		while (top <= bottom && left <= right) {
			for (let j = left; j <= right; j++) {
				result.push({ i: top, j: j });
			}
			top++;

			for (let i = top; i <= bottom; i++) {
				result.push({ i: i, j: right });
			}
			right--;

			if (top <= bottom) {
				for (let j = right; j >= left; j--) {
					result.push({ i: bottom, j: j });
				}
				bottom--;
			}

			if (left <= right) {
				for (let i = bottom; i >= top; i--) {
					result.push({ i: i, j: left });
				}
				left++;
			}
		}

		return result;
	}
	drawSpiral(calback: { whenFinshed: () => void; }) {
		if (this.spiralIteration < this.numRow * this.numCol) {
			const spiral = this.spiralIndices[this.spiralIteration]
			const color = 8
			this.grid[spiral.i][spiral.j] = color
			this.redraw()
			this.spiralIteration += 1
		}
		else {
			this.spiralIteration = 0
			calback.whenFinshed()
			return
		}
	}
	clear() {
		for (let i = 0; i < this.numRow; i++) {
			this.clearRow(i);
		}
		this.redraw()
	}
	colorAll(c: number) {
		for (let i = 0; i < this.numRow; i++) {
			this.colorRow(i, c);
		}
		this.redraw()
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
