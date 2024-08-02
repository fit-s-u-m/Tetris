import { Grid } from "./grid.ts"
import { Renderer } from "./renderer"
import { GhostBlock, PreviewBlock, MainBlock } from "./tetromino"
import { EventListener, EventObserver } from "./eventListener"
import { EVENT, EVENTLISTENER, GAMESOUND, GRID, LISTENER, RENDERER, SCORE } from "./types"
import { Score } from "./score"
// import { GameSound } from "./sound.ts"
import { Button } from "./ui.ts"
// import { Particles } from "./particle.ts"

export class Tetris implements EventObserver {
	eventListener: EVENTLISTENER
	renderer: RENDERER
	score: SCORE
	// gameSound: GAMESOUND
	mainGrid: GRID
	previewGrid: GRID
	currentBlock: MainBlock
	nextBlock: PreviewBlock
	ghostBlock: GhostBlock
	muted: boolean = false
	hardPressed = false
	// particle: Particles // TODO: 
	constructor() {
		this.renderer = new Renderer()
		this.eventListener = new EventListener()
		this.init()
	}
	private init() {
		this.renderer.initApp()  // set background
	}
	startGame() {
		this.mainGrid = new Grid({ x: 0.5, y: 0 }, 1, 10, 20, this.renderer)
		this.previewGrid = new Grid({ x: 0.9, y: 0.5 }, 0.25, 4, 4, this.renderer)

		this.mainGrid.show()
		this.previewGrid.show()

		this.nextBlock = new PreviewBlock(this.renderer, this.previewGrid)
		this.currentBlock = new MainBlock(this.renderer)
		this.ghostBlock = new GhostBlock(this.currentBlock)

		// simple label
		this.currentBlock.setShadow(this.ghostBlock)
		// this.particle = new Particles()
		// await this.particle.init()
		//
		// this.score = new Score({ x: 0.8, y: 0.1 }, this.currentBlock.id, this.renderer)
		//
		this.setupEventListeners()
		const startButton = new Button(this.renderer, "text-only", {
			yfrac: 0.4,
			xfrac: 0.5,
			text: "start",
			size: 150,
			color: { fg: "fff", bg: "#fff" },
			onClick: () => {
				// this.gameSound.startMusic()
				this.currentBlock.showBlock(this.mainGrid)
				this.ghostBlock.shadow()

				this.renderer.gameLoop(this.gameLoop, this)
				this.mainGrid.clear()
			}
		}, true)
		const muteButton = new Button(this.renderer, "text-only", {
			yfrac: 0.2,
			xfrac: 0.1,
			text: "mute",
			size: 50,
			color: { fg: "#fff", bg: "#aaa" },
			onClick: () => {
				this.muted = !this.muted
				if (this.muted)
					console.log("muted")
				// this.gameSound.mute()
				else
					console.log("unmuted")
				// this.gameSound.unMute()
				return this.muted
			}

		}, false)
		this.listenEvents([
			{ obj: this.mainGrid, event: "resize" },
			{ obj: this.previewGrid, event: "resize" },
			{ obj: this.currentBlock, event: "resize" },
			{ obj: this.currentBlock, event: "keyboard" },
			{ obj: this.nextBlock, event: "resize" },
			{ obj: this.ghostBlock, event: "resize" },
			// { obj: this.score, event: "resize" },
			{ obj: startButton, event: "resize" },
			{ obj: muteButton, event: "resize" },
			{ obj: this.renderer, event: "keyboard" }, // to pause and play
			{ obj: this, event: "keyboard" }, // to check hardpress
		])
		this.mainGrid.colorAll(8)// color grid black
	}
	gameLoop = () => {
		if (this.mainGrid.reachTop())  // game over
			this.gameOver()
		else if (this.mainGrid.blockLanded(this.currentBlock, { x: 0, y: 1 }) || this.hardPress()) {
			this.newGeneration()
		}
		else {
			this.currentBlock.moveDown()
		}
		window.requestAnimationFrame(this.gameLoop)
	}
	gameOver() {
		// this.gameSound.homeTheme.stop()
		this.currentBlock.container.hide()
		this.ghostBlock.container.hide()
		this.nextBlock.container.hide()

		this.currentBlock.speed = 0
		// this.gameSound.gameOver.play()
		this.score.subPoint(100) // penality
		this.mainGrid.drawSpiral({
			whenFinshed: () => {
				// this.renderer.stopLoop(this.gameLoop, this)
				this.mainGrid.container.hide()
				const restartButton = new Button(this.renderer, "text-only", {
					yfrac: 0.5,
					xfrac: 0.5,
					text: "restart",
					size: 150,
					color: { fg: "#FFF", bg: "#fff" },
					onClick: () => {
						this.mainGrid.clear()
						this.currentBlock.container.show()
						this.nextBlock.container.show()
						this.ghostBlock.container.show()
						this.mainGrid.container.show()
						this.currentBlock.speed = this.currentBlock.normalSpeed
						this.renderer.gameLoop(this.gameLoop, this)
					}
				}, true)
				this.listenEvents([
					{ obj: restartButton, event: "resize" },
				])
			}
		})
	}
	async newGeneration() {
		if (this.hardPressed) {
			this.mainGrid.addBlock(this.ghostBlock);
			this.hardPress(true)// toogle is back off
		}
		else
			this.mainGrid.addBlock(this.currentBlock);

		// this.gameSound.collison()
		// clear a row
		await this.clearRow() // check and clear row

		this.currentBlock.createNew(this.nextBlock)
		this.ghostBlock.shadow()
		this.nextBlock.createNew()
		this.score.changeColor(this.currentBlock.id) // match the current block color

	}
	private async clearRow() {
		let completed = 0
		for (let row = this.mainGrid.numRow - 1; row > 0; row--) { // for every row starting from bottom
			if (this.mainGrid.isEmptyRow(row)) break
			if (this.mainGrid.checkIfRowIsFull(row)) {
				completed++
				// this.renderer.pauseLoop()
				await this.mainGrid.clearEntireRow(row)
				// this.renderer.startLoop()
			} else if (completed > 0) {
				// this.particle.drawWin()
				// this.renderer.pauseLoop()
				await this.mainGrid.moveDownRow(row, completed)
				// this.renderer.startLoop()
			}

		}
		if (completed != 0) {
			// this.score.calculateScore(completed, this.currentBlock, this.gameSound)
			// this.gameSound.score()// make sound
		}
		return completed
	}
	private listenEvents(listeners: LISTENER) {
		for (const listener of listeners) {
			this.eventListener.addEventObserver(listener.obj, listener.event);
		}
	}
	private setupEventListeners() {

		// initalize  listeners
		window.addEventListener('resize', (_event) => {
			const xdata = window.innerWidth
			const ydata = window.innerHeight
			const data = { w: xdata, h: ydata }
			this.eventListener.notifyEventObserver(data, "resize")
		});

		window.addEventListener('keydown', (event) => {
			const data = event.key
			this.eventListener.notifyEventObserver(data, "keyboard")
		});

	}
	hardPress(toggle = false) {
		if (toggle)
			this.hardPressed = !this.hardPressed // toggle
		return this.hardPressed
	}
	update(data: any, event: EVENT): void {
		if (event == "keyboard") {
			switch (data) {
				case " ":
					this.hardPress(true)
					break
				case "Enter":
					// this.renderer.startLoop()
					this.startGame()
					break

			}
		}
	}

}
