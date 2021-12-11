"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoujinSender = void 0;
const discord_js_1 = require("discord.js");
const nhentai = require("nhentai");
class DoujinSender {
    constructor(id, message, url) {
        this.errorColour = "#ff0000";
        this.id = id;
        this.message = message;
        this.url = url;
    }
    sendError(message) {
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.errorColour)
            .setTitle(message);
        this.message.channel.send({ embeds: [embed] });
    }
    isEnglish(doujin) {
        let isEnglish = false;
        doujin.tags.all.forEach(tag => {
            if (tag.name === "english")
                isEnglish = true;
        });
        return isEnglish;
    }
    ;
    sendInfo(doujin) {
        let tags = doujin.tags.all.map(tag => tag.name).join(', ');
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor("NHENTAI")
            .addField("Enjoy the masterpiece: ", "**" + doujin.titles.pretty + "**" + " [" + doujin.id + "]")
            .addField("Tags: ", tags)
            .setThumbnail(doujin.thumbnail.url)
            .setColor("#202225");
        this.message.channel.send({ embeds: [embed] });
    }
    ;
    sendPages(doujin) {
        let embeds = [];
        doujin.pages.forEach((el, index) => {
            const embed = new discord_js_1.MessageEmbed()
                .setImage(el.url)
                .setColor("#202225");
            embeds.push(embed);
            if ((index + 1) % 10 === 0) {
                this.message.channel.send({ embeds: embeds });
                embeds = [];
            }
        });
        if (embeds.length)
            this.message.channel.send({ embeds: embeds });
        this.message.channel.send(this.url);
    }
    ;
    sendRandom() {
        return __awaiter(this, void 0, void 0, function* () {
            const api = new nhentai.API();
            let acknowlaged = false;
            while (!acknowlaged) {
                const ID = Math.floor(Math.random() * 300000);
                const doujin = yield api.fetchDoujin(ID).catch(err => (null));
                if (doujin !== null) {
                    if (this.isEnglish(doujin)) {
                        this.sendInfo(doujin);
                        this.sendPages(doujin);
                        acknowlaged = true;
                    }
                }
            }
        });
    }
    sendByID(ID) {
        const api = new nhentai.API();
        api.fetchDoujin(ID).then(doujin => {
            if (!doujin) {
                this.sendError("An error was occurred. May be its a sign?");
                return;
            }
            ;
            this.sendInfo(doujin);
            this.sendPages(doujin);
        }).catch(err => {
            this.sendError("An error was occurred. May be its a sign?");
        });
    }
    sendDoujin() {
        if (this.id.toLowerCase() === "random")
            this.sendRandom();
        else
            this.sendByID(this.id);
    }
}
exports.DoujinSender = DoujinSender;
;
//# sourceMappingURL=DoujinSender.js.map