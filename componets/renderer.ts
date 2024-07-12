import * as  PIXI from "pixi.js"
import { CALLBACK } from "./types"


export class Renderer {
	private app: PIXI.Application
	private color: string[]
	constructor() {
		this.color = [
			"#FFFFFF",
			"#FD3F59",
			"#800080",
			"#ffff00",
			"#ff7f00",
			"#00ffff",
			"#7f7f7f",
			"#00A200"
		]
		this.app = new PIXI.Application()
	}
	async initApp(bgColor: string) {
		await this.app.init({ background: bgColor, resizeTo: window })
	}
	addAppToCanvas() {
		document.body.appendChild(this.app.canvas)
	}
	stage(drawing: PIXI.Graphics | PIXI.Container): void {
		this.app.stage.addChild(drawing)
	}
	createContainer() {
		return new PIXI.Container()
	}
	drawSquare(x: number, y: number, s: number, c: number): PIXI.Graphics {
		return new PIXI.Graphics()
			.roundRect(x, y, s, s, 2)
			.fill(this.color[c])
			.stroke("#000")
	}
	gameLoop(callback: CALLBACK) {
		this.app.ticker.add(callback)
	}
	setUp(callback: CALLBACK) {
		this.app.ticker.addOnce(callback)
	}
}
