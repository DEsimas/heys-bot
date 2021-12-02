import Discord from "discord.js";
import dotenv from "dotenv";

import messageHandler from "./messageHandler.js";

try {
    dotenv.config();
    const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
    
    client.on("messageCreate", messageHandler);
    
    client.login(process.env.TOKEN);
} catch(err) {
    console.log(err);
}