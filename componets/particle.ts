import { RENDERER, POSITION } from "./types";
import * as PIXI from "pixi.js";
import { tsParticles } from "@tsparticles/engine";
import * as particle from "@tsparticles/all";

export class Particles {
	container: PIXI.Container;
	renderer: RENDERER;
	mesh: any;
	geometry: any;
	winParticles: any = [];
	homeParticles: any = [];
	urls: { win: string, lose: string, levelUp: string, home: string }

	constructor() {
		this.urls = {
			win: "../public/assets/particles/win.json",
			lose: "../public/assets/particles/lose.json",
			levelUp: "../public/assets/particles/levelUp.json",
			home: "../public/assets/particles/home.json"
		}
	}
	async init() {
		await particle.loadAll(tsParticles)
		await tsParticles.load({
			id: "tsparticles",
			url: this.urls.home,
			index: 1
		})
		this.homeParticles.push(tsParticles.domItem(0))
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

