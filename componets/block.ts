import { EventObserver } from "./eventListener"
import { GRID, PIXICONTAINER, RENDERER, EVENT } from "./types"

export abstract class Block implements EventObserver {
	id: number
	rotationState: 0 | 1 | 2 | 3 = 0
	orientation: { x: number, y: number }[][] = []
	currentOrientation: { x: number, y: number }[] = []
	container: PIXICONTAINER
	private renderer: RENDERER
	normalSpeed: number = 2
	speed: number = this.normalSpeed
	grid: GRID
	stageContainer(renderer: RENDERER) {
		this.renderer = renderer
		this.container = renderer.createContainer()
		renderer.stage(this.container)
		this.currentOrientation = this.orientation[this.rotationState]
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
		this.currentOrientation = this.orientation[this.rotationState]
		this.showBlock(this.grid)
	}
	// Calculate the block's coordinates on the grid
	coordinate() {
		const blockPos = this.container.getGlobalPosition()
		const blockCoord = {
			x: blockPos.x / this.grid.cellSize,
			y: blockPos.y / this.grid.cellSize
		}

		let rectCoord: { x: number, y: number }[] = []
		this.currentOrientation.forEach(rectOffset => {
			const rectPosX = Math.round(blockCoord.x) + rectOffset.x
			const rectPosY = Math.round(blockCoord.y) + rectOffset.y
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


	// movement
	moveDown(speed: number = this.normalSpeed) {
		this.speed = speed
		this.container.y += this.speed
		this.speed = this.normalSpeed
	}
	moveDownAStep() {
		this.container.y += this.grid.cellSize
	}
	moveUpAStep() {
		this.container.y -= this.grid.cellSize
	}
	moveLeft() {
		if (!this.grid.overSide(this, "left") && !this.grid.blockLanded(this)) {
			this.container.x -= this.grid.cellSize // move
		}
	}
	moveRight() {
		if (!this.grid.overSide(this, "right") && !this.grid.blockLanded(this)) {
			this.container.x += this.grid.cellSize
		}
	}

	// rotation
	rotateCCW() {
		this.rotationState == 0 ? this.rotationState = 3 : this.rotationState--
		this.redraw()
	}
	rotateCW() {
		this.rotationState === 3 ? this.rotationState = 0 : this.rotationState++
		this.currentOrientation = this.orientation[this.rotationState]
		// if collided after rotation undo the rotation
		this.grid.blockLanded(this) || (this.grid.overSide(this, "both", "now")) ? this.rotateCCW() : this.redraw()
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
				case "k":
				case "ArrowUp":
					this.rotateCW()
					break
				case "j":
				case "ArrowDown":
					this.moveDown(4)
					break
				case "l":
				case "ArrowRight":
					this.moveRight()
					break
				case "h":
				case "ArrowLeft":
					this.moveLeft()
					break
			}
		}
	}
}

