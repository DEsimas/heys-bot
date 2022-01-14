import { Message, MessageEmbed } from "discord.js";
import * as Booru from "booru";
import SearchResults from "booru/dist/structures/SearchResults";
import { Images, ImagesSwitcher } from "./ImagesSwitcher";

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
        const images: Images = [];
        posts.forEach(el => el.fileUrl ? images.push({ url: el.fileUrl, tags: el.tags}) : null);

        new ImagesSwitcher(msg, this.message.author.id, images, true, (images, i, doTags) => {

            const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".flv", ".mkv", ".wmv"];

            function isVideo(): boolean {
                const t = images[i].url.split(".");
                const extension = ("." + t[t.length - 1]).toLowerCase();

                return videoExtensions.includes(extension);
            }

            function parseTags(): string | null {
                const tagsArr = images[i].tags;
                if(!tagsArr) return null;
                let tags = "";
                tagsArr.forEach(tag => tags += `**${tag}**, `);
                return tags.slice(0, -2);
            }

            if (isVideo()) {
                return { content: `**${i + 1} / ${images.length}**${parseTags() && doTags ? `\n**Tags:** ${parseTags()}` : ""}\n${images[i].url}`, embeds: [] };
            }

            const embed = new MessageEmbed()
                .setTitle(`${i + 1} / ${images.length}`)
                .setColor("#202225")
                .setImage(images[i].url);

            return { content: `${parseTags() && doTags ? `\n**Tags:** ${parseTags()}` : "Enjoy :)"}`, embeds: [embed] };
        })
    };

    public send(): void {
        if (this.source === "gelbooru.com" ||
            this.source === "gb" ||
            this.source === "gel" ||
            this.source === "gelbooru" ||
            this.source === "yande.re" ||
            this.source === "yd" ||
            this.source === "yand" ||
            this.source === "yandere") {

            this.sendError("Service temporary unavalible");
            return;
        }

        if(process.env.PROHIBITED) {
            const prohibited = JSON.parse(process.env.PROHIBITED)
            if(Array.isArray(prohibited)) {
                let doExit = false;
                this.tags.forEach(tag => {
                    if(prohibited.includes(tag)) doExit = true;
                })
                if(doExit) return this.sendError("Not so fast. Your request contains prohibited tags!");
            }
        }

        try {
            Booru.search(this.source, this.tags, { limit: this.amount, random: true }).then(posts => {
                if (!posts.length) {
                    this.sendError("Nothing was found");
                    return;
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