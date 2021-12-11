import { Message } from "discord.js";
export declare class DoujinSender {
    private id;
    private message;
    private url;
    private readonly errorColour;
    constructor(id: string, message: Message, url: string);
    private sendError;
    private isEnglish;
    private sendInfo;
    private sendPages;
    private sendRandom;
    private sendByID;
    sendDoujin(): void;
}
