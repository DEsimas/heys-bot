import { Payload } from "discordjs-commands-parser";
import { Blacklist, Blacklists } from "../../database/Blacklists";
import { DAO } from "../../database/DAO";
import { command } from "./../Command";
import { DoujinSender } from "./DoujinSender";
import { SenderOptions } from "./Sender";

export class Get extends command {
    private readonly site: string;
    private readonly tags: string[];
    private readonly doujinID: string;

    constructor(payload: Payload) {
        super(payload);
        this.site = this.args[1];
        this.doujinID = this.args[2];
        this.tags = [...this.args];
        this.tags.splice(0,2);
    }

    public async execute(): Promise<void> {
        if(this.getSrc(this.site) === "nhentai") {
            const options: SenderOptions = {
                message: this.message,
                blacklist: await this.getBlacklist(),
                origin: this.site,
                src: this.getSrc(this.site) || "",
                tags: undefined,
                doujinID: this.doujinID
            }
            new DoujinSender(options).send();
        } else {
            this.message.channel.send("send booru");
        }
    }

    private async getBlacklist(): Promise<Blacklist> {
        const serverID = this.message.guild?.id;
        if (serverID === undefined) return Blacklists.concat(DAO.ServersBalacklists.getDefaultBlacklist("not a server"), DAO.UsersBlacklists.getDefaultBlacklist(this.message.author.id));

        let res: Blacklist;
        const serverBL = await DAO.ServersBalacklists.getBlacklists(serverID);
        if (!this.flags.includes("--force")) {
            const userBL = await DAO.UsersBlacklists.getBlacklists(this.message.author.id);
            res = Blacklists.concat(serverBL, userBL);
        } else res = serverBL;

        // TODO: add blacklisting tags from request

        return res;
    }
};