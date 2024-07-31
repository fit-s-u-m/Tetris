import { Renderer } from "./renderer";
import { Block } from "./block";
import { Grid } from "./grid";
import { EventListener } from "./eventListener";
import { Score } from "./score";
import { GameSound } from "./sound";
import Konva from "konva";

export type EVENT = "resize" | "keyboard"
// export type PIXICONTAINER = PIXI.Container
export type RENDERER = Renderer
export type BLOCK = Block
export type GRID = Grid
export type SCORE = Score
export type LISTENER = { obj: any, event: EVENT }[]
export type CALLBACK = FrameRequestCallback
export type EVENTLISTENER = EventListener
export type SIDE = "right" | "left" | "both" | "none"
export type TIME = "now" | "future"
export type BINARY = 0 | 1
export type GAMESOUND = GameSound
export type BUTTONTYPE = "text-only" | "text-with-rect"
export type BLOCKTYPE = "ghost" | "preview" | "main"
export type POSITION = { x: number, y: number }
export type DRAWING = Konva.Rect | Konva.Sprite | Konva.Group
export type GROUP = Konva.Group

