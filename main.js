import * as PIXI from 'pixi.js'
async function getTetris() {
  const I = await PIXI.Assets.load("/assets/I/1.png")
  const L = await PIXI.Assets.load("./public/assets/L/L.png")
  const S = await PIXI.Assets.load("./public/assets/S/S.png")
  const R = await PIXI.Assets.load("./public/assets/R/R.png")
  return { 0: I, 1: L, 2: S, 3: R }
}

async function showTetris({ x, y }) {
  const tetrisTextures = await getTetris()
  let rand = Math.floor(Math.random() * 4)
  const tetrisImg = new PIXI.Sprite(tetrisTextures[rand])
  tetrisImg.anchor.set(0.5)
  tetrisImg.scale.set(0.3)
  tetrisImg.position.set(x, y)
  return tetrisImg
}

const main = async () => {
  const app = new PIXI.Application()
  await app.init({
    background: '#00ffff',
    resizeTo: window
  })
  const num = 10
  for (let i = 0; i < num; i++) {
    const xSpaceing = app.screen.width / (num + 1)
    const x = xSpaceing * (i + 1)
    const y = app.screen.height / 2
    const tetris = await showTetris({ x, y })
    app.stage.addChild(tetris);
  }

  document.body.appendChild(app.canvas);
}


main()

