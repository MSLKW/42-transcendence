import { inspect } from 'util';
import { BOT_LOG_LEVEL } from '../config.js';

enum LogLevel {
	VERBOSE,
	INFO,
	WARN,
	ERROR,
}

const loglevelMap: Record<string, LogLevel> = {
	["verbose"]:	LogLevel.VERBOSE,
	["info"]:		LogLevel.INFO,
	["warn"]:		LogLevel.WARN,
	["error"]:		LogLevel.ERROR,
} as const;

const CURRENT_LEVEL = loglevelMap[BOT_LOG_LEVEL]
if (CURRENT_LEVEL == undefined)
	throw new Error('BOT_LOG_LEVEL must be "verbose", "info", "warn" or "error"');

function format(args: unknown[]): string {
	return args
		.map((arg) => (typeof arg === 'string' ? arg : inspect(arg, { depth: null, colors: true })))
		.join(' ');
}

export const logger = {
	verbose(id: string, ...args: unknown[]) {
		if (CURRENT_LEVEL <= LogLevel.VERBOSE)
			console.log(`[${id}]`, format(args));
	},

	info(id: string, ...args: unknown[]) {
		if (CURRENT_LEVEL <= LogLevel.INFO)
			console.log(`[${id}]`, format(args));
	},

	warn(id: string, ...args: unknown[]) {
		if (CURRENT_LEVEL <= LogLevel.WARN)
			console.warn(`[WARNING][${id}]`, format(args));
	},

	error(id: string, ...args: unknown[]) {
		if (CURRENT_LEVEL <= LogLevel.ERROR)
			console.error(`[ERROR][${id}]`, format(args));
	},
};
