import { inspect } from 'util';

enum LogLevel {
	VERBOSE,
	INFO,
	WARN,
	ERROR,
}

const CURRENT_LEVEL = LogLevel.WARN;

function format(args: unknown[]): string {
	return args
		.map((arg) => (typeof arg === 'string' ? arg : inspect(arg, { depth: null, colors: true })))
		.join(' ');
}

export const logger = {
	info(id: string, ...args: unknown[]) {
		if (CURRENT_LEVEL <= LogLevel.INFO)
			console.log(`[bot ${id}]`, format(args));
	},

	warn(id: string, ...args: unknown[]) {
		if (CURRENT_LEVEL <= LogLevel.WARN)
			console.warn(`[bot ${id}]`, format(args));
	},

	error(id: string, ...args: unknown[]) {
		if (CURRENT_LEVEL <= LogLevel.ERROR)
			console.error(`[bot ${id}]`, format(args));
	},
};
