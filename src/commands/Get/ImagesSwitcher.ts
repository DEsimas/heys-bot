import { Message, MessageReaction, ReactionCollector, User } from "discord.js";
import { SwitcherOptions, Image, option, getMessageFunction, ImagesSwitcherFields } from "./ImagesSwitcherTypes";

export class ImagesSwitcher {
    private message: Message;
    private requesterID: string;
    private botID: string;
    private images: Array<Image>;
    private isPublic: boolean;
    private collector: ReactionCollector;
    private getMsg: getMessageFunction;
    private interval: NodeJS.Timer | undefined;
    private optionsList: Array<option>
    private i: number;
    private isDeleted = false;

    private readonly switcherLiveTime = 60 * 60 * 1000; // 1h

    constructor(options: SwitcherOptions) {
        this.optionsList = [];
        this.message = options.message;
        this.requesterID = options.reuqesterID;
        this.botID = options.botID;
        this.images = options.images;
        this.isPublic = options.isPublic;
        this.getMsg = options.getMsg;
        this.i = 0;

        this.optionsList.push({
            reaction: "⬅️",
            callback: async (payload) => {
                const res = Object.create(payload);
                this.i = this.i - 1 < 0 ? this.images.length - 1 : this.i - 1;
                return res;
            }
        });

        this.optionsList.push({
            reaction: "🛑",
            callback: async (payload) => {
                this.isDeleted = true;
                if(payload.message.deletable) payload.message.delete();
                if(payload.interval) clearInterval(payload.interval);
                return payload;
            }
        });

        if(options.options) {
            options.options.forEach(o => {
                this.optionsList.push({
                    reaction: o.reaction,
                    callback: o.callback
                });
            });
        }

        this.optionsList.push({
            reaction: "➡️",
            callback: async (payload) => {
                const res = Object.create(payload);
                this.i = (this.i + 1) % this.images.length;
                return res;
            }
        })

        if(options.timer) {
            this.interval = setInterval(() => this.optionsList[this.optionsList.length-1].callback(this.getPayload()), options.timer)
        }

        this.collector = this.message.createReactionCollector({
            dispose: true,
            filter: (reaction, user) => (this.filter(reaction, user)),
            time: this.switcherLiveTime
        });
        
        this.setReactions().then(() => {
            this.collector.on("collect", (reaction, user) => (this.handle(reaction, user)));
            this.collector.on("remove", (reaction, user) => (this.handle(reaction, user)));
            this.collector.on("end", () => (this.endHandling()));
            this.updateImage();
        });
    }

    private filter(reaction: MessageReaction, user: User): boolean {
        let isReaction = false;
        for(let i = 0; i < this.optionsList.length; i++) {
            if(reaction.emoji.name === this.optionsList[i].reaction) {
                isReaction = true;
                break;
            }
        }
        return isReaction && ((user.id === this.requesterID || this.isPublic) && user.id != this.botID);
    }

    private async handle(reaction: MessageReaction, user: User): Promise<void> {
        for(let i = 0; i < this.optionsList.length; i++) {
            if(reaction.emoji.name === this.optionsList[i].reaction) {
                await this.optionsList[i].callback(this.getPayload());
                break;
            }
        }
        if(!this.isDeleted) this.updateImage();
    }

    private async setReactions(): Promise<void> {
        for(let i = 0; i < this.optionsList.length; i++) {
            await this.message.react(this.optionsList[i].reaction);
        }
    }

    private async updateImage(): Promise<void> {
        this.message.edit(await this.getMsg({ message: this.message, images: this.images, i: this.i }));
    }

    private endHandling(): void {
        if(this.interval) {
            clearInterval(this.interval);
        }
        
        if(this.message.deletable) this.message.delete();
        this.isDeleted = true;
    }

    private getPayload(): ImagesSwitcherFields {
        return {
            message: this.message,
            requesterID: this.requesterID,
            botID: this.botID,
            images: this.images,
            isPublic: this.isPublic,
            collector: this.collector,
            getMsg: this.getMsg,
            interval: this.interval,
            optionsList: this.optionsList,
            i: this.i
        }
    }
}