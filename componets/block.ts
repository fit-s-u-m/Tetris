import { EventObserver } from "./eventListener"
import { GRID, PIXICONTAINER, RENDERER, EVENT, SCORE, GAMESOUND } from "./types"

export abstract class Block implements EventObserver {
	id: number
	rotationState: 0 | 1 | 2 | 3 = 0
	orientation: { x: number, y: number }[][] = []
	currentOrientation: { x: number, y: number }[] = []
	container: PIXICONTAINER
	private renderer: RENDERER
	normalSpeed: number = 2
	maxSpeed: number = this.normalSpeed * 3
	speed: number = this.normalSpeed
	protected grid: GRID
	sound: GAMESOUND
	moveInStep = false
	blockCoord: { x: number, y: number } = { x: 0, y: 0 }
	stageContainer(renderer: RENDERER, sound: GAMESOUND) {
		this.renderer = renderer
		this.container = renderer.createContainer() // create a container at the start
		renderer.stage(this.container)
		this.sound = sound
		this.currentOrientation = this.orientation[this.rotationState]
	}

	showBlock(grid: GRID) {
		this.grid = grid
		if (this.moveInStep) {
			this.normalSpeed = this.grid.cellSize
			this.maxSpeed = 2 * this.grid.cellSize
		}
		else {
			this.normalSpeed = 2
			this.maxSpeed = 5
			this.speed = this.normalSpeed
		}

		this.orientation[this.rotationState]
			.forEach(pos => {
				this.container.addChild(
					this.renderer.
						drawRoundSquare(
							this.grid.position.x + (pos.x * this.grid.cellSize),
							this.grid.position.y + (pos.y * this.grid.cellSize),
							grid.cellSize,
							this.id))
			})
	}
	checkLevel(score: SCORE) {
		if (score.score % 50 == 0) {
			this.levelUp
		}
	}
	levelUp() {
		this.speed += 1
		this.normalSpeed += 1
		this.maxSpeed += 1
	}
	redraw() {
		this.container.removeChildren()
		this.currentOrientation = this.orientation[this.rotationState]
		this.showBlock(this.grid)
	}
	// Calculate the block's coordinates on the grid
	coordinate(): { x: number, y: number }[] {
		let blockCoord: { x: number, y: number }
		if (this.moveInStep) {
			blockCoord = this.blockCoord
		} else {
			const blockPos = this.container.getGlobalPosition()
			blockCoord = {
				x: blockPos.x / this.grid.cellSize,
				y: blockPos.y / this.grid.cellSize
			}
		}

		let rectCoord: { x: number, y: number }[] = []
		this.currentOrientation.forEach(rectOffset => {
			let rectPosX: number
			let rectPosY: number
			if (this.moveInStep) {
				rectPosX = Math.floor(blockCoord.x) + rectOffset.x
				rectPosY = Math.floor(blockCoord.y) + rectOffset.y
			}
			else {
				rectPosX = Math.round(blockCoord.x) + rectOffset.x
				rectPosY = Math.round(blockCoord.y) + rectOffset.y
			}
			rectCoord.push(
				{
					x: rectPosX,
					y: rectPosY
				}
			)
		})
		return rectCoord
	}
	getRows(): Set<number> {
		const rows = new Set<number>()
		for (const rectCoord of this.coordinate()) {
			rows.add(rectCoord.x)
		}
		return rows
	}
	clone(block: Block) {
		this.id = block.id
		this.orientation = block.orientation
		this.container.position.y = 0
		this.redraw()
	}

	destruct() {
		this.container.destroy()
	}


	// movement
	moveDown(speed: number = this.normalSpeed) {
		this.speed = speed
		this.container.y += this.speed
		this.speed = this.normalSpeed
		if (this.moveInStep)
			this.blockCoord.y += 1
	}
	moveUp(x: number) {
		this.speed = x
		this.container.y -= this.speed
		this.speed = this.normalSpeed
	}
	moveDownAStep() {
		this.container.y += this.grid.cellSize
	}
	moveLeft() {
		if (!this.grid.overSide(this, "left") && !this.grid.blockLanded(this)) {
			this.sound.playNote()
			this.container.x -= this.grid.cellSize // move
			if (this.moveInStep) { // if it is moveing stepwise
				this.blockCoord.x -= 1
			}
		}
	}
	moveRight() {
		if (!this.grid.overSide(this, "right") && !this.grid.blockLanded(this)) {
			this.sound.playNote()
			this.container.x += this.grid.cellSize
			if (this.moveInStep) { // if it is moveing stepwise
				this.blockCoord.x += 1
			}
		}
	}

	// rotation
	rotateCCW() {
		this.rotationState == 0 ? this.rotationState = 3 : this.rotationState--
		this.currentOrientation = this.orientation[this.rotationState]
		this.redraw()
	}
	rotateCW() {
		this.sound.playNote()
		this.rotationState === 3 ? this.rotationState = 0 : this.rotationState++
		this.currentOrientation = this.orientation[this.rotationState]

		if (this.grid.blockLanded(this) || this.grid.overSide(this, "both"))
			this.rotateCCW();  // undo if wall kick fails
		this.redraw()
	}
	kickRight() {
		while (this.grid.overSide(this, "left")) {
			// console.log("kick right")
			this.moveRight()
		}
	}
	kickLeft() {
		while (this.grid.overSide(this, "right")) {
			this.moveLeft()
		}
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
			}
		}
	}
}

