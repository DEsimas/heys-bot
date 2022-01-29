import { MessageEmbed } from "discord.js";
import { Payload } from "discordjs-commands-parser";
import { command } from "./../Command";
import { sites, sitesArray } from "./../../database/sites";

export class Help extends command {
    constructor(payload: Payload) {
        super(payload);
    }

    execute(): void {
        if(this.args[1]?.toLowerCase() === "blacklist" || this.args[1]?.toLowerCase() === "tags" || this.args[1]?.toLowerCase() === "blacklists") return this.helpBlacklist();
        this.helpGet();
    }
    
    private helpGet(): void {
        const embed = new MessageEmbed()
            .setColor("#202225")
            .setThumbnail("https://cdn.discordapp.com/attachments/883231507349663754/919303367442985001/th.png")
            .setTitle("Usage")
            .setDescription("**18+**")
            .addField("Command syntaxis:", `${this.prefix}get <resource name> <tags>\n Source "nhentai.net" is special, it accepts doujin id or keyword "random"`)
            .addField("<tags>", "Tags must be separated by spaces. You can add '-' to the tag to block it (ex. '-rape').")
            .addField("Tags can be blacklisted", `type **${this.prefix}help blacklist** to learn more`)
            .addField("Resources and their aliases:", "<resource name>");
    
        sitesArray.forEach(site => embed.addField(sites[site][0], this.getAliases(sites[site]), true));
    
        this.message.channel.send({ embeds: [embed] });
    }

    private helpBlacklist(): void {
        const embed = new MessageEmbed()
            .setTitle(`Bot has two blacklists: user blacklist(${this.prefix}UserBlacklist) and server blacklist(${this.prefix}ServerBlacklist). User blacklist can be setted up by user personally, while server blacklist is common for all user on server and configurates by administrators`)
            .addField("Command syntaxis:", `${this.prefix}<**UserBlacklist** or **ServerBlacklist**> <command> <origin> <tags array>`)
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