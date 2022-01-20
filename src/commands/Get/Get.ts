import { Payload } from "discordjs-commands-parser";
import { Blacklist, Blacklists } from "../../database/Blacklists";
import { DAO } from "../../database/DAO";
import { command } from "./../Command";
import { BooruSender } from "./BooruSender";
import { DoujinSender } from "./DoujinSender";
import { SenderOptions } from "./Sender";

export class Get extends command {
    private readonly site: string;
    private readonly tags: string[];
    private readonly doujinID: string;

    constructor(payload: Payload) {
        super(payload);
        this.site = this.args[1]?.toLowerCase();
        this.doujinID = this.args[2];
        this.tags = [...this.args];
        this.tags.splice(0,2);
    }

    public async execute(): Promise<void> {
        if(this.getSrc(this.site) === "nhentai") {
            let src = this.getSrc(this.site);
            if(src === "global") src = null;
            const options: SenderOptions = {
                message: this.message,
                blacklist: await this.getBlacklist(),
                origin: this.site,
                botID: this.client.user?.id || "",
                src: src,
                flags: this.flags,
                tags: [],
                doujinID: this.doujinID
            };
            new DoujinSender(options).send();
        } else {
            let src = this.getSrc(this.site);
            if(src === "global") src = null;
            const options: SenderOptions = {
                message: this.message,
                blacklist: await this.getBlacklist(),
                origin: this.site,
                botID: this.client.user?.id || "",
                src: src,
                flags: this.flags,
                tags: this.tags,
                doujinID: undefined
            };
            new BooruSender(options).send();
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

        const bl = this.tags.filter(tag => (tag[0] === "-"));
        bl.forEach(tag => {
            res.global.push(tag.substring(1, tag.length));
            this.tags.splice(this.tags.indexOf(tag), 1);
        })

        return res;
    }
};