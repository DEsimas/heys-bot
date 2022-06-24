import { Client, Message } from 'discord.js';
import { Command, Middleware, Next, ParserOptions, Payload } from './types';

export class CommandsParser {
    private readonly client: Client;
	private readonly commands: Array<Command>;
	private readonly prefix: string;
	private readonly middlewares: Array<Middleware>;
	
	constructor(options: ParserOptions) {
        this.client = options.client;
		this.commands = options.commandsList;
		this.prefix = options.prefix;
		this.middlewares = options.middlewares ? options.middlewares : [];
		this.middlewares.push(this.commandHandler);
	}
	
	private commandHandler(payload: Payload): void {
		payload.commands.every(command => {
			return command.name.every(name => {
				if((command.multicase ? payload.args[0].toLowerCase() : payload.args[0]) === (command.multicase ? (payload.prefix+name).toLowerCase() : payload.prefix+name)) {
					const handler = new command.out(payload);
					handler.execute();
					return false;
				}
				return true;
			});
		});
	}
	
	private getNextMiddleware(middlewares: Array<Middleware>, counter: number): Next {
		return (payload: Payload) => {
			middlewares[counter](payload, this.getNextMiddleware(middlewares, ++counter));
		}
	}
	
	public getEventHandler() {
		return (message: Message): void => {
			const content:string = message.content.trim();
			const args:Array<string> = content.split(" ");
			
			const payload: Payload = {
                client: this.client,
				prefix: this.prefix,
				message: message,
				commands: this.commands,
				middlewares: this.middlewares,
				args: args
			}
			
			this.middlewares[0](payload, this.getNextMiddleware(this.middlewares, 1));
		};
	}
};