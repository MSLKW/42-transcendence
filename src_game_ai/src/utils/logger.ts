export const logger = {
	info: (id: string, ...args: unknown[]) => console.log(`[bot ${id}]`, ...args),
	warn: (id: string, ...args: unknown[]) => console.warn(`[bot ${id}]`, ...args),
	error: (id: string, ...args: unknown[]) => console.error(`[bot ${id}]`, ...args),
};
