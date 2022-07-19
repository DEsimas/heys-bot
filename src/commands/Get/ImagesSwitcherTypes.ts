import { Message, MessageEditOptions } from "discord.js";
import { PostRating } from "../../database/PostsRatings";
import { UserRating } from "../../database/UsersRatings";

export interface SwitcherOptions {
    message: Message;
    requesterID: string;
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
    postRating: PostRating | null,
    userRating: UserRating | null,
    images: Array<Image>,
    doTags: boolean,
    i: number
};

export type getMessageFunction = (payload: Payload) => Promise<MessageEditOptions>;

export type optionCallback = () => Promise<void>;

export interface option {
    reaction: string;
    callback: optionCallback;
};

export type Options = "tags" | "like" | "dislike" | "removeReaction";
