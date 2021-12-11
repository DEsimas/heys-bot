"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = void 0;
const discord_js_1 = require("discord.js");
const BooruSender_1 = require("../components/BooruSender");
const DoujinSender_1 = require("../components/DoujinSender");
class Get {
    constructor(payload) {
        this.amount = 1;
        this.errorColour = "#ff0000";
        this.maxAmount = 200;
        this.nhentaiAllias = ["nhentai", "nh", "nhentai.net"];
        this.args = [...payload.args];
        const args = payload.args;
        this.message = payload.message;
        this.source = this.args[1];
        args.splice(0, 2);
        args.forEach((arg, index) => {
            const amount = Number(arg);
            if (!isNaN(amount)) {
                if (amount > this.maxAmount)
                    this.amount = this.maxAmount;
                else
                    this.amount = amount;
                args.splice(index, 1);
            }
        });
        this.tags = args;
    }
    sendError(message) {
        if (!this.message)
            return;
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.errorColour)
            .setTitle(message);
        this.message.channel.send({ embeds: [embed] });
    }
    validateRequest() {
        if (!this.message || !this.source || !this.amount) {
            this.sendError(`Wrong input. Type **${process.env.PREFIX || "$"}help**.`);
            return false;
        }
        if (this.message.channel.type !== "GUILD_TEXT") {
            this.sendError("You can make requests only in server text channels.");
            return false;
        }
        if (!this.message.channel.nsfw) {
            this.sendError("Hentai is only availible on nsfw channels");
            return false;
        }
        return true;
    }
    isSourceNhentai() {
        return this.nhentaiAllias.includes(this.source.toLowerCase());
    }
    execute() {
        if (!this.validateRequest())
            return;
        if (this.isSourceNhentai()) {
            const sender = new DoujinSender_1.DoujinSender(this.args[2] || "random", this.message, this.message.url);
            sender.sendDoujin();
        }
        else {
            const sender = new BooruSender_1.BooruSender(this.message, this.source, this.tags, this.amount);
            sender.send();
        }
    }
}
exports.Get = Get;
;
//# sourceMappingURL=Get.js.map