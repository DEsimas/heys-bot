import { MessageEmbed } from "discord.js";
import { API, Doujin } from "nhentai";
import { Image } from "./ImagesSwitcher";
import { ImagesSwitcher, Payload } from "./ImagesSwitcher";
import { Sender, SenderOptions } from "./Sender";

export class DoujinSender extends Sender {
    private readonly retries = 20;

    constructor(options: SenderOptions) {
        super(options)
    }

    public async send(): Promise<void> {

        //temporarly disabling nhentai
        if(1+1===2) return this.sendError("nhentai temporarily unavailable!");

        if (this.doujinID?.toLowerCase() === "random" || this.doujinID === undefined) {
            const doujin = await this.fetchRandomDoujin();
            if (doujin === null) return;
            this.sendDoujin(doujin);
        } else {
            const doujin = await this.fetchDoujin(this.doujinID);
            if (doujin === null) return;
            this.sendDoujin(doujin);
        }
    }

    private async fetchRandomDoujin(): Promise<Doujin | null> {
        const api = new API();

        let retries = this.retries;
        while (retries) {
            const doujin = await api.fetchDoujin(Math.floor(Math.random() * 400000));
            if (doujin && !this.isProhibited(doujin) && this.isEnglish(doujin)) {
                return doujin;
            }
            retries--;
        }

        this.sendError("Nothing was found");
        return null;
    }

    private async fetchDoujin(id: string): Promise<Doujin | null> {
        const api = new API();
        if (isNaN(Number(id)) || Number(id) < 1 || !(await api.doujinExists(Number(id)))) {
            this.sendError("Wrong id >_<");
            return null;
        }

        const doujin = await api.fetchDoujin(id);
        if (doujin && !this.isProhibited(doujin)) return doujin;

        this.sendError("This doujin contains prohibited tags");
        return null;
    }

    private async sendDoujin(doujin: Doujin): Promise<void> {
        await this.sendInfo(doujin);
        await this.sendPages(doujin);
    }

    private sendInfo(doujin: Doujin) {
        let tags = doujin.tags.all.map(tag => tag.name).join(', ');
        const embed = new MessageEmbed()
            .setAuthor({ name: "NHENTAI" })
            .addField("Enjoy the masterpiece: ", "**" + doujin.titles.pretty + "**" + " [" + doujin.id + "]")
            .addField("Tags: ", tags)
            .setThumbnail(doujin.thumbnail.url)
            .setColor("#202225");
        this.message.channel.send({ embeds: [embed] });
    }

    private async sendPages(doujin: Doujin): Promise<void> {
        const embed = new MessageEmbed()
            .setTitle("Loading...")
            .setColor("#202225");

        const msg = await this.message.channel.send({ embeds: [embed] });

        const images: Array<Image> = [];
        doujin.pages.forEach(page => {
            images.push({ url: page.url});
        })

        new ImagesSwitcher({
            message: msg,
            reuqesterID: this.message.author.id,
            botID: this.botID,
            images: images,
            doTags: false,
            isPublic: this.flags.includes("--public"),
            getMsg: (payload: Payload) => {
                const embed = new MessageEmbed()
                    .setTitle(`**${payload.i+1}/${payload.images.length}**`)
                    .setImage(payload.images[payload.i].url);
                return { embeds: [embed] };
            }
        });
    }

    private isEnglish(doujin: Doujin): boolean {
        return !doujin.tags.all.every(tag => {
            if (tag.name === "english") return false;
            return true;
        });
    }

    private isProhibited(doujin: Doujin): boolean {
        return !doujin.tags.all.every(tag => {
            if (this.blacklist.global.includes(tag.name)) return false;
            if (this.blacklist.sites.nhentai.includes(tag.name)) return false;
            return true;
        });
    }
}