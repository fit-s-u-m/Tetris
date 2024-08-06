import { EVENT, GAMESOUND, RENDERER, TEXT } from "./types";
import { EventObserver } from "./eventListener";
import { MainBlock } from "./tetromino";
export class Score implements EventObserver {
	scoreText: TEXT
	levelText: TEXT
	numLineClearedText: TEXT
	scoreTextStyle: TEXT
	levelTextStyle: TEXT
	score: number
	level: number
	fontSize: number
	fracPos: { x: number, y: number }
	renderer: RENDERER
	numLineCleared: number = 0
	life: number = 3
	constructor({ x, y }: { x: number, y: number }, color: number, renderer: RENDERER) {
		this.fontSize = window.innerWidth / 40
		const xpos = x * window.innerWidth - this.fontSize
		const ypos = y * window.innerHeight

		this.scoreText = renderer.drawText("Score 0", xpos, ypos, this.fontSize, renderer.color[color])
		this.levelText = renderer.drawText("Level 1", xpos, ypos + this.fontSize, this.fontSize, renderer.color[0])
		this.numLineClearedText = renderer.drawText(`Line Cleared  ${this.numLineCleared}`, this.fontSize, ypos + this.fontSize, this.fontSize, renderer.color[0])

		this.score = 0
		this.level = 1
		this.fracPos = { x, y }
		renderer.stage(this.scoreText)
		renderer.stage(this.levelText)
		renderer.stage(this.numLineClearedText)

		this.renderer = renderer
	}
	calculateScore(numLineCleared: number, block: MainBlock) {
		let muliplier: number
		if (numLineCleared == 1) {
			muliplier = 40
		}
		else if (numLineCleared == 2) {
			muliplier = 100
		}
		else if (numLineCleared == 3) {
			muliplier = 300
		}
		else { // 4
			muliplier = 1200
		}
		console.log(this.score += muliplier * (this.level + 1))
		this.scoreText.setAttr("text", `Score ${this.score += muliplier * (this.level + 1)}`)
		this.numLineCleared += numLineCleared
		this.numLineClearedText.setAttr('text', `Line Cleared ${this.numLineCleared}`)
		if (this.numLineCleared % 10 == 0) {
			block.normalSpeed += this.level / 2 // TODO: make reasonable speed
			this.levelUP()
		}
	}
	subPoint(x: number) {
		if (this.score - x >= 0) {
			this.scoreText.setAttr('text', `Score ${this.score -= x}`)
		}
		this.life -= 1
		if (this.life <= 0) { // if you end your life reset the score
			this.score = 0
			this.level = 1
		}
	}
	levelUP() {
		this.levelText.setAttr('text', `Level ${++this.level}`)
	}
	update(data: any, event: EVENT): void {
		if (event == "resize") {
			this.fontSize = data.w / 40
			const xpos = this.fracPos.x * data.w
			const ypos = this.fracPos.y * data.h
			this.scoreText.setAttrs({
				x: xpos,
				y: ypos,
				fontSize: this.fontSize,
				fill: "blue",
			})

			this.levelText.setAttrs({
				x: xpos,
				y: ypos + this.fontSize,
				fontSize: this.fontSize,
				fill: "white",
			})
			this.numLineClearedText.setAttrs({
				fontSize: this.fontSize,
				fill: "blue",
			})
		}
	}
	changeColor(color: number) {
		this.scoreText.setAttrs({
			fontSize: this.fontSize,
			fill: this.renderer.color[color]
		})
	}

}
