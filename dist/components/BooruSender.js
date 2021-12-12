"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooruSender = void 0;
const discord_js_1 = require("discord.js");
const Booru = require("booru");
class BooruSender {
    constructor(message, source, tags, amount) {
        this.errorColour = "#ff0000";
        this.videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".flv", ".mkv", ".wmv"];
        this.message = message;
        this.source = source;
        this.tags = tags;
        this.amount = amount;
    }
    sendError(message) {
        if (!this.message)
            return;
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.errorColour)
            .setTitle(message);
        this.message.channel.send({ embeds: [embed] });
    }
    isVideo(url) {
        if (url === null)
            return false;
        const t = url.split(".");
        const extension = ("." + t[t.length - 1]).toLowerCase();
        //console.log(`${url} >>> ${extension}`);
        return this.videoExtensions.includes(extension);
    }
    getImageEmbed(url) {
        return new discord_js_1.MessageEmbed()
            .setImage(url || "https://cdn.discordapp.com/attachments/883231507349663754/919280306039693362/de87d8677c229687.png")
            .setColor("#202225");
    }
    sendPosts(posts) {
        let embeds = [];
        posts.forEach((el, index) => {
            if (this.isVideo(el.fileUrl)) {
                if (embeds.length) {
                    console.log(embeds.length);
                    this.message.channel.send({ embeds: embeds });
                    embeds = [];
                }
                this.message.channel.send(el.fileUrl || "https://cdn.discordapp.com/attachments/883231507349663754/919280306039693362/de87d8677c229687.png");
            }
            else
                embeds.push(this.getImageEmbed(el.fileUrl));
            if (embeds.length === 10) {
                this.message.channel.send({ embeds: embeds });
                embeds = [];
            }
        });
        if (embeds.length)
            this.message.channel.send({ embeds: embeds });
        if (posts.length >= 5)
            this.message.channel.send(this.message.url);
    }
    ;
    send() {
        try {
            Booru.search(this.source, this.tags, { limit: this.amount, random: true }).then(posts => {
                if (!posts.length) {
                    this.sendError("Nothing was found");
                }
                this.sendPosts(posts);
            }).catch(err => {
                this.sendError("Resource not responding. Try again");
            });
        }
        catch (_a) {
            this.sendError("This site not supported");
        }
    }
}
exports.BooruSender = BooruSender;
//# sourceMappingURL=BooruSender.js.map