import { Message, MessageEmbed } from "discord.js";
import { Sites, sitesArray } from "./../../database/sites";
import { Blacklists } from "./../../database/Blacklists";

export class BlacklistManager {
    constructor(private readonly message: Message, private readonly collection: Blacklists) {}

    private stringify(array: Array<string>): string {
        if(array.length === 0) return " (⁄ ⁄•⁄ω⁄•⁄ ⁄)";
        let res = "";
        array.forEach(el => res += `${el}, `);
        return res.slice(0, -2);
    }

    public async add(id: string, site: Sites | "global", tags: string[]): Promise<void> {
        const bl = await this.collection.addTags(id, site, tags);
        this.message.channel.send({ embeds: [new MessageEmbed().setColor("#00FF00").addField("Done!", site === "global" ? this.stringify(bl.global) : this.stringify(bl.sites[site]))] });
    }

    public async remove(id: string, site: Sites | "global", tags: string[]): Promise<void> {
        const bl = await this.collection.removeTags(id, site, tags);
        this.message.channel.send({ embeds: [new MessageEmbed().setColor("#00FF00").addField("Done!", site === "global" ? this.stringify(bl.global) : this.stringify(bl.sites[site]))] });
    }

    public async show(id: string, site: Sites | "global" | undefined) {
        if(site === undefined) {
            const bl = await this.collection.getBlacklists(id);
            const embed = new MessageEmbed();
            if(bl.global.length) embed.addField("Global:", this.stringify(bl.global));

            sitesArray.forEach(site => {
                if(bl.sites[site].length) embed.addField(site, this.stringify(bl.sites[site]));
            })

            if(embed.fields.length) this.message.channel.send({ embeds: [embed] });
            else this.message.channel.send({ embeds: [embed.setTitle("You are free")] });
        } else {
            const bl = await this.collection.getBlacklist(id, site);
            this.message.channel.send({ embeds: [new MessageEmbed().addField(site, this.stringify(bl))] });
        }
    }
};