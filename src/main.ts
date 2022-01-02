import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { CommandsHandler } from "discordjs-commands-parser";
import { commands } from "./commands";
import { DAO } from "./database/DAO";

async function main() {
    dotenv.config();

    await DAO.connect();
    
    const handler = new CommandsHandler({
        commandsList: commands,
        prefix: process.env.PREFIX || "$"
    })
    
    const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
    client.on("messageCreate", handler.getEventHandler());
    client.on("ready", () => {console.log("Bot Started!")});
    client.login(process.env.TOKEN);

}

main();