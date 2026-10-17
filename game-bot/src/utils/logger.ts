import { inspect } from 'util';
import { BOT_LOG_DIR, BOT_LOG_LEVEL } from '../config.js';
import path from 'path';
import fs from "fs";

if (!fs.existsSync(BOT_LOG_DIR))
	fs.mkdirSync(BOT_LOG_DIR, { recursive: true });

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

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function format(args: unknown[]): string
{
	return args
		.map((arg) => (typeof arg === 'string' ? arg : inspect(arg, { depth: null, colors: true })))
		.join(' ');
}

export class Logger
{
	private ostream:			fs.WriteStream;
	private readonly filepath:	string;

	constructor(filename: string)
	{
		this.filepath = path.join(BOT_LOG_DIR, `${filename}.log`);
		this.ostream = fs.createWriteStream(this.filepath);
	}

	verbose(id: string, ...args: unknown[])
	{
		if (this.ostream.closed)
			return ;
		if (CURRENT_LEVEL <= LogLevel.VERBOSE)
			this.ostream.write(`[${id}] ${format(args)}\n`);
	}

	info(id: string, ...args: unknown[])
	{
		if (this.ostream.closed)
			return ;
		if (CURRENT_LEVEL <= LogLevel.INFO)
			this.ostream.write(`[${id}] ${format(args)}\n`);
	}

	warn(id: string, ...args: unknown[])
	{
		if (this.ostream.closed)
			return ;
		if (CURRENT_LEVEL <= LogLevel.WARN)
			this.ostream.write(`${YELLOW}[Warning]${RESET}[${id}] ${format(args)}\n`);
	}

	error(id: string, ...args: unknown[])
	{
		if (this.ostream.closed)
			return ;
		if (CURRENT_LEVEL <= LogLevel.ERROR)
			this.ostream.write(`${RED}[Error]${RESET}[${id}] ${format(args)}\n`);
	}

	close()
	{
		this.ostream.close();
		fs.rmSync(this.filepath);
	}
};
