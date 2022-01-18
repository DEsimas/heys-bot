import { Client, Intents } from "discord.js";
import { CommandsParser } from "discordjs-commands-parser";
import { config } from "dotenv";
import { DAO } from "./database/DAO";
import { commands, middlewares } from "./parserOptions";

config(); // import environmental variables

DAO.connect().then(() => {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,                   // TODO: discorver why we need this intent
            Intents.FLAGS.GUILD_MESSAGES,           // read messages
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS   // read reactions under messages
        ]
    });
    
    const handler = new CommandsParser({
        client: client,
        commandsList: commands,
        prefix: "", // will be filled from middleware
        middlewares: middlewares
    });
    
    client.on("ready", () => console.log("Bot started!"));
    client.on("messageCreate", handler.getEventHandler());
    
    client.login(process.env.TOKEN);
})