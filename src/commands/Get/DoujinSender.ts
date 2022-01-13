import { Message, MessageEmbed, TextBasedChannel } from "discord.js";
import * as nhentai from "nhentai";
import { Doujin } from "nhentai";
import { ImagesSwitcher } from "./ImagesSwitcher";

export class DoujinSender {
    private id: string;
    private message: Message;
    
    private readonly errorColour = "#ff0000";

    constructor(id: string, message: Message) {
        this.id = id;
        this.message = message;
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

        const images: string[] = [];

        doujin.pages.forEach(el => images.push(el.url));
        
        new ImagesSwitcher(msg, this.message.author.id, images, (pages, i) => {
            const embed = new MessageEmbed()
                .setTitle(`${i+1} / ${pages.length}`)
                .setColor("#202225")
                .setImage(pages[i]);

            return {embeds:[embed]};
        });
    }

    private async sendRandom(): Promise<void> {
        const api = new nhentai.API();
        let acknowlaged = false;

        while(!acknowlaged) {
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
    }

    private isProhibited(doujin: Doujin): boolean {
        let flag = false;
        if(process.env.PROHIBITED) {
            const prohibited = JSON.parse(process.env.PROHIBITED)
            console.log(prohibited);
            if(Array.isArray(prohibited)) {
                doujin.tags.tags.forEach(tag => {
                    if(prohibited.includes(tag.name)) flag = true;
                    console.log(prohibited, tag);
                });
            }
        }
        return flag;
    }

    private sendByID(ID: string): void {
        const api = new nhentai.API();
        api.fetchDoujin(ID).then(doujin  => {
            if(!doujin){
                this.sendError("An error was occurred. May be its a sign?");
                return;
            };
    
            if(this.isProhibited(doujin)) return this.sendError("Not so fast. Your request contains prohibited tags!");

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