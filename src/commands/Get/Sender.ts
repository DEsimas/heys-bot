import { Message } from "discord.js";
import { Blacklist } from "../../database/Blacklists";

export interface SenderOptions {
    message: Message,
    blacklist: Blacklist,
    origin: string,
    src: string,
    tags: string | undefined,
    doujinID: string | undefined
};

export abstract class Sender {
    protected readonly message: Message;
    protected readonly blacklist: Blacklist;
    protected readonly origin: string;
    protected readonly src: string;
    protected readonly tags: string | undefined;
    protected readonly doujinID: string | undefined;

    constructor(options: SenderOptions) {
        this.message = options.message;
        this.blacklist = options.blacklist;
        this.origin = options.origin;
        this.src = options.src;
        this.tags = options.tags;
        this.doujinID = options.doujinID;
    }

    public abstract send(): Promise<void>;
}