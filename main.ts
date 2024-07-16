import { Grid } from "./componets/grid"
import { Block } from "./componets/block"
import { Renderer } from "./componets/renderer"
import { TetrominoFactory } from "./componets/tetromino"
import { EventListener } from "./componets/eventListener"
import { LISTENER } from "./componets/types"
import { Score } from "./componets/score"
import { GameSound } from "./componets/sound.ts"
import { Button } from "./componets/ui.ts"

const eventListener = new EventListener()
const renderer = new Renderer()
let score: Score
let gameSound: GameSound
let ui: Button

let mainGrid: Grid, sideGrid: Grid
let currentBlock: Block, nextBlock: Block

let mute: boolean = false

async function main() {
	await renderer.initApp("#FFF")  // set background
	renderer.addAppToCanvas() // append app.canvas
	startGame()
}
function startGame() {
	mainGrid = new Grid({ x: 0.5, y: 0 }, 1, 10, 20, renderer)
	sideGrid = new Grid({ x: 0.9, y: 0.5 }, 0.25, 4, 4, renderer)

	// show the grid
	mainGrid.show()
	sideGrid.show()
	gameSound = new GameSound()

	currentBlock = TetrominoFactory.createBlock()
	nextBlock = TetrominoFactory.createBlock()

	// add container to the app
	currentBlock.stageContainer(renderer, gameSound)
	nextBlock.stageContainer(renderer, gameSound)


	setupEventListeners()
	listenEvents([
		{ obj: mainGrid, event: "resize" },
		{ obj: sideGrid, event: "resize" },
		{ obj: currentBlock, event: "resize" },
		{ obj: currentBlock, event: "keyboard" },
		{ obj: nextBlock, event: "resize" },
		{ obj: score, event: "resize" },
	])
	// set up sound 
	ui = new Button(renderer)
	mainGrid.colorAll(8)// color grid black
	ui.createTextButton({
		yfrac: 0.4,
		xfrac: 0.5,
		text: "start",
		size: 150,
		color: "#fff",
		calback: () => {
			score = new Score({ x: 0.8, y: 0.1 }, currentBlock.id, renderer)
			gameSound.startMusic()
			currentBlock.showBlock(mainGrid)
			nextBlock.showBlock(sideGrid)
			renderer.gameLoop(animation)
			mainGrid.clear()
		}
	}, true)

	ui.createButton({
		yfrac: 0.2,
		xfrac: 0.1,
		text: "mute",
		size: 50,
		color: { fg: "#fff", bg: "#AAA" },
		calback: () => {
			mute = !mute
			if (mute)
				gameSound.mute()
			else
				gameSound.unMute()
			return mute
		}
	})

}
function animation() {
	if (mainGrid.reachTop()) { // game over
		currentBlock.container.visible = false
		currentBlock.speed = 0
		nextBlock.container.visible = false
		// gameSound.gameOver.play()
		mainGrid.drawSpiral({
			whenFinshed: () => {
				renderer.stopLoop(animation)
				ui.createTextButton({
					yfrac: 0.5,
					xfrac: 0.5,
					text: "restart",
					size: 150,
					color: "#fff",
					calback: () => {
						mainGrid.clear()
						score.subPoint(100) // penality
						currentBlock.container.visible = true
						nextBlock.container.visible = true
						currentBlock.speed = currentBlock.normalSpeed
						renderer.gameLoop(animation)
					}
				}, true)
			}
		})

	}
	else if (mainGrid.blockLanded(currentBlock)) {
		mainGrid.addBlock(currentBlock);
		gameSound.collison()
		// clear a row
		let completed = 0
		for (let row = mainGrid.numRow - 1; row > 0; row--) {
			if (mainGrid.isEmptyRow(row)) break

			if (mainGrid.checkIfRowIsFull(row)) {
				completed++
				mainGrid.clearRow(row)
			} else {
				mainGrid.moveDownRow(row, completed)
			}
		}
		if (completed != 0) {
			score.calculateScore(completed, currentBlock)
			gameSound.score()// make sound
		}

		removeEvents([ // clean event listener
			{ obj: currentBlock, event: "resize" },
			{ obj: currentBlock, event: "keyboard" },
			{ obj: nextBlock, event: "resize" },
		]);

		currentBlock.clone(nextBlock)

		currentBlock.destruct()
		currentBlock = TetrominoFactory.createBlock(nextBlock.id);
		currentBlock.stageContainer(renderer, gameSound);
		currentBlock.showBlock(mainGrid)

		score.changeColor(currentBlock.id) // match the current block color

		nextBlock.destruct()
		nextBlock = TetrominoFactory.createBlock();
		nextBlock.stageContainer(renderer, gameSound);
		nextBlock.showBlock(sideGrid)

		listenEvents([
			{ obj: currentBlock, event: "resize" },
			{ obj: currentBlock, event: "keyboard" },
			{ obj: nextBlock, event: "resize" },
		])
	}
	else {
		currentBlock.moveDown()
	}
}
main()

function listenEvents(listeners: LISTENER) {
	for (const listener of listeners) {
		eventListener.addEventObserver(listener.obj, listener.event);
	}
}
function removeEvents(listeners: LISTENER) {
	for (const listener of listeners) {
		eventListener.removeEventObserver(listener.obj, listener.event);
	}
}

function setupEventListeners() {

	// initalize  listeners
	window.addEventListener('resize', (_event) => {
		const xdata = window.innerWidth
		const ydata = window.innerHeight
		const data = { w: xdata, h: ydata }
		eventListener.notifyEventObserver(data, "resize")
	});

	window.addEventListener('keydown', (event) => {
		const data = event.key
		eventListener.notifyEventObserver(data, "keyboard")
	});

}
