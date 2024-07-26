import * as PIXI from "@pixi/sound"
export class GameSound {
	homeTheme: PIXI.Sound
	crash: PIXI.Sound
	gameOver: PIXI.Sound
	levelCompleted: PIXI.Sound
	notes: PIXI.Sound
	collectPoint: PIXI.Sound
	notePosition: number = 1

	constructor() {
		this.homeTheme = PIXI.sound.add("home-theme", "/assets/sound/home.mp3")
		this.homeTheme.volume = 0.5
		this.homeTheme.loop = true

		this.crash = PIXI.sound.add("crash", "/assets/sound/ding.mp3")
		this.crash.volume = 0.01

		this.collectPoint = PIXI.sound.add("score", "/assets/sound/collect-points.mp3")
		this.collectPoint.volume = 0.01

		this.gameOver = PIXI.sound.add("game-over", "/assets/sound/game-over-arcade.mp3")
		this.gameOver.volume = 0.01
		this.levelCompleted = PIXI.sound.add("level-completed", "/assets/sound/level-completed.mp3")
		this.levelCompleted.volume = 0.1
		const spirtes = {
			'1': { start: 0, end: 0.3 },
			'2': { start: 0.4, end: 0.7 },
			'3': { start: 0.9, end: 1.2 },
			'4': { start: 1.4, end: 1.7 },
			'5': { start: 1.9, end: 2.2 },
			'6': { start: 2.4, end: 2.8 },
			'7': { start: 3, end: 3.3 },
			'8': { start: 3.4, end: 3.7 },
			'9': { start: 3.9, end: 4.2 },
			'10': { start: 4.4, end: 4.7 },
			'11': { start: 4.9, end: 5.2 },
			'12': { start: 5.4, end: 5.7 },
			'13': { start: 5.9, end: 6.2 },
			'14': { start: 6.3, end: 6.6 },
			'15': { start: 6.9, end: 7.2 },
			'16': { start: 7.4, end: 7.7 },
			'17': { start: 7.9, end: 8.2 },
			'18': { start: 8.4, end: 8.7 },
			'19': { start: 8.8, end: 9.1 },
			'20': { start: 9.4, end: 9.7 },
			'21': { start: 9.9, end: 10.2 },
			'22': { start: 10.4, end: 10.7 },
			'23': { start: 10.9, end: 11.2 },
			'24': { start: 11.4, end: 11.7 },
			'25': { start: 11.9, end: 12.2 },
		}
		this.notes = PIXI.Sound.from({
			url: "/assets/sound/piano.wav",
			sprites: spirtes
		})
		this.notes.volume = 0.1

	}
	startMusic() {
		this.homeTheme.autoPlay = true
		this.homeTheme.play()
	}
	mute() {
		PIXI.sound.muteAll()
	}
	unMute() {
		PIXI.sound.unmuteAll()
	}
	collison() {
		this.crash.play()
	}
	score() {
		this.collectPoint.play()
	}
	levelUp() {
		this.levelCompleted.play()
	}
	playNote() {
		const randomNum = this.notePosition.toString()
		this.notes.play(randomNum)
		this.notePosition++
		if (this.notePosition == 25) {
			this.notePosition = 1
		}
	}
}
