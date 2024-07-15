import { RENDERER, TEXT, TEXTSTYLE } from "./types";
import { EventObserver } from "./eventListener";
export class Score implements EventObserver {
	scoreText: TEXT
	scoreTextStyle: TEXTSTYLE
	score: number
	fontSize: number
	fracPos: { x: number, y: number }
	renderer: RENDERER
	constructor({ x, y }: { x: number, y: number }, color: number, renderer: RENDERER) {
		this.fontSize = window.innerWidth / 40
		const xpos = x * window.innerWidth - this.fontSize
		const ypos = y * window.innerHeight
		this.scoreTextStyle = renderer.makeTextStyle(this.fontSize, renderer.color[color])
		this.scoreText = renderer.drawText("score 0", xpos, ypos, this.scoreTextStyle)
		this.score = 0
		this.fracPos = { x, y }
		renderer.stage(this.scoreText)
		this.renderer = renderer
	}
	addPoint(x: number) {
		this.scoreText.text = `score ${this.score += x}`
	}
	subPoint(x: number) {
		if (this.score - x >= 0) {
			this.scoreText.text = `score ${this.score -= x}`
		}
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
