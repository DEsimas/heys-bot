import { Client, Message } from 'discord.js';

/**
 * @description Class that handles one command
 * @param execute Will be called for handling
 */
export interface CommandHandler {
	execute(): void;
};

/**
 * @description Information about recieved message. Can be modyfied from middlewares
 * @param client Bot client
 * @param message Recieved message
 * @param commands List of all bot commands
 * @param prefix Bot prefix
 * @param args Command arguments
 * @param middlewares Middlewares array
 */
export interface Payload {
    client: Client;
	message: Message;
	commands: Array<Command>;
    prefix: string;
    args: Array<string>;
    middlewares: Array<Middleware>; 
	[key: string]: any;
}

/**
 * @description Object describing one bot command
 * @param name Array of command aliases
 * @param out Command handling class
 * @param multicase Optional parameter. If true command register will be ignored
 */
export interface Command {
	name: Array<string>;
	out: new (payload: Payload) => CommandHandler;
	multicase?: boolean;
	[key: string]: any;
};

/**
 * @description Function that will be called before message handling
 * @param payload Information about recieved message
 */
export type Middleware = (payload: Payload, next: Next) => void;

/**
 * @description Function that calls next middleware
 * @param payload Information about recieved message
 */
export type Next = (payload: Payload) => void;

/**
 * @description Options for discordjs-commands parser
 * @param client Bot client
 * @param commandsList Array of bot commands
 * @param prefix Bot prefix
 * @param middlewares Array of middlewares
 */
export interface ParserOptions {
    client: Client;
    commandsList: Array<Command>;
    prefix: string;
    middlewares?: Array<Middleware>;
}