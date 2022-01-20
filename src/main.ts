import { Client, Intents } from "discord.js";
import { CommandsParser } from "discordjs-commands-parser";
import { config } from "dotenv";
import { DAO } from "./database/DAO";
import { getParserOptions } from "./parserOptions";

config(); // import environmental variables

DAO.connect().then(() => {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,                   // interaction with servers
            Intents.FLAGS.GUILD_MESSAGES,           // read messages
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS   // read reactions under messages
        ]
    });
    
    const handler = new CommandsParser(getParserOptions(client));
    
    client.on("ready", () => console.log("Bot started!"));
    client.on("messageCreate", handler.getEventHandler());
    
    client.login(process.env.TOKEN);
})