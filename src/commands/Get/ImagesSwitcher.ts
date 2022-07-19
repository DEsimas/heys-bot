import { Message, MessageReaction, ReactionCollector, User } from "discord.js";
import { SwitcherOptions, Image, option, getMessageFunction } from "./ImagesSwitcherTypes";

export class ImagesSwitcher {
    private readonly message: Message;
    private readonly requesterID: string;
    private readonly botID: string;
    private readonly images: Array<Image>;
    private readonly isPublic: boolean;
    private readonly getMsg: getMessageFunction;
    
    private readonly collector: ReactionCollector;
    private readonly interval: NodeJS.Timer | undefined;
    
    private readonly switcherLifeTime: number;
    private readonly options: Array<option>;
    
    private i: number;
    private isDeleted: boolean;

    constructor(options: SwitcherOptions) {
        this.switcherLifeTime = 60 * 60 * 1000; // 1h
        this.options = [];

        this.i = 0;
        this.isDeleted = false;

        this.message = options.message;
        this.requesterID = options.reuqesterID;
        this.botID = options.botID;
        this.images = options.images;
        this.isPublic = options.isPublic;
        this.getMsg = options.getMsg;

        this.pushOptions();

        if(options.timer)
            this.interval = setInterval(() => this.options[this.options.length-1].callback(), options.timer);

        this.collector = this.message.createReactionCollector({
            dispose: true,
            filter: (reaction, user) => (this.filter(reaction, user)),
            time: this.switcherLifeTime
        });
        
        this.setReactions().then(() => {
            this.collector.on("collect", (reaction, user) => (this.handle(reaction, user)));
            this.collector.on("remove", (reaction, user) => (this.handle(reaction, user)));
            this.collector.on("end", () => (this.endHandling()));
            this.updateImage();
        });
    }

    private pushOptions() {
        this.options.push({
            reaction: "⬅️",
            callback: async () => {
                this.i = this.i - 1 < 0 ? this.images.length - 1 : this.i - 1;
            }
        });

        this.options.push({
            reaction: "🛑",
            callback: async () => {
                this.isDeleted = true;
                if(this.message.deletable) this.message.delete();
                if(this.interval) clearInterval(this.interval);
            }
        });

        //insert other emojis

        this.options.push({
            reaction: "➡️",
            callback: async () => {
                this.i = (this.i + 1) % this.images.length;
            }
        });
    }
    
    private async setReactions(): Promise<void> {
        for(let i = 0; i < this.options.length; i++) {
            await this.message.react(this.options[i].reaction);
        }
    }

    private filter(reaction: MessageReaction, user: User): boolean {
        let isReaction = false;
        for(let i = 0; i < this.options.length; i++) {
            if(reaction.emoji.name === this.options[i].reaction) {
                isReaction = true;
                break;
            }
        }
        return isReaction && ((user.id === this.requesterID || this.isPublic) && user.id != this.botID);
    }

    private async handle(reaction: MessageReaction, user: User): Promise<void> {
        for(let i = 0; i < this.options.length; i++) {
            if(reaction.emoji.name === this.options[i].reaction) {
                await this.options[i].callback();
                break;
            }
        }

        if(!this.isDeleted) this.updateImage();
    }

    private endHandling(): void {
        if(this.interval) {
            clearInterval(this.interval);
        }
        
        if(this.message.deletable) this.message.delete();
        this.isDeleted = true;
    }

    private async updateImage(): Promise<void> {
        this.message.edit(await this.getMsg({ message: this.message, images: this.images, i: this.i }));
    }
}
