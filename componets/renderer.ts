// import * as  PIXI from "pixi.js"
import { EventObserver } from "./eventListener"
import { EVENT, POSITION } from "./types"
import * as THREE from "three"
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import GUI from "lil-gui";


export class Renderer implements EventObserver {
	scene: THREE.Scene
	camera: THREE.Camera
	renderer: THREE.WebGLRenderer
	fontloader: FontLoader
	readonly color: string[]
	private isPaused = false
	gui: GUI
	constructor() {
		this.color = [
			"#222222",
			"#FD3F59",
			"#800080",
			"#ffff00",
			"#ff7f00",
			"#00ffff",
			"#7f7f7f",
			"#00A200",
			"#000000"
		]
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
		this.camera.position.z = 100
		this.gui = new GUI()
		this.gui.add(this.camera.position, "z", 10, 1000)
	}
	initApp() {
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.fontloader = new FontLoader()
	}
	render() {
		this.renderer.render(this.scene, this.camera)
	}
	addAppToCanvas() {
		document.body.appendChild(this.renderer.domElement)
	}
	stage(mesh: THREE.Mesh | THREE.Group): void {
		this.scene.add(mesh)
	}
	createContainer() {
		return new THREE.Group()
	}
	getSize(group: THREE.Group) {
		const box = new THREE.Box3().setFromObject(group)
		const size = new THREE.Vector3()
		box.getSize(size)
		return size
	}
	drawRoundSquare(x: number, y: number, s: number, c: number, alpha: number = 1): THREE.Mesh {
		const geometry = new THREE.BoxGeometry(s, s, s)
		const material = new THREE.MeshBasicMaterial({ color: this.color[c], transparent: true, opacity: alpha })
		const square = new THREE.Mesh(geometry, material)
		square.position.set(x, y, 0)
		return square
	}
	drawRoundRect(x: number, y: number, sx: number, sy: number, c: string): THREE.Mesh {
		const geometry = new THREE.BoxGeometry(sx, sy, 0)
		const material = new THREE.MeshBasicMaterial({ color: c })
		const rect = new THREE.Mesh(geometry, material)
		rect.position.set(x, y, 0)
		return rect
	}
	drawRect(x: number, y: number, sx: number, sy: number, c: string): THREE.Mesh {
		const geometry = new THREE.BoxGeometry(sx, sy, 0)
		const material = new THREE.MeshBasicMaterial({ color: c })
		const rect = new THREE.Mesh(geometry, material)
		rect.position.set(x, y, 0)
		return rect
	}
	drawSquare(x: number, y: number, s: number, c: number, alpha: number = 1): THREE.Mesh {
		const geometry = new THREE.BoxGeometry(s, s, s)
		const material = new THREE.MeshBasicMaterial({ color: "red", transparent: true, opacity: alpha })
		const square = new THREE.Mesh(geometry, material)
		square.position.set(x, y, 0)
		return square
	}
	makeTextStyle() {
		const font = this.fontloader.load(
			// resource URL
			'fonts/helvetiker_bold.typeface.json',

			// onLoad callback
			function(font) {
				// do something with the font
				console.log(font);
			},

			// onProgress callback
			function(xhr) {
				console.log((xhr.loaded / xhr.total * 100) + '% loaded');
			},

			// onError callback
			function(err) {
				console.log('An error happened');
			}
		);
	}
	// drawText(text: string, x: number, y: number, style: PIXI.TextStyle): PIXI.Text {
	// 	const textDrawing = new PIXI.Text({ text, style })
	// 	textDrawing.x = x
	// 	textDrawing.y = y
	// 	return textDrawing
	//
	// }
	//
	// drawCircle(x: number, y: number, r: number, c: number) {
	// 	return new PIXI.Graphics()
	// 		.circle(x, y, r)
	// 		.fill(this.color[c])
	// }
	//
	gameLoop(callback: () => void) {
		this.renderer.setAnimationLoop(callback)
	}
	// delayGame(time: number) {
	// 	this.scene.ticker.stop()
	// 	// block.speed = 0
	//
	// 	setTimeout(
	// 		() => {
	// 			this.scene.ticker.start()
	// 			// block.speed = 0
	// 		}
	// 		, time)
	// }
	stopLoop() {
		this.renderer.setAnimationLoop(null);
	}
	// pauseLoop() {
	// 	this.scene.ticker.stop()
	// }
	// startLoop() {
	// 	this.scene.ticker.start()
	// }
	// updateLoop() {
	// 	this.scene.ticker.update()
	// }
	getMid() {
		return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
	}
	update(data: any, event: EVENT): void {
		if (event == "keyboard") {
			switch (data) {
				case "p":
					if (this.isPaused) {
						// this.startLoop()
						// this.sound.homeTheme.play()
					}
					else {
						// this.sound.homeTheme.stop()
						// this.pauseLoop()
					}
					this.isPaused = !this.isPaused
					break
			}
		}
	}
}
