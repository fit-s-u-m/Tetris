import { EventObserver } from "./eventListener"
import { GRID, PIXICONTAINER, RENDERER, EVENT, SCORE, GAMESOUND, GROUP } from "./types"

export abstract class Block implements EventObserver {
	id: number
	orientation: { x: number, y: number }[][] = []
	currentOrientation: { x: number, y: number }[] = []
	container: GROUP
	renderer: RENDERER
	grid: GRID
	protected alpha = 1
	time = 0

	showBlock(grid: GRID) {
		this.grid = grid
		this.currentOrientation
			.forEach(pos => {
				this.container.add(
					this.renderer.
						drawRoundSquare(
							this.grid.position.x + (pos.x * this.grid.cellSize),
							this.grid.position.y + (pos.y * this.grid.cellSize),
							grid.cellSize,
							this.id,
							this.alpha
						))
			})
	}
	redraw() {
		this.container.removeChildren()
		this.showBlock(this.grid)
	}
	// Calculate the block's coordinates on the grid
	coordinate(): { x: number, y: number }[] {
		let blockCoord: { x: number, y: number }
		const blockPos = this.container.getAbsolutePosition()
		blockCoord = {
			x: blockPos.x / this.grid.cellSize,
			y: blockPos.y / this.grid.cellSize
		}

		let rectCoord: { x: number, y: number }[] = []
		this.currentOrientation.forEach(rectOffset => {
			let rectPosX: number
			let rectPosY: number
			rectPosX = Math.round(blockCoord.x) + rectOffset.x
			rectPosY = Math.round(blockCoord.y) + rectOffset.y
			rectCoord.push(
				{
					x: rectPosX,
					y: rectPosY
				}
			)
		})
		return rectCoord
	}

	destruct() {
		this.container.destroy()
	}

	update(data: any, event: EVENT) { // resize
		if (event == "resize") {
			if (this.container.getPosition())
				this.container.setPosition({ x: 0, y: 0 })
			if (this.grid)
				this.redraw()
		}
	}
}

// checkLevel(score: SCORE) {
// 	if (score.score % 50 == 0) {
// 		this.levelUp
// 	}
// }
// levelUp() {
// 	this.speed += 1
// 	this.normalSpeed += 1
// 	this.maxSpeed += 1
// }
