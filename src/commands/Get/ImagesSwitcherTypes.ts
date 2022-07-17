import { Message, MessageEditOptions, ReactionCollector } from "discord.js";

export interface SwitcherOptions {
    message: Message;
    reuqesterID: string;
    botID: string;
    images: Array<Image>;
    isPublic: boolean;
    options: Array<Options>;
    getMsg: getMessageFunction;
    timer?: number;
};

export type Image = {
    url: string,
    tags?: string[]
};

export interface Payload {
    message: Message,
    images: Array<Image>,
    i: number
};

export type getMessageFunction = (payload: Payload) => Promise<MessageEditOptions>;

export type optionCallback = () => Promise<void>;

export interface option {
    reaction: string;
    callback: optionCallback;
};

export type Options = "tags" | "like" | "unlike" | "dislike" | "undislike";
