import { Block } from "./block"

class IBlock extends Block {
	constructor() {
		super()
		this.id = 1
		this.orientation[0] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 }]
		this.orientation[1] = [
			{ x: 2, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 2, y: 3 }]
		this.orientation[2] = [
			{ x: 0, y: 2 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 },
			{ x: 3, y: 2 }]
		this.orientation[3] = [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 1, y: 3 }]
	}
}
class TBlock extends Block {
	constructor() {
		super()
		this.id = 2

		this.orientation[0] = [
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }]
		this.orientation[1] = [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 1, y: 2 }]
		this.orientation[2] = [
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 1, y: 2 }]
		this.orientation[3] = [
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 }]

	}
}
class JBlock extends Block {
	constructor() {
		super()
		this.id = 3

		this.orientation[0] = [
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }]
		this.orientation[1] = [
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 }]
		this.orientation[2] = [
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 }]
		this.orientation[3] = [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 0, y: 2 },
			{ x: 1, y: 2 }]


	}
}
class LBlock extends Block {
	constructor() {
		super()
		this.id = 4

		this.orientation[0] = [
			{ x: 2, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }]
		this.orientation[1] = [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 }]
		this.orientation[2] = [
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 0, y: 2 }]
		this.orientation[3] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 }]
	}
}
class SBlock extends Block {
	constructor() {
		super()
		this.id = 5

		this.orientation[0] = [
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }]
		this.orientation[1] = [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 }]
		this.orientation[2] = [
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 0, y: 2 },
			{ x: 1, y: 2 }]
		this.orientation[3] = [
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 }]
	}
}

class ZBlock extends Block {
	constructor() {
		super()
		this.id = 6

		this.orientation[0] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }]
		this.orientation[1] = [
			{ x: 2, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 1, y: 2 }]
		this.orientation[2] = [
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 }]
		this.orientation[3] = [
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 0, y: 2 }]
	}
}
class OBlock extends Block {
	constructor() {
		super()
		this.id = 7

		this.orientation[0] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }]
		this.orientation[1] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }]
		this.orientation[2] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }]
		this.orientation[3] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }]

	}
}

export class TetrominoFactory {
	static createBlock(num: number | undefined = undefined) {
		if (!num) {
			const randomNum = Math.ceil(Math.random() * 7)
			num = randomNum
		}
		switch (num) {
			case 1:
				return new IBlock()
			case 2:
				return new TBlock()
			case 3:
				return new JBlock()
			case 4:
				return new LBlock()
			case 5:
				return new SBlock()
			case 6:
				return new ZBlock()
			case 7:
				return new OBlock()
			default:
				throw new Error(`can't create ${randomNum} as a block`)
		}
	}
}

