import { Client, Intents } from "discord.js";
import { config } from "dotenv";

config(); // import environmental variables

// TODO: connect database

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,                   // TODO: discorver why we need this intent
        Intents.FLAGS.GUILD_MESSAGES,           // read messages
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS   // read reactions under messages
    ]
});

client.on("ready", () => console.log("Bot started!"));
client.on("messageCreate", () => { /*TODO: add commands handler*/ });

client.login(process.env.TOKEN);