import { EventObserver } from "./eventListener"
import { Renderer } from "./renderer"
import { BUTTONTYPE, EVENT, GRID } from "./types"
import Konva from "konva"

export class Button implements EventObserver {
	renderer: Renderer
	button: Konva.Label
	fracPos: { x: number, y: number }
	size: number
	buttonType: BUTTONTYPE
	color: { fg: number, bg: number }
	text: string
	grid: GRID
	constructor(
		renderer: Renderer,
		buttonType: BUTTONTYPE,
		options: {
			yfrac: number,
			xfrac: number,
			text: string,
			size: number,
			color: { fg: number, bg: number },
			grid: GRID,
			onClick: () => boolean | void,
		},
		shouldDestroy: boolean = false) {
		this.renderer = renderer
		this.buttonType = buttonType
		this.fracPos = { x: options.xfrac, y: options.yfrac }
		this.color = options.color
		this.size = options.size
		this.text = options.text
		this.grid = options.grid
		if (buttonType == "text-with-rect")
			this.createButton(options, shouldDestroy)
		else if (buttonType == "text-only")
			this.createTextButton(options, shouldDestroy)
	}
	createButton({ yfrac, xfrac, text, size, color, onClick }, shouldDestroy: boolean = false) {
		const fontSize = size / 4
		var simpleLabel = new Konva.Label({
			x: xfrac * (this.grid.position.x + this.grid.size.w / 2),
			y: yfrac * (this.grid.position.y + this.grid.size.h)
		});

		simpleLabel.add(
			new Konva.Text({
				text,
				fontFamily: 'Calibri',
				fontSize,
				padding: 5,
				fill: this.renderer.color[9], // accent
			})
		);
		this.button = simpleLabel
		simpleLabel.on('click', () => {
			onClick()
			if (shouldDestroy)
				this.button.destroy
		})
	}
	createTextButton({ yfrac, xfrac, text, size, color, onClick }, shouldDestroy = false) {

		const fontSize = size / 4
		const gridRight = this.grid.position.x + this.grid.size.w - this.grid.cellSize / 2
		const gridBottom = this.grid.position.y + this.grid.size.h
		var simpleLabel = new Konva.Label({
			x: xfrac * this.grid.size.w + gridRight,
			y: yfrac * this.grid.size.h + gridBottom
		});

		simpleLabel.add(
			new Konva.Tag({
				fill: this.renderer.color[9],
				lineCap: "round",
				cornerRadius: 5
			})
		);

		simpleLabel.add(
			new Konva.Text({
				text,
				fontFamily: 'Calibri',
				fontSize,
				padding: 5,
				fill: this.renderer.color[8],
			})
		);
		const position = simpleLabel.getPosition()
		position.x -= simpleLabel.getSize().width / 2
		simpleLabel.setPosition(position)

		simpleLabel.on('click', () => {
			const pressed = onClick()
			if (pressed) {
				simpleLabel.getTag().fill(this.renderer.color[8])
				simpleLabel.getText().fill(this.renderer.color[9])
			} else {
				simpleLabel.getTag().fill(this.renderer.color[9])
				simpleLabel.getText().fill(this.renderer.color[8])
			}
			if (shouldDestroy) {
				this.button.remove()
				this.button.destroy()
			}
		})

		this.button = simpleLabel
		this.renderer.stage(this.button)
	}
	update(data: any, event: EVENT): void {
		if (this.buttonType == "text-only") {
			const gridRight = this.grid.position.x + this.grid.size.w - this.grid.cellSize / 2
			const gridBottom = this.grid.position.y + this.grid.size.h
			let textContainer = this.button.children
			const text = textContainer[0]
			if (text) {
				const fontSize = this.size / 4
				const x = this.fracPos.x * this.grid.size.w + gridRight
				const y = this.fracPos.y * this.grid.size.h + gridBottom
				this.button.setAttrs({
					'fontSize': fontSize,
					'x': x - fontSize, 'y': y,
				})
			}
		}
	}
}
