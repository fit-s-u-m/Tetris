import { PIXICONTAINER, RENDERER } from "./types"
export class Particles {
	emitterContainer: PIXICONTAINER
	renderer: RENDERER
	constructor(renderer: RENDERER) {
		this.emitterContainer = renderer.createContainer()
		renderer.stage(this.emitterContainer)
		this.renderer = renderer
		this.draw()
	}
	private draw() {
		for (let i = 0; i < 10; i++) {
			this.emitterContainer.addChild(this.renderer.drawCircle(0, 0, 10, i % 7 + 1))
		}
	}
	// update(delta) {
	// 	this.sprite.x += this.vx * delta;
	// 	this.sprite.y += this.vy * delta;
	// 	this.age += delta;
	// }
	//
	// isAlive() {
	// 	return this.age < this.lifetime;
	// }

	redraw() {
		this.emitterContainer.removeChildren()
		this.draw()
	}
	start(spawnPos: { x: number, y: number }) { // start emitting particles
		this.emitterContainer.x = spawnPos.x
		this.emitterContainer.y = spawnPos.y
		this.wiggle()
	}
	wiggle(wiggleAmount: number = 10) {
		for (const child of this.emitterContainer.children) {
			child.x += Math.random() * wiggleAmount
			child.y += Math.random() * wiggleAmount
		}
		this.redraw()
	}
}
