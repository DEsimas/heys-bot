import { Message, MessageEmbed } from "discord.js";
import { ICommandHandler, IPayload } from "discordjs-commands-parser";
import { BooruSender } from "./BooruSender";
import { DoujinSender } from "./DoujinSender";

export class Get implements ICommandHandler {
    private message: Message;
    private source: string;
    private tags: Array<string>;
    private args: Array<string>;

    private readonly errorColour = "#ff0000";
    private readonly booruLimit = 100;
    private readonly nhentaiAllias = ["nhentai", "nh", "nhentai.net"];

    constructor(payload: IPayload) {
        this.args = [...payload.args];
        const args = payload.args;
        this.message = payload.message;
        this.source = this.args[1];
        args.splice(0, 2);
        this.tags = args;
    }

    private sendError(message: string): void {
        if (!this.message) return;
        const embed = new MessageEmbed()
            .setColor(this.errorColour)
            .setTitle(message);
        this.message.channel.send({ embeds: [embed] });
    }

    private validateRequest(): boolean {
        
        if(!this.message || !this.source) {
            this.sendError(`Wrong input. Type **${process.env.PREFIX || "$"}help**.`);
            return false;
        }
    
        if(this.message.channel.type !== "GUILD_TEXT" ) {
            this.sendError("You can make requests only in server text channels.");
            return false;
        }

        if(!this.message.channel.nsfw) {
            this.sendError("Hentai is only availible on nsfw channels");
            return false;
        }
        
        return true;
    }

    private isSourceNhentai(): boolean {
        return this.nhentaiAllias.includes(this.source.toLowerCase());
    }

    public execute(): void {
        if(!this.validateRequest()) return;
        
        if(this.isSourceNhentai()) {
            const sender = new DoujinSender(this.args[2] || "random", this.message);
            sender.sendDoujin();
        } else {
            const sender = new BooruSender(this.message, this.source, this.tags, this.booruLimit);
            sender.send();
        }
    }
};