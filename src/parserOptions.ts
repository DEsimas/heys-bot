import { Command, Middleware, Next, Payload } from "discordjs-commands-parser";

export const commands: Array<Command> = [];

export const middlewares: Array<Middleware> = [setFlags, setPrefix, setBlacklist];

async function setFlags(payload: Payload, next: Next): Promise<void> {
    const flags = ['--force', '--public'];
    payload.flags = [];

    flags.forEach(flag => {
        payload.args.every(arg => {
            if(arg.toLowerCase() === flag) {
                payload.flags.push(flag);
                return false;
            }

            return true;
        });
    });

    next(payload);
}

async function setPrefix(payload: Payload, next: Next): Promise<void> {
    const serverID = payload.message.guild?.id;
    if(serverID === undefined) return; // exit if message not from a server

    payload.prefix = /*serverID ? await DAO.Prefixes.getPrefix(serverID) :*/ "$"; // TODO: get prefix from database

    next(payload);
}

async function setBlacklist(payload: Payload, next: Next): Promise<void> {
    const serverID = payload.message.guild?.id;
    if(serverID === undefined) return; // exit if message not from a server

    // TODO: get server and user blacklists
    
    next(payload);
}