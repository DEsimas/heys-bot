import { Message, MessageEmbed, TextBasedChannel } from "discord.js";
import * as nhentai from "nhentai";
import { Doujin } from "nhentai";
import { Blacklist } from "../../database/ServersBlacklists";
import { Images, ImagesSwitcher } from "./ImagesSwitcher";

export class DoujinSender {
    private readonly id: string;
    private readonly message: Message;
    private readonly blacklists: Blacklist;

    private readonly retries = 20;
    private readonly errorColour = "#ff0000";

    constructor(id: string, message: Message, blacklists: Blacklist) {
        this.id = id;
        this.message = message;
        this.blacklists = blacklists;
    }

    private sendError(message: string): void {
        const embed = new MessageEmbed()
            .setColor(this.errorColour)
            .setTitle(message);
        this.message.channel.send({ embeds: [embed] });
    }

    private isEnglish(doujin: Doujin): boolean {
        let isEnglish = false;
        doujin.tags.all.forEach(tag => {
            if (tag.name === "english") isEnglish = true;
        });
        return isEnglish;
    };

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
        
        const msg = await this.message.channel.send({embeds: [embed]});

        const images: Images = [];

        doujin.pages.forEach(el => images.push({url: el.url}));
        
        new ImagesSwitcher(msg, this.message.author.id, images, false, (pages, i, doTags) => {
            const embed = new MessageEmbed()
                .setTitle(`${i+1} / ${pages.length}`)
                .setColor("#202225")
                .setImage(pages[i].url);

            return {embeds:[embed]};
        });
    }

    private async sendRandom(): Promise<void> {
        const api = new nhentai.API();
        let acknowlaged = false;
        let requests = 0;

        while(!acknowlaged && requests < this.retries) {
            requests++;
            const ID = Math.floor(Math.random() * 300000);

            const doujin: Doujin | null = await api.fetchDoujin(ID).catch(err => (null));
            if(doujin !== null && !this.isProhibited(doujin)) {
                if(this.isEnglish(doujin)) {
                    this.sendInfo(doujin);
                    this.sendPages(doujin);
                    acknowlaged = true;
                }
            }
        }

        if(requests === this.retries) this.sendError("Nothing was found. You should try removing some tags from blacklist");
    }

    private isProhibited(doujin: Doujin): boolean {
        let flag = false;
        doujin.tags.all.forEach(tag => {
            if(this.blacklists.global.includes(tag.name)) flag = true;
            if(this.blacklists.sites.nhentai.includes(tag.name)) return flag = true;
        });
        return flag;
    }

    private sendByID(ID: string): void {
        const api = new nhentai.API();
        api.fetchDoujin(ID).then(doujin  => {
            if(!doujin){
                this.sendError("An error was occurred. May be its a sign?");
                return;
            };
    
            if(this.isProhibited(doujin)) return this.sendError("Not so fast. Your request contains blacklisted tags!");

            this.sendInfo(doujin);
            this.sendPages(doujin);
        }).catch(err => {
            this.sendError("An error was occurred. May be its a sign?");
        });
    }

    public sendDoujin() {
        if(this.id.toLowerCase() === "random") this.sendRandom();
        else this.sendByID(this.id);
    }
};