/** Defines a request limit and its time window */
interface RateLimitConfig {
	maxRequests: number;
	windowMs: number;
}

/** Stores request timestamps for one client */
interface ClientRateData {
	timestamps: number[];
}

/** Applies a rolling-window request limit per client */
export class RateLimiter {
	private clients = new Map<string, ClientRateData>();

	/** Creates a limiter with the given request window */
	constructor(private config: RateLimitConfig) {}

	/** Returns whether the client may make another request */
	public allow(clientId: string): boolean {
		const now = Date.now();
		const data = this.clients.get(clientId);

		if (!data) {
			this.clients.set(clientId, {
				timestamps: [now],
			});
			return true;
		}

		data.timestamps = data.timestamps.filter(
			(timestamp) => now - timestamp < this.config.windowMs
		);
		if (data.timestamps.length >= this.config.maxRequests)
			return false;

		data.timestamps.push(now);
		return true;
	}

	/** Removes a client's recorded request history */
	public remove(clientId: string): void {
		this.clients.delete(clientId);
	}
}
