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
	notes = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"] // tezeta
	muted = false
	noteDirection = 1

	constructor() {

		this.synth = this.notes.map(() => new Tone.Synth({ volume: -15, }).toDestination())

		this.homeTheme = new Audio("/assets/sound/tetris theme.mp3")

		this.crashMusic = new Audio("/assets/sound/ding.mp3")
		this.crashMusic.volume = 0.2

		this.collectPointMusic = new Audio("/assets/sound/collect-points.mp3")
		this.collectPointMusic.volume = 0.2

		this.gameOverMusic = new Audio("/assets/sound/game-over.mp3")
		this.gameOverMusic.volume = 0.2
		this.levelCompletedMusic = new Audio("/assets/sound/levelUp.mp3")
		this.levelCompletedMusic.volume = 0.5

	}
	startMusic() {
		this.homeTheme.play()
		this.homeTheme.volume = 0.5
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
				.triggerAttackRelease(this.notes[this.notePosition], "2n")
	}
	gameOver() {
		this.gameOverMusic.play()
	}
	playNote() {
		if (!this.muted) {
			this.synth[this.notePosition]
				.triggerAttackRelease(this.notes[this.notePosition], "8n")
			this.notePosition += this.noteDirection
			if (this.notePosition < 0 || this.notePosition >= this.notes.length) {
				this.noteDirection *= -1
				this.notePosition += this.noteDirection // undo 
				this.notePosition += this.noteDirection // undo 
			}

		}
	}
	pause() {
		this.homeTheme.pause()
	}
	play() {
		this.homeTheme.play()
	}
}
