import { EventObserver } from "./eventListener"
import { GRID, PIXICONTAINER, RENDERER, EVENTLISTENER, EVENT } from "./types"

export abstract class Block implements EventObserver {
	id: number
	rotationState: 0 | 1 | 2 | 3 = 0
	orientation: { x: number, y: number }[][] = []
	container: PIXICONTAINER
	private renderer: RENDERER
	speed: number = 1
	grid: GRID
	stageContainer(renderer: RENDERER) {
		this.renderer = renderer
		this.container = renderer.createContainer()
		renderer.stage(this.container)
	}

	showBlock(grid: GRID) {
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
		console.log(this.container.x)
		// const currentPos = this.container.getGlobalPosition();
		// this.container.position.set(currentPos.x, currentPos.y);
		this.showBlock(this.grid)
	}
	coordinate(grid: GRID) {
		const blockX = this.container.getGlobalPosition().x
		const blockY = this.container.getGlobalPosition().y

		const blockCoord: { x: number, y: number } = {
			x: Math.floor(blockX / grid.cellSize),
			y: Math.floor(blockY / grid.cellSize)
		}
		return blockCoord
	}
	destruct() {
		this.container.destroy()
	}


	moveDown() {
		this.container.y += this.speed
		this.speed = 1
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
		this.rotationState == 0 ? this.rotationState = 3 : this.rotationState--
		this.redraw()
	}
	rotateCW() {
		this.rotationState === 3 ? this.rotationState = 0 : this.rotationState++
		// if collided after rotation undo the rotation
		this.grid.blockLanded(this) || this.grid.overSide(this) ? this.rotateCCW() : this.redraw()
	}
	update(data: any, event: EVENT) {
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
					this.speed = 6
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

