import { Block } from "./block"
import { EventObserver } from "./eventListener"
import { DRAWING, EVENT, POSITION } from "./types"
import * as  PIXI from "pixi.js"
import Konva from "konva"


export class Renderer implements EventObserver {
	app: Konva.Stage
	layer: Konva.Layer
	readonly color: string[]
	private isPaused = false
	constructor() {
		this.color = [
			"#222222",
			"#FD3F59",
			"#800080",
			"#ffff00",
			"#ff7f00",
			"#00ffff",
			"#7f7f7f",
			"#00A200",
			"#000000"
		]
	}
	initApp() {
		this.app = new Konva.Stage({
			container: 'container', // ID of the container <div>
			width: window.innerWidth,
			height: window.innerHeight
		});
		this.layer = new Konva.Layer()
		this.app.add(this.layer)
	}
	stage(drawing: DRAWING): void {
		this.layer.add(drawing)
	}
	createContainer() {
		return new Konva.Group()
	}
	drawRoundSquare(x: number, y: number, s: number, c: number, alpha: number = 1): Konva.Rect {
		return new Konva.Rect({
			x,
			y,
			width: s,
			height: s,
			fill: this.color[c],
			stroke: "black",
			lineCap: "round",
			strokeWidth: 1,
		})
	}
	drawRoundRect(x: number, y: number, sx: number, sy: number, c: string): Konva.Rect {
		return new Konva.Rect({
			x,
			y,
			width: sx,
			height: sy,
			fill: this.color[c],
			stroke: "black",
			lineCap: "round",
			strokeWidth: 1,
		})
	}
	drawRect(x: number, y: number, sx: number, sy: number, c: string): Konva.Rect {
		return new Konva.Rect({
			x,
			y,
			width: sx,
			height: sy,
			fill: c,
			stroke: "black",
			strokeWidth: 1,
		})
	}
	drawSquare(x: number, y: number, s: number, c: number, alpha: number = 1): Konva.Rect {
		return new Konva.Rect({
			x,
			y,
			width: s,
			height: s,
			fill: this.color[c],
			stroke: "black",
			strokeWidth: 1,
			opacity: alpha
		})

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
	getMid() {
		return { x: this.app.screen.width / 2, y: this.app.screen.height / 2 }
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
