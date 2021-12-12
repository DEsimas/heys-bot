import { Message, MessageEmbed } from "discord.js";
import * as Booru from "booru";
import SearchResults from "booru/dist/structures/SearchResults";

export class BooruSender {
    private message: Message;
    private source: string;
    private tags: Array<string>;
    private amount: number;

    private readonly errorColour = "#ff0000";
    private readonly videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".flv", ".mkv", ".wmv"];

    constructor(message: Message, source: string, tags: Array<string>, amount: number) {
        this.message = message;
        this.source = source;
        this.tags = tags;
        this.amount = amount;
    }

    private sendError(message: string): void {
        if (!this.message) return;
        const embed = new MessageEmbed()
            .setColor(this.errorColour)
            .setTitle(message);
        this.message.channel.send({ embeds: [embed] });
    }

    private isVideo(url: string | null): boolean {
        if(url === null) return false;

        const t = url.split(".");
        const extension = ("." + t[t.length - 1]).toLowerCase();
        
        //console.log(`${url} >>> ${extension}`);

        return this.videoExtensions.includes(extension);
    }

    private getImageEmbed(url: string | null): MessageEmbed {
        return new MessageEmbed()
                .setImage(url || "https://cdn.discordapp.com/attachments/883231507349663754/919280306039693362/de87d8677c229687.png")
                .setColor("#202225");
    }

    private sendPosts(posts: SearchResults): void {
        let embeds: Array<MessageEmbed> = [];
        posts.forEach((el, index) => {
            if(this.isVideo(el.fileUrl)) {

                if(embeds.length) {
                    this.message.channel.send({ embeds: embeds });
                    embeds = [];
                }

                this.message.channel.send(el.fileUrl || "https://cdn.discordapp.com/attachments/883231507349663754/919280306039693362/de87d8677c229687.png");
            }
            else embeds.push(this.getImageEmbed(el.fileUrl));

            if (embeds.length === 10) {
                this.message.channel.send({ embeds: embeds });
                embeds = [];
            }
        });

        if (embeds.length) this.message.channel.send({ embeds: embeds });
        if(posts.length >= 5) this.message.channel.send(this.message.url);
    };

    public send(): void {
        try {
            Booru.search(this.source, this.tags, { limit: this.amount, random: true }).then(posts => {
                if (!posts.length) {
                    this.sendError("Nothing was found");
                }
                this.sendPosts(posts);
            }).catch(err => {
                this.sendError("Resource not responding. Try again");
            });
        } catch {
            this.sendError("This site not supported");
        }
    }
}