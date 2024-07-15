import * as PIXI from "@pixi/sound"
export class GameSound {
	homeTheme: PIXI.Sound
	crash: PIXI.Sound
	gameOver: PIXI.Sound
	levelCompleted: PIXI.Sound
	constructor() {
		this.homeTheme = PIXI.sound.add("home-theme", "/assets/sound/tetris theme.mp3")

		this.crash = PIXI.sound.add("crash", "/assets/sound/ding.mp3")
		this.crash.volume = 0.01

		this.gameOver = PIXI.sound.add("game-over", "/assets/sound/game-over-arcade.mp3")
		this.levelCompleted = PIXI.sound.add("level-completed", "/assets/sound/level-completed.mp3")
		this.levelCompleted.volume = 0.1
	}
	startMusic() {
		this.homeTheme.autoPlay = true
		this.homeTheme.loop = true
	}
	mute() {
		PIXI.sound.muteAll()
	}
	collison() {
		this.crash.play()
	}
	score() {
		this.levelCompleted.play()
	}
}
