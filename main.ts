import { Grid } from "./componets/grid"
import { Block } from "./componets/block"
import { Renderer } from "./componets/renderer"
import { TetrominoFactory } from "./componets/tetromino"
import { EventListener } from "./componets/eventListener"
import { LISTENER } from "./componets/types"
import { Score } from "./componets/score"

const eventListener = new EventListener()
const renderer = new Renderer()
let score: Score
let mainGrid: Grid, sideGrid: Grid
let currentBlock: Block, nextBlock: Block


async function main() {
	await renderer.initApp("#FFF")  // set background
	renderer.addAppToCanvas() // append app.canvas
	startGame()
}
function startGame() {
	mainGrid = new Grid({ x: 0.5, y: 0 }, 1, 10, 20, renderer)
	sideGrid = new Grid({ x: 0.9, y: 0.5 }, 0.25, 4, 4, renderer)

	currentBlock = TetrominoFactory.createBlock()
	nextBlock = TetrominoFactory.createBlock()
	// show the grid
	mainGrid.show()
	sideGrid.show()

	score = new Score({ x: 0.9, y: 0.1 }, currentBlock.id, renderer)

	// add container to the app
	currentBlock.stageContainer(renderer)
	nextBlock.stageContainer(renderer)

	// show the tetromino
	currentBlock.showBlock(mainGrid)
	nextBlock.showBlock(sideGrid)
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
	renderer.gameLoop(animation)
}
function animation() {

	if (mainGrid.reachTop()) { // game over
		currentBlock.container.visible = false
		mainGrid.drawSpiral({
			whenFinshed: () => {
				mainGrid.clear()
				score.subPoint(50)
				currentBlock.container.visible = true
			}
		})
	}
	else if (mainGrid.blockLanded(currentBlock)) {
		mainGrid.addBlock(currentBlock);
		// clear a row
		let completed = 0
		for (let row = mainGrid.numRow - 1; row > 0; row--) {
			if (mainGrid.isEmptyRow(row)) break

			if (mainGrid.checkIfRowIsFull(row)) {
				completed++
				score.addPoint(10)
				mainGrid.clearRow(row)
			} else {
				mainGrid.moveDownRow(row, completed)
			}
		}

		removeEvents([ // clean event listener
			{ obj: currentBlock, event: "resize" },
			{ obj: currentBlock, event: "keyboard" },
			{ obj: nextBlock, event: "resize" },
		]);

		currentBlock.destruct() // delete previous
		currentBlock = TetrominoFactory.createBlock(nextBlock.id); // create a new from nextId
		currentBlock.stageContainer(renderer); // stage the new container
		currentBlock.showBlock(mainGrid)

		score.changeColor(currentBlock.id) // match the current block color

		nextBlock.destruct()
		nextBlock = TetrominoFactory.createBlock();
		nextBlock.stageContainer(renderer);
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
