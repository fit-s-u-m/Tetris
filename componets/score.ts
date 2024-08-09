import { EVENT, GAMESOUND, GRID, RENDERER, TEXT } from "./types";
import { EventObserver } from "./eventListener";
import { MainBlock } from "./tetromino";
export class Score implements EventObserver {
	scoreTextNum: TEXT
	scoreText: TEXT
	levelTextNum: TEXT
	levelText: TEXT
	clearLineNum: TEXT
	clearLineText: TEXT
	nextText: TEXT
	score: number
	level: number
	fontSize: number
	fracPos: { x: number, y: number }
	renderer: RENDERER
	numLineCleared: number = 0
	life: number = 3
	mainGrid: GRID
	previewGrid: GRID
	constructor({ x, y, mainGrid, previewGrid }: { x: number, y: number, mainGrid: GRID, previewGrid: GRID }, color: number, renderer: RENDERER) {
		this.fontSize = window.innerWidth / 40
		const gridRight = mainGrid.position.x + mainGrid.size.w
		const gridLeft = mainGrid.position.x
		const gridBottom = mainGrid.position.y + mainGrid.cellSize * (mainGrid.numRow - 2)
		const gridMidY = mainGrid.position.y + mainGrid.size.h / 2
		const gridMidX = mainGrid.position.x + mainGrid.size.w / 2
		const previewGridX = previewGrid.position.x


		this.scoreTextNum = renderer.drawText("0", gridMidX, 0, this.fontSize, renderer.color[color])
		this.scoreText = renderer.drawText("Score", gridLeft, 0, this.fontSize, renderer.color[8])
		this.levelTextNum = renderer.drawText("1", gridRight, gridBottom + this.fontSize, this.fontSize, renderer.color[8])
		this.levelText = renderer.drawText("Level ", gridRight, gridBottom, this.fontSize, renderer.color[8])
		this.clearLineText = renderer.drawText('clearLine', gridLeft, gridBottom, this.fontSize, renderer.color[8])
		const clearLineTextwidth = this.clearLineText.getTextWidth()
		this.clearLineText.setAttr("x", gridLeft - clearLineTextwidth)
		this.clearLineNum = renderer.drawText(this.numLineCleared.toString(), gridLeft - clearLineTextwidth / 2, gridBottom + this.fontSize, this.fontSize, renderer.color[8])

		this.nextText = renderer.drawText("Next", previewGridX, 0, this.fontSize, renderer.color[8])

		this.score = 0
		this.level = 1
		this.fracPos = { x, y }
		renderer.stage(this.scoreTextNum)
		renderer.stage(this.scoreText)
		renderer.stage(this.levelTextNum)
		renderer.stage(this.levelText)
		renderer.stage(this.clearLineNum)
		renderer.stage(this.clearLineText)
		renderer.stage(this.nextText)
		this.mainGrid = mainGrid
		this.previewGrid = previewGrid

		this.renderer = renderer
	}
	calculateScore(numLineCleared: number, block: MainBlock, sound: GAMESOUND) {
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
		this.scoreTextNum.setAttr("text", `${this.score += muliplier * (this.level + 1)}`)
		this.numLineCleared += numLineCleared
		this.clearLineNum.setAttr('text', `${this.numLineCleared}`)
		if (this.numLineCleared % 10 == 0) {
			block.normalSpeed += this.level / 2 // TODO: make reasonable speed
			sound.levelCompleted()
			this.levelUP()
		}
	}
	subPoint(x: number) {
		if (this.score - x >= 0) {
			this.scoreTextNum.setAttr('text', `${this.score -= x}`)
		}
		this.life -= 1
		if (this.life <= 0) { // if you end your life reset the score
			this.score = 0
			this.level = 1
		}
	}
	levelUP() {
		this.levelTextNum.setAttr('text', `${++this.level}`)
	}
	setLevelValue(num: number) {
		this.level = num
		this.levelTextNum.setAttr('text', `${num}`)
	}
	update(data: any, event: EVENT): void {
		if (event == "resize") {
			this.fontSize = data.w / 40
			if (data.w < 800) {
				this.fontSize = data.w / 30
			}
			else if (data.w < 700) {
				this.fontSize = data.w / 20
			}
			const gridRight = this.mainGrid.position.x + this.mainGrid.size.w
			const gridLeft = this.mainGrid.position.x
			const gridBottom = this.mainGrid.position.y + this.mainGrid.cellSize * (this.mainGrid.numRow - 2)
			const gridMidY = this.mainGrid.position.y + this.mainGrid.size.h / 2
			const gridMidX = this.mainGrid.position.x + this.mainGrid.size.w / 2
			const previewGridX = this.previewGrid.position.x
			this.clearLineText.setAttr("fontSize", this.fontSize)
			const clearLineTextwidth = this.clearLineText.getWidth()


			this.scoreTextNum.setAttrs({
				x: gridMidX,
				y: 0,
				fontSize: this.fontSize,
				fill: this.renderer.color[8],
			})

			this.scoreText.setAttrs({
				x: gridLeft,
				y: 0,
				fontSize: this.fontSize,
				fill: this.renderer.color[8],
			})

			this.levelTextNum.setAttrs({
				x: gridRight,
				y: gridBottom + this.fontSize,
				fontSize: this.fontSize,
				fill: this.renderer.color[8],
			})
			this.levelText.setAttrs({
				x: gridRight,
				y: gridBottom,
				fontSize: this.fontSize,
				fill: this.renderer.color[8],
			})
			this.clearLineNum.setAttrs({
				x: gridLeft - clearLineTextwidth / 2,
				y: gridBottom + this.fontSize,
				fill: this.renderer.color[8],
				fontSize: this.fontSize,
			})
			this.clearLineText.setAttrs({
				x: gridLeft - clearLineTextwidth,
				y: gridBottom,
				fontSize: this.fontSize,
				fill: this.renderer.color[8],
			})
			this.nextText.setAttrs({
				x: previewGridX,
				y: 0,
				fontSize: this.fontSize,
				fill: this.renderer.color[8],
			})
		}
	}
	changeColor(color: number) {
		this.scoreTextNum.setAttrs({
			fontSize: this.fontSize,
			fill: this.renderer.color[color]
		})
	}

}
