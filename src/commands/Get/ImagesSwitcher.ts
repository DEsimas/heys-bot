import { Message, MessageOptions, MessageReaction, ReactionCollector, User } from "discord.js";

export type Images = Array<{ url: string, tags?: string[] }>;
export type getMessageFunction = (images: Images, i: number, doTags: boolean) => MessageOptions;

export class ImagesSwitcher {
    private readonly message: Message;
    private readonly requesterID: string;
    private readonly images: Images;
    private readonly collector: ReactionCollector;
    private readonly getMsg: getMessageFunction;
    
    private readonly switcherLiveTime = 12 * 60 * 60 * 1000; // 12h
    private readonly nextReaction = "➡️";
    private readonly prevReaction = "⬅️";
    private readonly showReaction = "📋";
    private readonly stopReaction = "🛑";
    
    private doTags: boolean;
    private i = 0;

    constructor(message: Message, reuqesterID: string, images: Images, doTags: boolean, getMsg: getMessageFunction ) {
        this.message = message;
        this.requesterID = reuqesterID;
        this.collector = this.message.createReactionCollector({ dispose: true, filter: (reaciton: MessageReaction, user: User) => (this.filter(reaciton, user)), time: this.switcherLiveTime });
        this.images = images;
        this.doTags = doTags;
        this.getMsg = getMsg;

        this.setReactions();
        this.updateImage();

        this.collector.on("collect", (reaction, user) => (this.addReaction(reaction, user)));
        this.collector.on("remove", (reaction, user) => (this.removeReaction(reaction, user)));
        this.collector.on("end", () => this.endHandling());
    }

    private endHandling() {
        if(this.message.deletable) {
            this.message.delete();
        }
    }

    private addReaction(reaction: MessageReaction, user: User) {
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

    private removeReaction(reaction: MessageReaction, user: User) {
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

    private filter(reaction: MessageReaction, user: User): boolean {
        return (reaction.emoji.name === this.nextReaction ||
                reaction.emoji.name === this.prevReaction ||
                reaction.emoji.name === this.stopReaction ||
                reaction.emoji.name === this.showReaction) &&
                user.id === this.requesterID;
    };
    
    private setReactions(): void {
        this.message.react(this.prevReaction);
        this.message.react(this.stopReaction);
        if(this.doTags) this.message.react(this.showReaction);
        this.message.react(this.nextReaction);
        this.doTags = false;
    }

    private updateImage(): void {
        this.message.edit(this.getMsg(this.images, this.i, this.doTags));
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
};