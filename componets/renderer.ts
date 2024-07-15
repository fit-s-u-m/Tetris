import * as  PIXI from "pixi.js"
import { CALLBACK } from "./types"
import { Block } from "./block"


export class Renderer {
	private app: PIXI.Application
	readonly color: string[]
	private callback: CALLBACK
	asset: PIXI.Sprite[]
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
		// const I = PIXI.Sprite.from("/assets/I.png")
		// const T = PIXI.Sprite.from("/assets/T.png")
		// const J = PIXI.Sprite.from("/assets/J.png")
		// const L = PIXI.Sprite.from("/assets/L.png")
		// const S = PIXI.Sprite.from("/assets/S.png")
		// const Z = PIXI.Sprite.from("/assets/Z.png")
		// const O = PIXI.Sprite.from("/assets/O.png")
		// this.asset = [I, T, J, L, S, Z, O]
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
	drawRoundSquare(x: number, y: number, s: number, c: number): PIXI.Graphics {
		return new PIXI.Graphics()
			.roundRect(x, y, s, s, 5)
			.fill(this.color[c])
			.stroke("#000")
	}
	drawSquare(x: number, y: number, s: number, c: number): PIXI.Graphics {
		return new PIXI.Graphics()
			.rect(x, y, s, s)
			.fill(this.color[c])
			.stroke("#000")
	}
	makeTextStyle(fontSize: number, color: string): PIXI.TextStyle {
		const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: fontSize,
			fontWeight: 'bold',
			fill: color,
			stroke: { color: '#4a1850', width: 5, join: 'round' },
			dropShadow: {
				color: '#000000',
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


	gameLoop(callback: PIXI.TickerCallback<any>) {
		this.app.ticker.autoStart = false;
		this.app.ticker.add(callback)
		// window.requestAnimationFrame(callback);
	}
	delayGame(time: number, block: Block) {
		this.app.ticker.stop()
		block.speed = 0

		setTimeout(
			() => {
				this.app.ticker.start()
				block.speed = 0
			}
			, time)
	}

	update() {
		this.app.ticker.update()
	}

	// setUp(callback: CALLBACK) {
	// 	if (this.isTickerCallback(callback)) {
	// 		this.app.ticker.addOnce(callback)
	// 	}
	// }
}
