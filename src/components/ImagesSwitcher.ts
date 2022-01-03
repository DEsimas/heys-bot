import { Message, MessageEmbed, MessageReaction, ReactionCollector, User } from "discord.js";

export class ImagesSwitcher {
    private readonly message: Message;
    private readonly requesterID: string;
    private readonly images: string[];
    private readonly collector: ReactionCollector;
    private readonly getEmbed: (images: string[], i: number) => MessageEmbed; 
    
    private readonly switcherLiveTime = 12 * 60 * 60 * 1000; // 12h
    private readonly nextReaction = "➡️";
    private readonly prevReaction = "⬅️";
    private readonly stopReaction = "🛑";

    private i = 0;

    constructor(message: Message, reuqesterID: string, images: string[], getEmbed: (images: string[], i: number) => MessageEmbed ) {
        this.message = message;
        this.requesterID = reuqesterID;
        this.images = images;
        this.collector = this.message.createReactionCollector({ dispose: true, filter: (reaciton: MessageReaction, user: User) => (this.filter(reaciton, user)), time: this.switcherLiveTime });
        this.getEmbed = getEmbed;
        this.setReactions();
        this.updateImage();

        this.collector.on("collect", (reaction, user) => (this.detectReaction(reaction, user)));
        this.collector.on("remove", (reaction, user) => (this.detectReaction(reaction, user)));
        this.collector.on("end", () => this.endHandling());
    }

    private endHandling() {
        if(this.message.deletable) {
            this.message.delete();
        }
    }
    
    private detectReaction(reaction: MessageReaction, user: User): void {
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
        }
    }

    private filter(reaction: MessageReaction, user: User): boolean {
        return (reaction.emoji.name === this.nextReaction ||
                reaction.emoji.name === this.prevReaction ||
                reaction.emoji.name === this.stopReaction) &&
                user.id === this.requesterID;
    };
    
    private setReactions(): void {
        this.message.react(this.prevReaction);
        this.message.react(this.stopReaction);
        this.message.react(this.nextReaction);
    }

    private updateImage(): void {
        this.message.edit({embeds: [this.getEmbed(this.images, this.i)]});
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