
export class AutoPassTimer {
	private timerInMilliseconds: number;
	private timeoutId: NodeJS.Timeout;
	private startTime: DOMHighResTimeStamp;
	private callback: () => void;

	constructor(callback: () => void, timerInMilliseconds: number) {
		this.startTime = performance.now();
		this.callback = callback;
		this.timerInMilliseconds = timerInMilliseconds;
		this.timeoutId = setTimeout(() => {
			this.callback();
		}, timerInMilliseconds);
	}
	
	public getRemainingTime() {
		const elapsedTime = performance.now() - this.startTime;
		return (Math.max(0, this.timerInMilliseconds - elapsedTime));
	}

	public clear() {
		clearTimeout(this.timeoutId);
	}
}