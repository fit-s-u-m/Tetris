import * as PIXI from "pixi.js"

async function main(): Promise<void> {
	const app = new PIXI.Application()
	await app.init({ width: 640, height: 360, background: "#00ffff" })
	document.body.appendChild(app.canvas);
}
main()
