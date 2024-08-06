import { Block } from "./block"
import { EventObserver } from "./eventListener"
import { CALLBACK, DRAWING, EVENT, POSITION } from "./types"
import * as  PIXI from "pixi.js"
import Konva from "konva"


export class Renderer implements EventObserver {
	app: Konva.Stage
	layer: Konva.Layer
	readonly color: string[]
	private isPaused = false
	private animation: Konva.Animation
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
	stage(drawing: any): void {
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
	drawText(text: string, x: number, y: number, fontSize: number, color: string) {
		// var simpleLabel = new Konva.Label({ x, y });
		const simple_text = new Konva.Text({
			x, y,
			text,
			fontFamily: 'Calibri',
			fontStyle: "bold",
			fontSize,
			padding: 10,
			fill: color,
		})
		return simple_text
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
	drawCircle(x: number, y: number, r: number, c: number) {
		return new PIXI.Graphics()
			.circle(x, y, r)
			.fill(this.color[c])
	}
	drawImage({ id, width, x, y, height, container }: { id: number, width: number, x: number, y: number, height: number, container: Konva.Group }) {
		const tetrominos = ['I', 'T', 'J', 'L', 'S', 'Z', 'O']
		const path = `../public/assets/${tetrominos[id - 1]}.png`


		const imageObj = new Image();
		imageObj.onload = () => {
			const image = new Konva.Image({
				x,
				y,
				image: imageObj,
				width,
				height
			});
			container.add(image)

		};
		imageObj.src = path
	}

	gameLoop(callback: any, context?: any) {
		this.animation = new Konva.Animation(callback.bind(context), this.layer)
		this.animation.start()
	}
	// delayGame(time: number) {
	// 	this.app.ticker.stop()
	// 	// block.speed = 0
	//
	// 	setTimeout(
	// 		() => {
	// 			this.app.ticker.start()
	// 			// block.speed = 0
	// 		}
	// 		, time)
	// }
	// stopLoop(callback: PIXI.TickerCallback<any>, context: any) {
	// 	this.app.ticker.remove(callback, context)
	// }
	pauseLoop() {
		this.animation.stop()
	}
	startLoop() {
		this.animation.start()
	}
	// updateLoop() {
	// 	this.app.ticker.update()
	// }
	// getMid() {
	// 	return { x: this.app.screen.width / 2, y: this.app.screen.height / 2 }
	// }
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
