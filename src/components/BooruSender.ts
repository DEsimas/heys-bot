import { Message, MessageEmbed } from "discord.js";
import * as Booru from "booru";
import SearchResults from "booru/dist/structures/SearchResults";
import { ImagesSwitcher } from "./ImagesSwitcher";

export class BooruSender {
    private message: Message;
    private source: string;
    private tags: Array<string>;
    private amount: number;

    private readonly errorColour = "#ff0000";

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

    private async sendPosts(posts: SearchResults): Promise<void> {
        const embed = new MessageEmbed()
            .setColor("#202225")
            .setTitle("Loading...");

        const msg = await this.message.channel.send({ embeds: [embed] });
        const images: string[] = [];
        posts.forEach(el => el.fileUrl ? images.push(el.fileUrl) : null);

        new ImagesSwitcher(msg, this.message.author.id, images, (images, i) => {
            const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".flv", ".mkv", ".wmv"];

            function isVideo(): boolean {
                const t = images[i].split(".");
                const extension = ("." + t[t.length - 1]).toLowerCase();

                return videoExtensions.includes(extension);

            }

            if(isVideo()) {
                return { content: `Enjoy :)\n**${i+1} / ${images.length}**\n${images[i]}`, embeds: [] };
            }

            const embed =  new MessageEmbed()
                .setTitle(`${i+1} / ${images.length}`)
                .setColor("#202225")
                .setImage(images[i]);

            return { content: "Enjoy :)", embeds: [embed] };
        })
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