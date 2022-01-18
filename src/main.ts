import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { CommandsParser } from "discordjs-commands-parser";
import { commands } from "./commands";
import { DAO } from "./database/DAO";

async function main() {
    dotenv.config();

    if(!process.env.TOKEN) throw new Error("TOKEN is required");
    if(!process.env.MONGO) throw new Error("MONGO is required");

    await DAO.connect();

    const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

    
    const handler = new CommandsParser({
        client: client,
        commandsList: commands,
        prefix: "$",
        middlewares: [
            async (payload, next) => {
                const serverID = payload.message.guild?.id;
                const prefix: string = serverID ? await DAO.Prefixes.getPrefix(serverID) : "$";

                payload.prefix = prefix;
                next(payload);
            },
            async (payload, next) => {
                const id = payload.message.guild?.id;
                if(!id) {
                    next(payload);
                    return;
                }

                let blacklists = await DAO.ServersBlacklists.getBlacklists(id);
                if(!blacklists) blacklists = await DAO.ServersBlacklists.create(id);

                payload.blacklists = blacklists;
                next(payload);
            },
            async (payload, next) => {
                if(payload.args.includes("--force")) {
                    payload.args.splice(payload.args.indexOf('--force'), 1);
                    next(payload);
                    return;
                }
                const id = payload.message.author.id;
                let userBlack = await DAO.UsersBlacklist.getBlacklists(id);
                if(userBlack === null) userBlack = await DAO.UsersBlacklist.create(id);
                payload.blacklists = DAO.UsersBlacklist.concat(payload.blacklists, userBlack);
                next(payload);
            }
        ]
    })
    
    client.on("messageCreate", handler.getEventHandler());
    client.on("ready", () => {console.log("Bot Started!")});
    client.login(process.env.TOKEN);

}

main();