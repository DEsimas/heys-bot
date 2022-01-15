import Site from "booru/dist/structures/Site";
import { Message, MessageEmbed } from "discord.js";
import { ICommandHandler, IPayload } from "discordjs-commands-parser";
import { DAO } from "../../database/DAO";
import { Blacklist } from "../../database/UsersBlacklists";
import { sites, Sites, sitesArray } from "../../sites";

export class UserBlacklist implements ICommandHandler {
    private readonly command: string;
    private readonly userID: string;
    private readonly tags: string[];
    private readonly message: Message;
    private readonly site: Sites | null;

    private readonly errorColour = "#ff0000";
    private readonly commands = {
        add: "add",
        remove: "remove"
    }

    constructor(payload: IPayload) {
        this.command = payload.args[1];
        this.site = this.getSrc(payload.args[2]);
        this.userID = payload.message.author.id;
        this.tags = payload.args;
        this.tags.splice(0, 3);
        this.message = payload.message;
    }

    public execute(): void {
        switch (this.command) {
            case this.commands.add:
                this.add();
                break;
            case this.commands.remove:
                this.remove();
                break;
            default:
                this.show();
                break;
        }
    }

    private async add(): Promise<void> {
        if(this.site === null) return this.sendError("This site is not supported");
        await DAO.UsersBlacklist.addTags(this.userID, this.site, this.tags);
    }

    private async remove(): Promise<void> {

    }

    private async show(): Promise<void> {
        const black = await DAO.UsersBlacklist.getBlacklists(this.userID);
        if (!black) return this.sendError("You don't have any blacklists");
        if (this.command === "global") return this.showGlobal(black);
        const site = this.getSrc(this.command);
        if (site) return this.showSite(black, site);

        const embed = new MessageEmbed();
        if(black.global.length !== 0) embed.addField("Global blacklist:", this.prettify(black.global));
        sitesArray.forEach(site => {
            if(black.sites[site].length !== 0) embed.addField(`${site} blacklist:`, this.prettify(black.sites[site]));
        });
        this.message.channel.send({ embeds: [embed] });
    }

    private showGlobal(blackList: Blacklist): void {
        if(blackList.global.length === 0) return this.sendError("You don't have this blacklist");
        const embed = new MessageEmbed()
            .addField("Global blacklist:", this.prettify(blackList.global));
        this.message.channel.send({ embeds: [embed] });
    }

    private showSite(blackList: Blacklist, site: Sites): void {
        const black = blackList.sites[site];
        if(black.length === 0) return this.sendError("You don't have this blacklist");
        const embed = new MessageEmbed()
            .addField(`${site} blacklist:`, this.prettify(black));
        this.message.channel.send({ embeds: [embed] });
    }

    private prettify(tags: string[]): string {
        let res = "";
        tags.forEach(tag => res += `**${tag}**, `)
        return res.slice(0, -2);
    }

    private sendError(message: string): void {
        if (!this.message) return;
        const embed = new MessageEmbed()
            .setColor(this.errorColour)
            .setTitle(message);
        this.message.channel.send({ embeds: [embed] });
    }

    private getSrc(alias: string): Sites | null {
        let res: Sites | null = null;
        sitesArray.forEach(key => {
            if(sites[key].includes(alias)) res = key;
        });
        return res;
    }
};