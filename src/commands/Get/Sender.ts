import { Message, MessageEmbed } from "discord.js";
import { Blacklist } from "../../database/Blacklists";
import { Sites } from "../../database/sites";

export interface SenderOptions {
    message: Message,
    blacklist: Blacklist,
    origin: string,
    botID: string,
    src: Sites | null,
    flags: string[],
    tags: string[],
    doujinID: string | undefined
};

export abstract class Sender {
    protected readonly message: Message;
    protected readonly blacklist: Blacklist;
    protected readonly origin: string;
    protected readonly botID: string;
    protected readonly src: Sites | null;
    protected readonly flags: string[];
    protected readonly tags: string[];
    protected readonly doujinID: string | undefined;

    constructor(options: SenderOptions) {
        this.message = options.message;
        this.blacklist = options.blacklist;
        this.botID = options.botID;
        this.origin = options.origin;
        this.src = options.src;
        this.flags = options.flags;
        this.tags = options.tags;
        this.doujinID = options.doujinID;
    }

    public abstract send(): Promise<void>;

    protected sendError(message: string): void {
        const embed = new MessageEmbed()
            .setColor("#FF0000")
            .setTitle(message);
        this.message.channel.send({ embeds: [embed] });
    }

    protected getTimer(): number | undefined {
        let timer = 0;
        this.flags.forEach((elem) => {
            if (elem.search("--timer") != -1 || elem.search("--timeout") != -1 || elem.search("--time") != -1 || elem.search("--countdown") != -1) {
                elem = elem.replace("--timer", "");
                
                let pos = elem.search("s");
                while(pos != -1) {
                    let secs = "";
                    for(let i = 1; true; i++)
                        if(!isNaN(Number(elem[pos-i])))secs += elem[pos-i];
                        else break;
                    
                    secs = secs.split("").reverse().join("");
                    timer += Number(secs) * 1000;
                    elem = elem.replace(secs+"s", "Lida");
                    console.log(elem);
                    pos = elem.search("s");
                }

                pos = elem.search("m");

                while(pos != -1) {
                    let mins = "";
                    for(let i = 1; true; i++)
                        if(!isNaN(Number(elem[pos-i])))mins += elem[pos-i];
                        else break;
                    
                    mins = mins.split("").reverse().join("");
                    timer += Number(mins) * 60 * 1000;
                    elem = elem.replace(mins+"m", "Lida");
                    console.log(elem);
                    pos = elem.search("s");
                }
            }
        });
        if (timer == 0 || isNaN(timer)) return undefined;
        return timer;
    }
}