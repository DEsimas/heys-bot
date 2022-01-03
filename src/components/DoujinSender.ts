import { Message, MessageEmbed } from "discord.js";
import * as nhentai from "nhentai";
import { Doujin } from "nhentai";
import { DAO } from "../database/DAO";
import { ImagesSwitcher } from "./ImagesSwitcher";

export class DoujinSender {
    private id: string;
    private message: Message;
    private url: string;
    
    private readonly errorColour = "#ff0000";

    constructor(id: string, message: Message, url: string) {
        this.id = id;
        this.message = message;
        this.url = url;
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
            .setAuthor("NHENTAI")
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
        
        new ImagesSwitcher(msg, this.message.author.id, doujin.pages, (pages, i) => {
            const embed = new MessageEmbed()
                .setTitle(`${i+1} / ${pages.length}`)
                .setColor("#202225")
                .setImage(pages[i].url);

            return embed;
        });
    }

    private async sendRandom(): Promise<void> {
        const api = new nhentai.API();
        let acknowlaged = false;

        while(!acknowlaged) {
            const ID = Math.floor(Math.random() * 300000);

            const doujin: Doujin | null = await api.fetchDoujin(ID).catch(err => (null));
            if(doujin !== null) {
                if(this.isEnglish(doujin)) {
                    this.sendInfo(doujin);
                    this.sendPages(doujin);
                    acknowlaged = true;
                }
            }
        }
    }

    private sendByID(ID: string): void {
        const api = new nhentai.API();
        api.fetchDoujin(ID).then(doujin  => {
            if(!doujin){
                this.sendError("An error was occurred. May be its a sign?");
                return;
            };
    
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