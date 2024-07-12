import { Renderer } from "./renderer";
import { Block } from "./block";
import { Grid } from "./grid";
import { EventListener } from "./eventListener";
import *  as PIXI from "pixi.js"

export type EVENT = "resize" | "keyboard"
export type PIXICONTAINER = PIXI.Container
export type RENDERER = Renderer
export type BLOCK = Block
export type GRID = Grid
export type LISTENER = { obj: any, event: EVENT }[]
export type CALLBACK = PIXI.TickerCallback<any>
export type EVENTLISTENER = EventListener
