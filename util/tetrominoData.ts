const wallKicks = {
	I: {
		"0-1": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
		"1-0": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
		"1-2": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
		"2-1": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
		"2-3": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
		"3-2": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
		"3-0": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
		"0-3": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
	},
	default: {
		"0-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
		"1-0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
		"1-2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
		"2-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
		"2-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
		"3-2": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
		"3-0": [[0, 0], [1, 0], [-1, -1], [0, 2], [-1, 2]],
		"0-3": [[0, 0], [-1, 0], [1, 1], [0, -2], [1, -2]]
	}
};
export const tetrominoShapes = {
	I: {
		shapes: [
			[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
			[{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }],
			[{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
			[{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }]
		],
		wallKicks: wallKicks.I
	},
	J: {
		shapes: [
			[{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
			[{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
			[{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
			[{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }]
		],
		wallKicks: wallKicks.default
	},
	L: {
		shapes: [
			[{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
			[{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
			[{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }],
			[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }]

		],
		wallKicks: wallKicks.default
	},
	O: {
		shapes: [
			[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
			[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
			[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
			[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
		],
		wallKicks: []
	},
	S: {
		shapes: [
			[{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
			[{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
			[{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
			[{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }]
		],
		wallKicks: wallKicks.default
	},
	T: {
		shapes: [
			[{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
			[{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
			[{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
			[{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }]
		],
		wallKicks: wallKicks.default
	},
	Z: {
		shapes: [
			[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
			[{ x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
			[{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
			[{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }]
		],
		wallKicks: wallKicks.default
	}
};


