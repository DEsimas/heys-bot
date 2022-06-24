import { MessageEmbed } from "discord.js";
import { Payload } from "./../../parser/types";
import { command } from "../Command";
import { DAO } from "./../../database/DAO";

export class SetPrefix extends command {
    constructor(payload: Payload) {
        super(payload);
    }

    public async execute() : Promise<void> {
        if(!(await this.isAdmin())) {
            this.message.channel.send({embeds:[new MessageEmbed().setColor("#FF0000").setTitle("This command is avaliable only for admins")]});
            return;
        }

        let prefix = this.args[1];
        if(!prefix) prefix = "$";

        await DAO.Prefixes.editPrefix(this.serverID, prefix);

        this.message.channel.send({ embeds: [new MessageEmbed().setColor("#00FF00").setTitle(`New prefix is: ${prefix}`)]});
    }
}