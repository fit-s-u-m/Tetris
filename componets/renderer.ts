import * as  PIXI from "pixi.js"
import { Block } from "./block"
import { EventObserver } from "./eventListener"
import { EVENT } from "./types"


export class Renderer implements EventObserver {
	private app: PIXI.Application
	readonly color: string[]
	private isPaused = false
	constructor() {
		this.color = [
			"#FFFFFF",
			"#FD3F59",
			"#800080",
			"#ffff00",
			"#ff7f00",
			"#00ffff",
			"#7f7f7f",
			"#00A200",
			"#000000"
		]
		this.app = new PIXI.Application()
	}
	async initApp(bgColor: string) {
		await this.app.init({ background: bgColor, resizeTo: window })
	}
	addAppToCanvas() {
		document.body.appendChild(this.app.canvas)
	}
	stage(drawing: PIXI.Graphics | PIXI.Container | PIXI.Sprite): void {
		this.app.stage.addChild(drawing)
	}
	createContainer() {
		return new PIXI.Container()
	}
	drawRoundSquare(x: number, y: number, s: number, c: number, alpha: number = 1): PIXI.Graphics {
		return new PIXI.Graphics()
			.roundRect(x, y, s, s, 5)
			.fill({ color: this.color[c], alpha })
			.stroke({ color: "#000", width: 1.1 })
	}
	drawRoundRect(x: number, y: number, sx: number, sy: number, c: string): PIXI.Graphics {
		return new PIXI.Graphics()
			.roundRect(x, y, sx, sy, 10)
			.fill(c)
			.stroke("#000")
	}
	drawRect(x: number, y: number, sx: number, sy: number, c: string): PIXI.Graphics {
		return new PIXI.Graphics()
			.rect(x, y, sx, sy)
			.fill(c)
			.stroke("#000")
	}
	drawSquare(x: number, y: number, s: number, c: number, alpha: number = 1): PIXI.Graphics {
		return new PIXI.Graphics()
			.rect(x, y, s, s)
			.fill({ color: this.color[c], alpha })
			.stroke("#000")
	}
	makeTextStyle(fontSize: number, color: string): PIXI.TextStyle {
		const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: fontSize,
			fontWeight: 'bold',
			fill: color,
			stroke: { color: '#000', width: fontSize / 20, join: 'round' },
			dropShadow: {
				color: '#000',
				blur: 3,
				angle: Math.PI / 6,
				distance: 3,
			},
			wordWrap: true,
			wordWrapWidth: 440,
		});
		return style

	}
	drawText(text: string, x: number, y: number, style: PIXI.TextStyle): PIXI.Text {
		const textDrawing = new PIXI.Text({ text, style })
		textDrawing.x = x
		textDrawing.y = y
		return textDrawing

	}

	drawCircle(x: number, y: number, r: number, c: number) {
		return new PIXI.Graphics()
			.circle(x, y, r)
			.fill(this.color[c])
	}

	gameLoop(callback: PIXI.TickerCallback<any>, context: any) {
		this.app.ticker.autoStart = false;
		this.app.ticker.add(callback, context)
	}
	delayGame(time: number) {
		this.app.ticker.stop()
		// block.speed = 0

		setTimeout(
			() => {
				this.app.ticker.start()
				// block.speed = 0
			}
			, time)
	}
	stopLoop(callback: PIXI.TickerCallback<any>, context: any) {
		this.app.ticker.remove(callback, context)
	}
	pauseLoop() {
		this.app.ticker.stop()
	}
	startLoop() {
		this.app.ticker.start()
	}
	updateLoop() {
		this.app.ticker.update()
	}
	update(data: any, event: EVENT): void {
		if (event == "keyboard") {
			switch (data) {
				case "p":
					if (this.isPaused) {
						this.startLoop()
						// this.sound.homeTheme.play()
					}
					else {
						// this.sound.homeTheme.stop()
						this.pauseLoop()
					}
					this.isPaused = !this.isPaused
					break
			}
		}
	}
}
