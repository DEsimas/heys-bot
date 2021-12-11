"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
const discord_js_1 = require("discord.js");
class Help {
    constructor(payload) {
        this.message = payload.message;
    }
    execute() {
        const embed = new discord_js_1.MessageEmbed()
            .setColor("#202225")
            .setThumbnail("https://cdn.discordapp.com/attachments/883231507349663754/919303367442985001/th.png")
            .setTitle("Usage")
            .setDescription("18+")
            .addField("Command syntaxis:", `${process.env.PREFIX}get <resource name> <amount of posts> <tags separated by space>\n Source "nhentai.net" is special, it accepts doujin id or keyword "random"`)
            .addField("Resources and theri aliases:", "<resource name>")
            .addField("nhentai.net", "nhentai, nh", true)
            .addField("e621.net", "e6, e621", true)
            .addField("e926.net", "e9, e926", true)
            .addField("hypnohub.net", "hh, hypno, hypnohub", true)
            .addField("danbooru.donmai.us", "db, dan, dabbooru", true)
            .addField("konachan.com", "kc, konac, kcom", true)
            .addField("konachan.net", "kn, konan, knet", true)
            .addField("yande.re", "yd, yand, yandere", true)
            .addField("gelbooru.com", "gb, gel, gelbooru", true)
            .addField("rule34.xxx", "r34, rule34", true)
            .addField("safebooru.org", "sb, safe, safebooru", true)
            .addField("tbib.org", "tb, tbib, big", true)
            .addField("xbooru.com", "xb, xbooru", true)
            .addField("rule34.paheal.net", "pa, pageal", true)
            .addField("derpibooru.org", "dp, derp, derpi, derpibooru", true)
            .addField("realbooru.com", "rb, realbooru", true);
        this.message.channel.send({ embeds: [embed] });
    }
}
exports.Help = Help;
;
//# sourceMappingURL=help.js.map