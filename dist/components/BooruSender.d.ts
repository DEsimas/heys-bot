import { Message } from "discord.js";
export declare class BooruSender {
    private message;
    private source;
    private tags;
    private amount;
    private readonly errorColour;
    private readonly videoExtensions;
    constructor(message: Message, source: string, tags: Array<string>, amount: number);
    private sendError;
    private isVideo;
    private getImageEmbed;
    private sendPosts;
    send(): void;
}
