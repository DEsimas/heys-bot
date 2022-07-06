import { Message, MessageEditOptions, MessageOptions, MessageReaction, ReactionCollector, User } from "discord.js";

export interface SwitcherOptions {
    message: Message;
    reuqesterID: string;
    botID: string;
    images: Array<Image>;
    doTags: boolean;
    isPublic: boolean;
    doRating: boolean;
    timer?: number;
    getMsg: getMessageFunction;
};

export interface Payload {
    images: Array<Image>,
    doTags: boolean,
    doRating: boolean
    i: number
}

export type Image = { url: string, tags?: string[] };
export type getMessageFunction = (payload: Payload) => MessageEditOptions;

export class ImagesSwitcher {
    private readonly message: Message;
    private readonly requesterID: string;
    private readonly botID: string;
    private readonly images: Array<Image>;
    private readonly isPublic: boolean;
    private readonly collector: ReactionCollector;
    private readonly getMsg: getMessageFunction;
    private readonly interval: NodeJS.Timer | undefined;
    private readonly doRating: boolean;

    private doTags: boolean;
    private i: number;

    private readonly switcherLiveTime = 60 * 60 * 1000; // 1h
    private readonly nextReaction = "➡️";
    private readonly prevReaction = "⬅️";
    private readonly showReaction = "📋";
    private readonly stopReaction = "🛑";

    constructor(options: SwitcherOptions) {
        this.message = options.message;
        this.requesterID = options.reuqesterID;
        this.botID = options.botID;
        this.images = options.images;
        this.doTags = options.doTags;
        this.isPublic = options.isPublic;
        this.doRating = options.doRating;
        this.getMsg = options.getMsg;
        this.i = 0;

        if(options.timer) {
            this.interval = setInterval(() => this.next(), options.timer)
        }

        this.collector = this.message.createReactionCollector({
            dispose: true,
            filter: (reaction, user) => (this.filter(reaction, user)),
            time: this.switcherLiveTime
        });
        
        this.setReactions().then(() => {
            this.collector.on("collect", (reaction, user) => (this.addReaction(reaction, user)));
            this.collector.on("remove", (reaction, user) => (this.removeReaction(reaction, user)));
            this.collector.on("end", () => (this.endHandling()));
            this.updateImage();
        })
    }

    private filter(reaction: MessageReaction, user: User): boolean {
        return (reaction.emoji.name === this.nextReaction ||
                reaction.emoji.name === this.prevReaction ||
                reaction.emoji.name === this.stopReaction ||
                reaction.emoji.name === this.showReaction) &&
                ((user.id === this.requesterID || this.isPublic) && user.id != this.botID);
    }

    private addReaction(reaction: MessageReaction, user: User): void {
        switch (reaction.emoji.name) {
            case this.nextReaction:
                this.next();
            break;
            case this.prevReaction:
                this.prev();
            break;
            case this.stopReaction:
                if(user.id === this.requesterID) this.endHandling();
            break;
            case this.showReaction:
                this.doTags = true;
                this.updateImage();
            break;
        }
    }

    private removeReaction(reaction: MessageReaction, user: User): void {
        switch (reaction.emoji.name) {
            case this.nextReaction:
                this.next();
            break;
            case this.prevReaction:
                this.prev();
            break;
            case this.stopReaction:
                if(user.id === this.requesterID) this.endHandling();
            break;
            case this.showReaction:
                this.doTags = false;
                this.updateImage();
            break;
        }
    }

    private endHandling(): void {
        if(this.interval) {
            clearInterval(this.interval);
        }
        
        if(this.message.deletable) this.message.delete();
    }

    private async setReactions(): Promise<void> {
        await this.message.react(this.prevReaction);
        await this.message.react(this.stopReaction);
        if(this.doTags) await this.message.react(this.showReaction);
        await this.message.react(this.nextReaction);
        this.doTags = false;
    }

    private next(): void {
        this.i = (this.i + 1) % this.images.length;
        this.updateImage();
    }

    private prev(): void {
        this.i = this.i - 1 < 0 ? this.images.length - 1 : this.i - 1;
        this.updateImage();
    }

    private updateImage(): void {
        this.message.edit(this.getMsg({ images: this.images, doTags: this.doTags, doRating: this.doRating, i: this.i }));
    }
}