import { EVENT } from "./types"
export interface EventObserver {
	update(data: any, event: EVENT): void
}
export class EventListener {
	private resizeObservers: EventObserver[] = []
	private keyboardObservers: EventObserver[] = []

	addEventObserver(observer: EventObserver, event: EVENT): void {
		if (event == "resize")
			this.resizeObservers.push(observer)
		else if (event == "keyboard")
			this.keyboardObservers.push(observer)
		else
			new Error(`Error ${event} has no observer`)
	}
	removeEventObserver(observer: EventObserver, event: EVENT): void {
		if (event == "resize")
			this.resizeObservers = this.resizeObservers.filter(obs => obs != observer)
		else if (event == "keyboard")
			this.keyboardObservers = this.keyboardObservers.filter(obs => obs != observer)
		else
			new Error(`Error ${event} has no observer`)
	}
	notifyEventObserver(data: any, event: EVENT): void {
		if (event == "resize")
			this.resizeObservers.forEach(obs => obs.update(data, "resize"))
		else if (event == "keyboard")
			this.keyboardObservers.forEach(obs => obs.update(data, "keyboard"))
		else
			new Error(`Error ${event} has no observer`)
	}
}

