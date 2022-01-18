import { Message, MessageEmbed } from "discord.js";
import { CommandHandler, Payload } from "discordjs-commands-parser";
import { DAO } from "./../../database/DAO";

export class SetPrefix implements CommandHandler {
    private readonly message: Message;
    private readonly prefix: string;

    constructor(payload: Payload) {
        this.message = payload.message;
        this.prefix = payload.args[1] || "$";
    }

    public async execute() : Promise<void> {
        if(!this.message.guild?.id) return;
        if(!(await this.isAdmin())) {
            this.message.channel.send({embeds:[new MessageEmbed().setColor("#FF0000").setTitle("This command is avaliable only for admins")]});
            return;
        }

        DAO.Prefixes.editPrefix(this.message.guild.id, this.prefix);
        this.message.channel.send({ embeds: [new MessageEmbed().setColor("#00FF00").setTitle(`New prefix is: ${this.prefix}`)]});
    }

    private async isAdmin(): Promise<boolean> {
        const guildMember = await this.message.guild?.members.fetch(this.message.author.id)
        if(!guildMember) return false;
        const isAdmin = guildMember.permissions.has("ADMINISTRATOR");
        return isAdmin;
    };
}