import { RENDERER } from "./types";
import { tsParticles } from "@tsparticles/engine";
import * as particle from "@tsparticles/all";

export class Particles {
	renderer: RENDERER;
	mesh: any;
	geometry: any;
	winParticles: any = [];
	homeParticles: any = [];
	urls: { win: string, home: string }

	constructor() {
		this.urls = {
			win: "Tetris/assets/particles/win.json",
			home: "/Tetris/assets/particles/home.json"
		}
	}
	async init() {
		await particle.loadAll(tsParticles)
		await tsParticles.load({
			id: "tsparticles",
			url: this.urls.home,
			index: 1
		})
	}
	async drawWin() {
		await tsParticles.load({
			id: "tsparticles",
			url: this.urls.win,
		})
		this.winParticles.push(tsParticles.domItem(0))
		await this.sleep(1000)
		for (const particle of this.winParticles) { // stop
			particle.stop()
		}
		this.init()
	}
	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	pause() {
		this.winParticles[0].pause()
	}
	async stop() {
		await this.sleep(1000)
		for (const particle of this.winParticles) {
			particle.stop()
		}
	}
	play() {
		this.winParticles[0].play()
	}

}

