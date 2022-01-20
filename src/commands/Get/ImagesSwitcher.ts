import { Message, MessageOptions, MessageReaction, ReactionCollector, User } from "discord.js";

export interface SwitcherOptions {
    message: Message,
    reuqesterID: string,
    images: Array<Image>
    doTags: boolean,
    isPublic: boolean,
    getMsg: getMessageFunction
};

export interface Payload {
    images: Array<Image>,
    doTags: boolean,
    i: number
}

export type Image = { url: string, tags?: string[] };
export type getMessageFunction = (payload: Payload) => MessageOptions;

export class ImagesSwitcher {
    private readonly message: Message;
    private readonly requesterID: string;
    private readonly images: Array<Image>;
    private readonly isPublic: boolean;
    private readonly collector: ReactionCollector;
    private readonly getMsg: getMessageFunction;

    private doTags: boolean;
    private i: number;

    private readonly switcherLiveTime = 12 * 60 * 60 * 1000; // 12h
    private readonly nextReaction = "➡️";
    private readonly prevReaction = "⬅️";
    private readonly showReaction = "📋";
    private readonly stopReaction = "🛑";

    constructor(options: SwitcherOptions) {
        this.message = options.message;
        this.requesterID = options.reuqesterID;
        this.collector = this.message.createReactionCollector({ dispose: true, filter: (reaciton: MessageReaction, user: User) => (this.filter(reaciton, user)), time: this.switcherLiveTime });
        this.images = options.images;
        this.doTags = options.doTags;
        this.isPublic = options.isPublic;
        this.getMsg = options.getMsg;
        this.i = 0;

        this.collector = this.message.createReactionCollector({
            dispose: true,
            filter: (reaction, user) => (this.filter(reaction, user)),
            time: this.switcherLiveTime
        });

        this.collector.on("collect", (reaction, user) => (this.addReaction(reaction, user)));
        this.collector.on("remove", (reaction, user) => (this.removeReaction(reaction, user)));
        this.collector.on("end", () => (this.endHandling()));

        this.setReactions();
        this.updateImage();
    }

    private filter(reaction: MessageReaction, user: User): boolean {
        return (reaction.emoji.name === this.nextReaction ||
                reaction.emoji.name === this.prevReaction ||
                reaction.emoji.name === this.stopReaction ||
                reaction.emoji.name === this.showReaction) &&
                (user.id === this.requesterID || this.isPublic);
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
                this.endHandling();
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
                this.endHandling();
            break;
            case this.showReaction:
                this.doTags = false;
                this.updateImage();
            break;
        }
    }

    private endHandling(): void {
        if(this.message.deletable) this.message.delete();
    }

    private setReactions(): void {
        this.message.react(this.prevReaction);
        this.message.react(this.stopReaction);
        if(this.doTags) this.message.react(this.showReaction);
        this.message.react(this.nextReaction);
        this.doTags = false;
    }

    private next(): void {
        if(this.i !== this.images.length-1){
            this.i++;
            this.updateImage();
        }
    }

    private prev(): void {
        if(this.i !== 0) {
            this.i--;
            this.updateImage();
        }
    }

    private updateImage(): void {
        this.message.edit(this.getMsg({ images: this.images, doTags: this.doTags, i: this.i }));
    }
}