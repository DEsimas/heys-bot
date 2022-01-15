import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { CommandsHandler } from "discordjs-commands-parser";
import { commands } from "./commands";
import { DAO } from "./database/DAO";

async function main() {
    dotenv.config();

    if(!process.env.TOKEN) throw new Error("TOKEN is required");
    if(!process.env.MONGO) throw new Error("MONGO is required");
    if(!process.env.PREFIX) throw new Error("PREFIX is required");

    await DAO.connect();
    
    const handler = new CommandsHandler({
        commandsList: commands,
        prefix: process.env.PREFIX,
        middlewares: [
            async (payload, next) => {
                const serverID = payload.message.guild?.id;
                const prefix: string = serverID ? await DAO.Prefixes.getPrefix(serverID) : process.env.PREFIX  || "$";

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
            }
        ]
    })
    
    const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
    client.on("messageCreate", handler.getEventHandler());
    client.on("ready", () => {console.log("Bot Started!")});
    client.login(process.env.TOKEN);

}

main();