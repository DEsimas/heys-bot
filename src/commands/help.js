import Discord from "discord.js";
import commands from "./../commands.js";

export default function help(message, args) {
    const embed = new Discord.MessageEmbed()
        .setColor("#202225")
        .setAuthor("Commands list:");

    commands.forEach(command => {
        embed.addField(process.env.PREFIX + command.name[0], command.description);
    });

    message.channel.send({embeds: [embed]});
}