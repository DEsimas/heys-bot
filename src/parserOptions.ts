import { Client } from "discord.js";
import { Command, Middleware, Next, ParserOptions, Payload } from "discordjs-commands-parser";
import { ServerBlacklist } from "./commands/Blacklist/ServerBlacklist";
import { UserBlacklist } from "./commands/Blacklist/UserBlacklist";
import { Get } from "./commands/Get/Get";
import { Help } from "./commands/Help/Help";
import { SetPrefix } from "./commands/SetPrefix.ts/SetPrefix";
import { DAO } from "./database/DAO";

export function getParserOptions(client: Client): ParserOptions {
    return {
        client: client,
        commandsList: commands,
        prefix: "", // will be filled from middleware
        middlewares: middlewares
    }
}

const commands: Array<Command> = [
    {
        name: ["help", "h", "guide", "?"],
        out: Help,
        multicase: true
    },
    {
        name: ["setprefix", "changeprefix"],
        out: SetPrefix,
        multicase: true
    },
    {
        name: ["userbalcklist", "blacklist", "tags", "userbalcklists"],
        out: UserBlacklist,
        multicase: true
    },
    {
        name: ["serverblacklist", "servertags", "serverblacklists"],
        out: ServerBlacklist,
        multicase: true
    },
    {
        name: ["get", ""],
        out: Get,
        multicase: true
    }
];

const middlewares: Array<Middleware> = [setFlags, setPrefix];

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