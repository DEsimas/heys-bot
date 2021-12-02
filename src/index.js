import Discord from "discord.js";
import dotenv from "dotenv";

dotenv.config();
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

client.on("messageCreate", message => {
    message.channel.send(message.content);
});

client.login(process.env.TOKEN);