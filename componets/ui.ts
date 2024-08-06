import { EventObserver } from "./eventListener"
import { Renderer } from "./renderer"
import { BUTTONTYPE, EVENT } from "./types"
import Konva from "konva"

export class Button implements EventObserver {
	renderer: Renderer
	button: Konva.Label
	fracPos: { x: number, y: number }
	size: number
	buttonType: BUTTONTYPE
	color: { fg: string, bg: string }
	text: string
	constructor(
		renderer: Renderer,
		buttonType: BUTTONTYPE,
		options: {
			yfrac: number,
			xfrac: number,
			text: string,
			size: number,
			color: { fg: string, bg: string },
			onClick: () => boolean | void,
		},
		shouldDestroy: boolean = false) {
		this.renderer = renderer
		this.buttonType = buttonType
		this.fracPos = { x: options.xfrac, y: options.yfrac }
		this.color = options.color
		this.size = options.size
		this.text = options.text
		if (buttonType == "text-with-rect")
			this.createButton(options, shouldDestroy)
		else if (buttonType == "text-only")
			this.createTextButton(options, shouldDestroy)
	}
	createButton({ yfrac, xfrac, text, size, color, onClick }, shouldDestroy: boolean = false) {
		const fontSize = size / 4
		var simpleLabel = new Konva.Label({
			x: xfrac * window.innerWidth,
			y: yfrac * window.innerHeight,
		});
		console.log(xfrac * window.innerWidth, yfrac * window.innerHeight, `normal-ui ${this.button.getText().textArr[0].text}`)

		simpleLabel.add(
			new Konva.Text({
				text,
				fontFamily: 'Calibri',
				fontSize,
				padding: 5,
				fill: color.fg,
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

		const x = (window.innerWidth) * xfrac
		const y = (window.innerHeight) * yfrac

		const fontSize = size / 4
		var simpleLabel = new Konva.Label({ x, y });

		simpleLabel.add(
			new Konva.Tag({
				fill: color.bg,
				lineCap: "round",
			})
		);

		simpleLabel.add(
			new Konva.Text({
				text,
				fontFamily: 'Calibri',
				fontSize,
				padding: 5,
				fill: color.fg,
			})
		);
		const position = simpleLabel.getPosition()
		position.x -= simpleLabel.getSize().width / 2
		simpleLabel.setPosition(position)

		simpleLabel.on('click', () => {
			const pressed = onClick()
			if (pressed) {
				simpleLabel.getTag().fill("red")
			} else {
				simpleLabel.getTag().fill("#aaa")
			}
			if (shouldDestroy) {
				this.button.remove()
				this.button.destroy()
				console.log(this.button)
			}
		})

		this.button = simpleLabel
		this.renderer.stage(this.button)
	}
	update(data: any, event: EVENT): void {
		if (event == "resize") {
			if (this.buttonType == "text-only") {
				let textContainer = this.button.children
				const text = textContainer[0]
				if (text) {
					const fontSize = this.size / 4
					const x = (data.w) * this.fracPos.x
					const y = (data.h) * this.fracPos.y
					console.log(x, y, `resize-ui ${this.button.getText().textArr[0].text}`)
					this.button.setAttrs({
						'fontSize': fontSize,
						'x': x - fontSize, 'y': y,
						'fill': this.color.fg
					})
					// this.button.getText()
					// 	.fontSize(fontSize)
					// 	.fill(this.color.fg)
					// this.button.getTag().fill(this.color.bg)
					// const width = fontSize * this.text.length / 1.1
					// this.button.setPosition({ x, y })
				}
			}
		}
		else {
			switch (data) {
				case "q":
					if (this.button) {
						this.button.fire("click")
					}
					break
			}

		}
	}
}
