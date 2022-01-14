import { Message, MessageEmbed } from "discord.js";
import { ICommandHandler, IPayload } from "discordjs-commands-parser";
import { sites, sitesArray } from "./../../sites";

export class Help implements ICommandHandler {
    private readonly message: Message;
    private readonly prefix: string;

    constructor(payload: IPayload) {
        this.message = payload.message;
        this.prefix = payload.prefix;
    }

    execute(): void {
        const embed = new MessageEmbed()
            .setColor("#202225")
            .setThumbnail("https://cdn.discordapp.com/attachments/883231507349663754/919303367442985001/th.png")
            .setTitle("Usage")
            .setDescription("18+")
            .addField("Command syntaxis:", `${this.prefix}get <resource name> <tags separated by space>\n Source "nhentai.net" is special, it accepts doujin id or keyword "random"`)
            .addField("Resources and theri aliases:", "<resource name>")

        sitesArray.forEach(site => embed.addField(sites[site][0], this.getAliases(sites[site]), true));

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