import { Message, MessageEmbed } from "discord.js";
import { Blacklist } from "../../database/Blacklists";
import { Sites } from "../../database/sites";

export interface SenderOptions {
    message: Message,
    blacklist: Blacklist,
    origin: string,
    botID: string,
    src: Sites | null,
    flags: string[],
    tags: string[],
    doujinID: string | undefined
};

export abstract class Sender {
    protected readonly message: Message;
    protected readonly blacklist: Blacklist;
    protected readonly origin: string;
    protected readonly botID: string;
    protected readonly src: Sites | null;
    protected readonly flags: string[];
    protected readonly tags: string[];
    protected readonly doujinID: string | undefined;

    constructor(options: SenderOptions) {
        this.message = options.message;
        this.blacklist = options.blacklist;
        this.botID = options.botID;
        this.origin = options.origin;
        this.src = options.src;
        this.flags = options.flags;
        this.tags = options.tags;
        this.doujinID = options.doujinID;
    }

    public abstract send(): Promise<void>;

    protected sendError(message: string): void {
        const embed = new MessageEmbed()
            .setColor("#FF0000")
            .setTitle(message);
        this.message.channel.send({ embeds: [embed] });
    }

}