import { BLOCK, RENDERER, TEXT, TEXTSTYLE } from "./types";
import { EventObserver } from "./eventListener";
export class Score implements EventObserver {
	scoreText: TEXT
	levelText: TEXT
	numLineClearedText: TEXT
	scoreTextStyle: TEXTSTYLE
	levelTextStyle: TEXTSTYLE
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
		this.scoreTextStyle = renderer.makeTextStyle(this.fontSize, renderer.color[color])
		this.levelTextStyle = renderer.makeTextStyle(this.fontSize, "#fff")

		this.scoreText = renderer.drawText("Score 0", xpos, ypos, this.scoreTextStyle)
		this.levelText = renderer.drawText("Level 1", xpos, ypos + this.fontSize, this.levelTextStyle)
		this.numLineClearedText = renderer.drawText(`line cleared  ${this.numLineCleared}`, this.fontSize, ypos + this.fontSize, this.levelTextStyle)
		this.score = 0
		this.level = 1
		this.fracPos = { x, y }
		renderer.stage(this.scoreText)
		renderer.stage(this.levelText)
		renderer.stage(this.numLineClearedText)
		this.renderer = renderer
	}
	calculateScore(numLineCleared: number, block: BLOCK) {
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
		this.scoreText.text = `Score ${this.score += muliplier * (this.level + 1)}`
		this.numLineCleared += numLineCleared
		this.numLineClearedText.text = `line cleared ${this.numLineCleared}`
		if (this.numLineCleared % 10 == 0) {
			block.normalSpeed += this.level
			this.levelUP()
		}
	}
	subPoint(x: number) {
		if (this.score - x >= 0) {
			this.scoreText.text = `Score ${this.score -= x}`
		}
		this.life -= 1
		if (this.life <= 0) { // if you end your life reset the score
			this.score = 0
			this.level = 1
		}
	}
	levelUP() {
		this.levelText.text = `Level ${++this.level}`
	}
	update(data: any, event: string): void {
		if (event == "resize") {
			const xpos = this.fracPos.x * data.w - this.fontSize
			const ypos = this.fracPos.y * data.h
			this.fontSize = window.innerWidth / 40
			this.scoreTextStyle = this.renderer.makeTextStyle(this.fontSize, "blue")
			this.scoreText.x = xpos
			this.scoreText.y = ypos
			this.scoreText.style = this.scoreTextStyle
		}
	}
	changeColor(color: number) {
		this.scoreTextStyle = this.renderer.makeTextStyle(this.fontSize, this.renderer.color[color])
		this.scoreText.style = this.scoreTextStyle
	}

}
