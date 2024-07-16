import { Renderer } from "./renderer"

export class Button {
	renderer: Renderer
	constructor(renderer: Renderer) {
		this.renderer = renderer
	}
	createButton({
		yfrac,
		xfrac,
		text,
		size,
		color,
		calback
	}: { yfrac: number, xfrac: number, text: string, size: number, calback: () => boolean | void, color: { fg: string, bg: string } }, shouldDestroy: boolean = false) {
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
			const pressed = calback()
			if (pressed) {
				buttonBg.tint = "#f00"
			} else {
				buttonBg.tint = "#000"
			}
			if (shouldDestroy)
				buttonContainer.destroy()
		});
		this.renderer.stage(buttonContainer)
	}
	createTextButton({
		yfrac,
		xfrac,
		text,
		size,
		color,
		calback
	}: { yfrac: number, xfrac: number, text: string, size: number, calback: () => boolean | void, color: string }, shouldDestroy: boolean = false) {
		const x = (window.innerWidth) * xfrac
		const y = (window.innerHeight) * yfrac

		const buttonContainer = this.renderer.createContainer()
		const fontsize = size / 4
		const width = fontsize * text.length / 1.1

		const textStyle = this.renderer.makeTextStyle(fontsize, color)
		const buttonText = this.renderer.drawText(text, x - width / 4, y, textStyle)

		buttonContainer.addChild(buttonText)
		buttonContainer.interactive = true; // Enable interaction

		buttonContainer.on('pointerdown', () => {
			calback()
			if (shouldDestroy)
				buttonContainer.destroy()
		});
		this.renderer.stage(buttonContainer)
	}
}
