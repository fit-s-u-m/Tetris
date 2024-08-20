import { EventObserver } from "./eventListener"
import { EVENT, GAMESOUND } from "./types"
import Konva from "konva"


export class Renderer implements EventObserver {
	app: Konva.Stage
	layer: Konva.Layer
	readonly color: string[]
	private isPaused = false
	private animation: Konva.Animation
	private gameContext: any
	private gameSound: GAMESOUND
	constructor(gameSound: GAMESOUND) {
		this.color = [
			"#B7B7A4", // primry 
			"#8F00FF", // I  purple
			"#6A00FF", // T  blue
			"#01BEFE", // L  light blue
			"#FFDD00", // J  yellow
			"#FF006D", // S  pink
			"#FF7D00", // Z orange 
			"#ADFF02", // o  green
			"#A5A58D", // secondary 
			"#03120E", // accent
		]
		this.gameSound = gameSound
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
			opacity: alpha
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
	drawBorder(x: number, y: number, sx: number, sy: number, w: number, c: number): Konva.Rect {
		return new Konva.Rect({
			x: x + sx * 0.05,
			y: y + sy * 0.05,
			width: sx * 0.9,
			height: sy * 0.9,
			fill: undefined,
			stroke: this.color[c],
			cornerRadius: 5,
			strokeWidth: w,
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
	drawImage(path: string, x: number, y: number, width: number, height: number) {
		const imageObj = new Image();
		imageObj.onload = () => {
			const image = new Konva.Image({
				x, y,
				image: imageObj,
				width: (width * 2),
				height
			});
			this.layer.add(image)
		};
		imageObj.src = path

	}
	drawTetromino({ id, width, x, y, height, container }: { id: number, width: number, x: number, y: number, height: number, container: Konva.Group }) {
		const tetrominos = ['I', 'T', 'L', 'J', 'S', 'Z', 'O']
		const path = `/Tetris/assets/tetrominos/${tetrominos[id - 1]}.png`


		const imageObj = new Image();
		imageObj.onload = () => {
			const image = new Konva.Image({
				x,
				y,
				image: imageObj,
				width,
				height,
				lineCap: "round",
				lineJoin: "round",
				cornerRadius: 5
			});
			container.add(image)

		}; imageObj.src = path
	}

	gameLoop(callback: any, context?: any) {
		this.animation = new Konva.Animation(callback.bind(context), this.layer)
		this.animation.start()
		this.gameContext = context
	}
	pauseLoop() {
		this.animation.stop()
		this.gameContext.gameOn = false
		this.gameContext.currentBlock.isGameOn = false
		if (this.isPaused) {
			this.gameSound.pause()
			this.gameContext.score.pause()
		}
	}
	startLoop() {
		this.animation.start()
		this.gameContext.gameOn = true
		this.gameContext.currentBlock.isGameOn = true
		this.gameSound.play()
		this.gameContext.score.play()
	}
	update(data: any, event: EVENT): void {
		if (event == "keyboard") {
			switch (data) {
				case "p":
					if (this.isPaused) {
						this.isPaused = !this.isPaused
						this.startLoop()
					}
					else {
						this.isPaused = !this.isPaused
						this.pauseLoop()
					}
					break
			}
		}
	}
}
