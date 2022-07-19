import Post from "booru/dist/structures/Post";
import SearchResults from "booru/dist/structures/SearchResults";
import * as Booru from "booru";
import { Sender, SenderOptions } from "./Sender";
import { MessageEmbed } from "discord.js";
import { ImagesSwitcher } from "./ImagesSwitcher";
import { Image, Payload } from "./ImagesSwitcherTypes";
import { DAO } from "../../database/DAO";

export class BooruSender extends Sender {
    constructor(options: SenderOptions) {
        super(options);
    }

    public async send(): Promise<void> {
        if (this.isProhibited()) return this.sendError("Not so fast. Your request contains blacklisted tags!");

        try {
            Booru.search(this.origin, this.tags, { limit: 100, random: true }).then(posts => {
                const src = this.src;
                const filtered = this.filterPosts(posts, this.blacklist.global.concat(src ? this.blacklist.sites[src] : []));
                if (!filtered.length) {
                    this.sendError("Nothing was found");
                    return;
                }
                this.sendPosts(filtered);
            }).catch(err => {
                this.sendError("Resource is not responding. Try again");
            });
        } catch {
            this.sendError("This site not supported");
        }
    }

    private isProhibited(): boolean {
        return !this.tags.every(tag => {
            if (this.blacklist.global.includes(tag)) return false;
            if (this.src && this.blacklist.sites[this.src].includes(tag)) return false;
            return true;
        });
    }

    private filterPosts(posts: SearchResults, filter: string[]): Array<Post> {
        const res: Array<Post> = [];
        posts.forEach(post => {
            let isOk = true;
            post.tags.forEach(tag => {
                if (filter.includes(tag)) isOk = false;
            });
            if (isOk) res.push(post);
        });
        return res;
    }

    private async sendPosts(posts: Array<Post>): Promise<void> {
        this.message.channel.send({ embeds: [new MessageEmbed().setTitle(`Found ${posts.length} posts`)] });

        const embed = new MessageEmbed()
            .setColor("#202225")
            .setTitle("Loading...");

        const msg = await this.message.channel.send({ embeds: [embed] });
        const images: Array<Image> = [];
        posts.forEach(el => el.fileUrl ? images.push({ url: el.fileUrl, tags: el.tags }) : null);

        new ImagesSwitcher({
            message: msg,
            requesterID: this.message.author.id,
            botID: this.botID,
            isPublic: this.flags.includes("--public"),
            images: images,
            options: ["tags", "like", "dislike", "removeReaction"],
            timer: this.getTimer(),
            getMsg: async (payload: Payload) => {
                const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".flv", ".mkv", ".wmv"];
                const i = payload.i;
                const images = payload.images;

                function isVideo(): boolean {
                    const t = images[i].url.split(".");
                    const extension = ("." + t[t.length - 1]).toLowerCase();

                    return videoExtensions.includes(extension);
                }

                function parseTags(): string | null {
                    const tagsArr = images[i].tags;
                    if (!tagsArr) return null;
                    let tags = "";
                    tagsArr.forEach(tag => tags += `**${tag}**, `);
                    return tags.slice(0, -2);
                }

                if (isVideo()) {
                    let text = `**${i + 1} / ${images.length}**`;
                    if (payload.postRating)
                        text += `\n**${payload.postRating.likes} 👍 / ${payload.postRating.dislikes} 👎**`;

                    if (payload.doTags)
                        text += `\n${parseTags()}`;

                    return { content: text, embeds: [] };
                }

                const embed = new MessageEmbed()
                    .setTitle(`${i + 1} / ${images.length}`)
                    .setColor("#202225")
                    .setImage(images[i].url);

                let text = "";
                if (payload.postRating)
                    text += `\n**${payload.postRating.likes} 👍 / ${payload.postRating.dislikes} 👎**`;

                if (payload.doTags)
                    text += `\n${parseTags()}`;

                return { content: text, embeds: [embed] };
            }
        });
    }
}