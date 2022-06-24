import { Client, Message, MessageEmbed } from "discord.js";
import { Command, CommandHandler, Middleware, Payload } from "discordjs-commands-parser";
import { Blacklist } from "../database/Blacklists";
import { sites, Sites, sitesArray } from "../database/sites";

export abstract class command implements CommandHandler {
    protected readonly client: Client;
    protected readonly message: Message;
    protected readonly commands: Array<Command>;
    protected readonly prefix: string;
    protected readonly args: Array<string>;
    protected readonly middlewares: Array<Middleware>;
    protected readonly flags: Array<string>;
    protected readonly serverID: string;

    constructor(payload: Payload) {
        this.client = payload.client;
        this.message = payload.message;
        this.commands = payload.commands;
        this.prefix = payload.prefix;
        this.args = payload.args;
        this.middlewares = payload.middlewares;
        this.flags = payload.flags;
        this.serverID = payload.serverID;
    }

    abstract execute(): void;

    protected async isAdmin(): Promise<boolean> {
        if(this.serverID[0] == "D" && this.serverID[1] == "M") return true; //if message from DM
        const guildMember = await this.message.guild?.members.fetch(this.message.author.id)
        if(!guildMember) return false;
        const isAdmin = guildMember.permissions.has("ADMINISTRATOR");
        return isAdmin;
    }

    protected getSrc(alias: string): Sites | "global" | null {
        let res: Sites | null = null;
        if(alias === "global") return "global";
        sitesArray.forEach(key => {
            if(sites[key].includes(alias)) res = key;
        });
        return res;
    }

    protected sendError(msg: string): void {
        this.message.channel.send({ embeds: [ new MessageEmbed()
        .setColor("#FF0000")
        .setTitle(msg) ] });
    }
}