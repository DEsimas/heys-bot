import { Message, MessageEmbed } from "discord.js";
import { ICommandHandler, IPayload } from "discordjs-commands-parser";
import { DAO } from "../../database/DAO";
import { sites, Sites, sitesArray } from "./../../sites";

export class ServerBlacklist implements ICommandHandler {
    private readonly command: string;
    private readonly serverID: string | undefined;
    private readonly tags: string[];
    private readonly message: Message;
    private readonly site: Sites | "global" | null;

    private readonly errorColour = "#ff0000";
    private readonly commands = {
        add: "add",
        remove: "remove"
    }

    constructor(payload: IPayload) {
        this.command = payload.args[1]?.toLowerCase();
        this.site = this.getSrc(payload.args[2]?.toLowerCase());
        if(this.site === null && payload.args[2]?.toLowerCase() === "global") this.site = "global";
        this.serverID = payload.message.guild?.id;
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
                // this.show();
                break;
        }
    }

    private async add(): Promise<void> {
        if(this.serverID === undefined) return this.sendError("Command can only be used on server");
        if(this.site === null) return this.sendError("This site is not supported");
        await DAO.ServersBlacklists.addTags(this.serverID, this.site, this.tags);
        this.message.channel.send({ embeds: [new MessageEmbed().setTitle("Ok")] });
    }

    private async remove(): Promise<void> {
        if(this.serverID === undefined) return this.sendError("Command can only be used on server");
        if(this.site === null) return this.sendError("This site is not supported");
        await DAO.ServersBlacklists.removeTags(this.serverID, this.site, this.tags);
        this.message.channel.send({ embeds: [new MessageEmbed().setTitle("Ok")] });
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