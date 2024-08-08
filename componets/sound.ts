import * as Tone from 'tone'
export class GameSound {
	homeTheme: HTMLAudioElement
	crashMusic: HTMLAudioElement
	gameOverMusic: HTMLAudioElement
	levelCompletedMusic: HTMLAudioElement
	collectPointMusic: HTMLAudioElement
	hardDropMusic: HTMLAudioElement
	notePosition: number = 0
	synth: Tone.Synth[]
	num_notes = 5
	notes = ["D2", "E2", "F#2", "G#2", "A#2"] // tezeta
	muted = false

	constructor() {

		this.synth = this.notes.map(() => new Tone.MembraneSynth({ volume: -10 }).toDestination())

		this.homeTheme = new Audio("../public/assets/sound/home.mp3")

		this.crashMusic = new Audio("../public/assets/sound/se_game_special.mp3")
		this.crashMusic.volume = 0.2

		this.hardDropMusic = new Audio("../public/assets/sound/se_game_harddrop.mp3")
		this.hardDropMusic.volume = 0.2

		this.collectPointMusic = new Audio("/assets/sound/collect-points.mp3")
		this.collectPointMusic.volume = 0.2

		this.gameOverMusic = new Audio("/assets/sound/game-over-arcade.mp3")
		this.gameOverMusic.volume = 0.2
		this.levelCompletedMusic = new Audio("/assets/sound/level-completed.mp3")
		this.levelCompletedMusic.volume = 0.2

	}
	startMusic() {
		this.homeTheme.play()
		this.homeTheme.volume = 0.1
		this.homeTheme.loop = true
	}
	mute() {
		this.homeTheme.muted = true
		this.synth.forEach(x => x.volume.value = 0)
		this.muted = false
	}
	unMute() {
		this.homeTheme.muted = false
		this.synth.forEach(x => x.volume.value = -10)
		this.muted = true
	}
	crash() {
		this.crashMusic.play()
	}
	collectPoint() {
		this.collectPointMusic.play()
	}
	levelCompleted() {
		this.levelCompletedMusic.play()
	}
	hardDrop() {
		if (!this.muted)
			this.synth[this.notePosition]
				.triggerAttackRelease(this.notes[this.notePosition], "4n")
	}
	gameOver() {
		this.gameOverMusic.play()
	}
	playNote() {
		if (!this.muted) {
			this.synth[this.notePosition]
				.triggerAttackRelease(this.notes[this.notePosition], "8n")
			this.notePosition++
			if (this.notePosition == this.num_notes) {
				this.notePosition = 0
			}

		}
	}
}
