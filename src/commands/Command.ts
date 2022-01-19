import { Client, Message } from "discord.js";
import { Command, CommandHandler, Middleware, Payload } from "discordjs-commands-parser";
import { Blacklist } from "../database/Blacklists";

export abstract class command implements CommandHandler {
    protected readonly client: Client;
    protected readonly message: Message;
    protected readonly commands: Array<Command>;
    protected readonly prefix: string;
    protected readonly args: Array<string>;
    protected readonly middlewares: Array<Middleware>;
    protected readonly blacklist: Blacklist;
    protected readonly flags: Array<string>;

    constructor(payload: Payload) {
        this.client = payload.client;
        this.message = payload.message;
        this.commands = payload.commands;
        this.prefix = payload.prefix;
        this.args = payload.args;
        this.middlewares = payload.middlewares;
        this.blacklist = payload.blacklist;
        this.flags = payload.flags;
    }

    abstract execute(): void;

    protected async isAdmin(): Promise<boolean> {
        const guildMember = await this.message.guild?.members.fetch(this.message.author.id)
        if(!guildMember) return false;
        const isAdmin = guildMember.permissions.has("ADMINISTRATOR");
        return isAdmin;
    };
}