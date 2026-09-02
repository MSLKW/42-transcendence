interface RateLimitConfig {
	maxRequests: number;
	windowMs: number;
}

interface ClientRateData {
	timestamps: number[];
}

export class RateLimiter {
	private clients = new Map<string, ClientRateData>();

	constructor(private config: RateLimitConfig) {}

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

	public remove(clientId: string): void {
		this.clients.delete(clientId);
	}
}