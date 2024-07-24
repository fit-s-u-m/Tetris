import { EventObserver } from "./eventListener"
import { Renderer } from "./renderer"
import { BUTTONTYPE, PIXICONTAINER, TEXT } from "./types"

export class Button implements EventObserver {
	renderer: Renderer
	button: PIXICONTAINER
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
		const x = (window.innerWidth) * xfrac
		const y = (window.innerHeight) * yfrac

		const buttonContainer = this.renderer.createContainer()
		const fontsize = size / 4
		const width = fontsize * text.length / 1.1

		const xcenter = x - width / 2
		const ycenter = y

		const buttonBg = this.renderer.drawRoundRect(xcenter, ycenter, width, size / 2, color.bg)
		buttonBg.tint = "#000"

		const textStyle = this.renderer.makeTextStyle(fontsize, color.fg)
		const buttonText = this.renderer.drawText(text, x - width / 3, y + width / 16, textStyle)

		buttonContainer.addChild(buttonBg, buttonText)
		buttonContainer.interactive = true; // Enable interaction

		buttonContainer.on('pointerdown', () => {
			const pressed = onClick()
			if (pressed) {
				buttonBg.tint = "#f00"
			} else {
				buttonBg.tint = "#000"
			}
			if (shouldDestroy)
				buttonContainer.destroy()
		});
		this.button = buttonContainer
		this.renderer.stage(buttonContainer)
	}
	createTextButton({ yfrac, xfrac, text, size, color, onClick }, shouldDestroy = false) {

		const x = (window.innerWidth) * xfrac
		const y = (window.innerHeight) * yfrac

		const buttonContainer = this.renderer.createContainer()
		const fontsize = size / 4
		const width = fontsize * text.length / 1.1

		const textStyle = this.renderer.makeTextStyle(fontsize, color.fg)
		const buttonText = this.renderer.drawText(text, x - width / 4, y, textStyle)

		buttonContainer.addChild(buttonText)
		buttonContainer.interactive = true; // Enable interaction
		buttonContainer.cursor = 'pointer'
		buttonContainer.eventMode = 'static';

		buttonContainer.on('pointerdown', () => {
			const pressed = onClick()
			if (pressed) {
				const newtextStyle = this.renderer.makeTextStyle(fontsize, color.bg)
				buttonText.style = newtextStyle
			} else {
				const newtextStyle = this.renderer.makeTextStyle(fontsize, color.fg)
				buttonText.style = newtextStyle
			}
			if (shouldDestroy)
				buttonContainer.destroy()
		});
		this.renderer.stage(buttonContainer)
		this.button = buttonContainer
	}
	update(data: any, _event: string): void {
		if (this.buttonType == "text-only") {
			let textContainer = this.button.children
			const text = textContainer[0]
			if (text) {
				const fontSize = this.size / 4
				const textStyle = this.renderer.makeTextStyle(fontSize, this.color.fg)
				text.style = textStyle
				const width = fontSize * this.text.length / 1.1
				const x = (data.w) * this.fracPos.x
				const y = (data.h) * this.fracPos.y
				text.x = x - width / 4
				text.y = y

			}
		}
		else {
		}
	}
}
