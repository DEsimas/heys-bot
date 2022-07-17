import { Message, MessageEditOptions, ReactionCollector } from "discord.js";

export interface SwitcherOptions {
    message: Message;
    reuqesterID: string;
    botID: string;
    images: Array<Image>;
    isPublic: boolean;
    getMsg: getMessageFunction;
    timer?: number;
    options?: Array<option>;
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

export type optionCallback = (payload: ImagesSwitcherFields) => Promise<ImagesSwitcherFields>;

export interface option {
    reaction: string;
    callback: optionCallback;
};

export interface ImagesSwitcherFields {
    message: Message;
    requesterID: string;
    botID: string;
    images: Array<Image>;
    isPublic: boolean;
    collector: ReactionCollector;
    getMsg: getMessageFunction;
    interval: NodeJS.Timer | undefined;
    optionsList: Array<option>;
    i: number;
};