"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const dotenv = require("dotenv");
const discordjs_commands_parser_1 = require("discordjs-commands-parser");
const commands_1 = require("./commands");
dotenv.config();
const handler = new discordjs_commands_parser_1.CommandsHandler({
    commandsList: commands_1.commands,
    prefix: process.env.PREFIX || "$"
});
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
client.on("messageCreate", handler.getEventHandler());
client.login(process.env.TOKEN);
//# sourceMappingURL=main.js.map