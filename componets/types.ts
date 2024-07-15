import { Renderer } from "./renderer";
import { Block } from "./block";
import { Grid } from "./grid";
import { EventListener } from "./eventListener";
import { Score } from "./score";
import *  as PIXI from "pixi.js"

export type EVENT = "resize" | "keyboard"
export type PIXICONTAINER = PIXI.Container
export type RENDERER = Renderer
export type BLOCK = Block
export type GRID = Grid
export type SCORE = Score
export type LISTENER = { obj: any, event: EVENT }[]
export type CALLBACK = FrameRequestCallback | PIXI.TickerCallback<any>
export type EVENTLISTENER = EventListener
export type SIDE = "right" | "left" | "both"
export type TIME = "now" | "future"
export type BINARY = 0 | 1
export type TEXT = PIXI.Text
export type TEXTSTYLE = PIXI.TextStyle
