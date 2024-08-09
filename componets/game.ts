import { Grid } from "./grid"
import { Renderer } from "./renderer"
import { GhostBlock, PreviewBlock, MainBlock } from "./tetromino"
import { EventListener, EventObserver } from "./eventListener"
import { EVENT, EVENTLISTENER, GAMESOUND, GRID, LISTENER, RENDERER, SCORE } from "./types"
import { Score } from "./score"
import { GameSound } from "./sound.ts"
import { Button } from "./ui"
import { Particles } from "./particle.ts"

export class Tetris implements EventObserver {
	eventListener: EVENTLISTENER
	renderer: RENDERER
	score: SCORE
	gameSound: GAMESOUND
	mainGrid: GRID
	previewGrid: GRID
	currentBlock: MainBlock
	nextBlock: PreviewBlock
	ghostBlock: GhostBlock
	muted: boolean = false
	hardPressed = false
	particle: Particles // TODO: 
	gameOn = false
	constructor() {
		this.gameSound = new GameSound()
		this.renderer = new Renderer(this.gameSound)
		this.eventListener = new EventListener()
		this.init()
	}
	private init() {
		this.renderer.initApp()  // set background
	}
	async startGame() {
		this.mainGrid = new Grid({ x: 0.5, y: 0.05 }, 1, 10, 20, this.renderer)
		this.previewGrid = new Grid({ x: 0.7, y: 0.05 }, 0.2, 4, 4, this.renderer)
		this.previewGrid.calculateSidePos(this.mainGrid)

		this.mainGrid.show()
		this.previewGrid.show()
		this.nextBlock = new PreviewBlock(this.renderer, this.previewGrid)
		this.currentBlock = new MainBlock(this.renderer, this.gameSound)
		this.ghostBlock = new GhostBlock(this.currentBlock)

		// simple label
		this.currentBlock.setShadow(this.ghostBlock)

		this.particle = new Particles()
		await this.particle.init()
		this.score = new Score({ x: 0.8, y: 0.1, mainGrid: this.mainGrid, previewGrid: this.previewGrid }, this.currentBlock.id, this.renderer)
		this.setupEventListeners()
		//
		const startButton = new Button(this.renderer, "text-only", {
			yfrac: -0.5,
			xfrac: -0.5,
			text: "start",
			size: 150,
			color: { fg: 8, bg: 9 },
			grid: this.mainGrid,
			onClick: () => {
				this.gameSound.startMusic()
				this.currentBlock.showBlock(this.mainGrid)
				this.ghostBlock.shadow()

				this.renderer.gameLoop(this.gameLoop, this)
				this.mainGrid.clear()
				// this.currentBlock.isGameOn = this.gameOn
				this.gameOn = true
			}
		}, true)
		const muteButton = new Button(this.renderer, "text-only", {
			yfrac: -1,
			xfrac: -1,
			text: "mute",
			size: 50,
			color: { fg: 8, bg: 9 },
			grid: this.mainGrid,
			onClick: () => {
				this.muted = !this.muted
				if (this.muted)
					this.gameSound.mute()
				else
					this.gameSound.unMute()
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
			{ obj: this.score, event: "resize" },
			{ obj: startButton, event: "resize" },
			{ obj: muteButton, event: "resize" },
			{ obj: this.renderer, event: "keyboard" }, // to pause and play
			{ obj: this, event: "keyboard" }, // to check hardpress
		])
		this.mainGrid.colorAll(8)// color grid black
	}
	gameLoop = () => {
		this.currentBlock.isGameOn = this.gameOn
		if (this.mainGrid.reachTop())  // game over
			this.gameOver()
		else if (this.mainGrid.blockLanded(this.currentBlock, { x: 0, y: 1 }) || this.hardPress()) {
			this.newGeneration()
		}
		else {
			this.currentBlock.moveDown()
		}
	}
	async gameOver() {
		this.gameOn = false
		this.renderer.pauseLoop()
		this.gameSound.gameOver()
		this.currentBlock.container.hide()
		this.ghostBlock.container.hide()
		this.nextBlock.container.hide()

		this.currentBlock.speed = 0
		this.score.subPoint(100) // penality
		await this.mainGrid.drawSpiral()
		const restartButton = new Button(this.renderer, "text-only", {
			yfrac: -0.5,
			xfrac: -0.5,
			text: "restart",
			size: 150,
			color: { fg: 8, bg: 9 },
			grid: this.mainGrid,
			onClick: () => {
				this.mainGrid.clear()

				this.currentBlock.container.show()
				this.nextBlock.container.show()
				this.ghostBlock.container.show()

				this.ghostBlock.shadow()
				this.gameOn = true
				this.gameSound.startMusic()
				this.score.setLevelValue(1)// reset the level
				this.currentBlock.speed = this.currentBlock.normalSpeed  // reset the speed
				this.renderer.gameLoop(this.gameLoop, this)
			}
		}, true)
		this.listenEvents([
			{ obj: restartButton, event: "resize" },
		])
	}
	async newGeneration() {
		if (this.hardPressed) {
			this.mainGrid.addBlock(this.ghostBlock);
			this.hardPress(true)// toogle is back off
		}
		else
			this.mainGrid.addBlock(this.currentBlock);

		this.gameSound.crash()
		// clear a row
		this.ghostBlock.container.hide()
		this.currentBlock.container.hide()
		await this.clearRow() // check and clear row
		this.ghostBlock.container.show()
		this.currentBlock.container.show()

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
				this.renderer.pauseLoop()
				await this.mainGrid.clearEntireRow(row)
				this.renderer.startLoop()
			} else if (completed > 0) {
				// this.particle.drawWin()
				this.renderer.pauseLoop()
				await this.mainGrid.moveDownRow(row, completed)
				this.renderer.startLoop()
			}

		}
		if (completed != 0) {
			this.score.calculateScore(completed, this.currentBlock, this.gameSound)
			this.gameSound.collectPoint()// make sound
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
			// event.preventDefault()
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
		if (event == "keyboard" && this.gameOn) {
			switch (data) {
				case " ":
					this.hardPress(true)
					break

			}
		}
	}

}
