import { inspect } from 'util';

function format(args: unknown[]): string {
	return args
		.map((arg) => (typeof arg === 'string' ? arg : inspect(arg, { depth: null, colors: true })))
		.join(' ');
}

export const logger = {
	info: (id: string, ...args: unknown[]) => console.log(`[bot ${id}]`, format(args)),
	warn: (id: string, ...args: unknown[]) => console.warn(`[bot ${id}]`, format(args)),
	error: (id: string, ...args: unknown[]) => console.error(`[bot ${id}]`, format(args)),
};
