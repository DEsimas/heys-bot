import { Client } from "discord.js";
import { Command, Middleware, Next, ParserOptions, Payload } from "discordjs-commands-parser";
import { DAO } from "./database/DAO";

export function getParserOptions(client: Client): ParserOptions {
    return {
        client: client,
        commandsList: commands,
        prefix: "", // will be filled from middleware
        middlewares: middlewares
    }
}

const commands: Array<Command> = [];

const middlewares: Array<Middleware> = [setFlags, setPrefix, setBlacklist];

async function setFlags(payload: Payload, next: Next): Promise<void> {
    payload.flags = [];

    payload.args.forEach((arg, index) => {
        if(arg.substring(0,2) === "--") {
            payload.flags.push(arg.toLowerCase());
            payload.args.splice(index, 1);
        } 
    });

    next(payload);
}

async function setPrefix(payload: Payload, next: Next): Promise<void> {
    const serverID = payload.message.guild?.id;
    if(serverID === undefined) return; // exit if message not from a server

    payload.prefix = await DAO.Prefixes.getPrefix(serverID);

    next(payload);
}

async function setBlacklist(payload: Payload, next: Next): Promise<void> {
    const serverID = payload.message.guild?.id;
    if(serverID === undefined) return; // exit if message not from a server

    // TODO: get server and user blacklists
    console.log(payload);
    
    next(payload);
}