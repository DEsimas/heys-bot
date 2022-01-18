import { Message, MessageEmbed } from "discord.js";
import { CommandHandler, Payload } from "discordjs-commands-parser";
import { sites, sitesArray } from "./../../sites";

export class Help implements CommandHandler {
    private readonly message: Message;
    private readonly prefix: string;
    private readonly args: string[];

    constructor(payload: Payload) {
        this.message = payload.message;
        this.prefix = payload.prefix;
        this.args = payload.args;
    }

    execute(): void {
        if(this.args[1]?.toLowerCase() === "blacklist") return this.helpBlacklist();
        this.helpGet();
    }
    
    private helpGet(): void {
        const embed = new MessageEmbed()
            .setColor("#202225")
            .setThumbnail("https://cdn.discordapp.com/attachments/883231507349663754/919303367442985001/th.png")
            .setTitle("Usage")
            .setDescription("**18+**")
            .addField("Command syntaxis:", `${this.prefix}get <resource name> <tags separated by space>\n Source "nhentai.net" is special, it accepts doujin id or keyword "random"`)
            .addField("Tags can be blacklisted", `type **${this.prefix}help blacklist** to learn more`)
            .addField("Resources and their aliases:", "<resource name>")
    
        sitesArray.forEach(site => embed.addField(sites[site][0], this.getAliases(sites[site]), true));
    
        this.message.channel.send({ embeds: [embed] });
    }

    private helpBlacklist(): void {
        const embed = new MessageEmbed()
            .setTitle(`Bot has two blacklists: user blacklist(${this.prefix}UserBlacklist) and server blacklist(${this.prefix}ServerBlacklist). User blacklist can be setted up by user personally, while server blacklist is common for all user on server and configurates by administrators`)
            .addField("Command syntaxis:", `${this.prefix}tags <command> <origin> <tags array>`)
            .addField("<command>", "add, remove. If not stated blacklisted tags will be shown")
            .addField("<origin>", "Site alias or \"global\" for manipulating with global blacklist")
            .addField("<tags array>", "Tags to add/remove");
        this.message.channel.send({ embeds: [embed] });
    }

    private getAliases(names: string[]): string {
        let aliases = "";
        names.forEach((el, index) => {
            if(!index) return;
            aliases += `${el}, `;
        });

        return aliases.slice(0, -2);
    }
};