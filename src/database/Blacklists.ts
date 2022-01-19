import { model, Model, Schema } from "mongoose";
import { Sites, sitesArray } from "./sites";

export interface Blacklist {
    serverID?: string;
    userID?: string;
    global: string[];
    sites: Record<Sites, string[]>;
};

export abstract class Blacklists {
    private readonly BlacklistModel: Model<Blacklist>;
    private readonly id: "serverID" | "userID";

    protected abstract getBlacklistSchema(): Schema<Blacklist>;
    protected abstract getDefaultBlacklist(id: string): Blacklist;

    constructor(collectionName: string, id: "serverID" | "userID") {
        this.id = id;
        this.BlacklistModel = model<Blacklist>(collectionName, this.getBlacklistSchema());
    }

    public concat(blacklist1: Blacklist, blacklist2: Blacklist): Blacklist {
        const base = { ...blacklist1 };
        base.serverID = blacklist1.serverID || blacklist2.serverID;
        base.userID = blacklist1.userID || blacklist2.userID;
        base.global = blacklist1.global.concat(blacklist2.global);
        sitesArray.forEach(site => {
            base.sites[site] = blacklist1.sites[site].concat(blacklist2.sites[site]);
        });

        return base;
    }

    public async create(id: string): Promise<Blacklist> {
        return (new this.BlacklistModel(this.getDefaultBlacklist(id))).save();
    }

    public async addTags(id: string, site: Sites | "global", tags: string[]): Promise<Blacklist> {
        let blacklist : Blacklist | null = await this.BlacklistModel.findOne({ [this.id]: id });

        if(blacklist) await this.BlacklistModel.deleteOne({ [this.id]: id });
        else blacklist = this.getDefaultBlacklist(id);

        if (site === "global") blacklist.global = blacklist.global.concat(tags);
        else blacklist.sites[site] = blacklist.sites[site].concat(tags);

        const updated: Blacklist = {
            [this.id]: blacklist.serverID,
            global: blacklist.global,
            sites: blacklist.sites
        };

        return (new this.BlacklistModel(updated)).save();
    }

    public async removeTags(id: string, site: Sites | "global", tags: string[]): Promise<Blacklist> {
        let blacklist : Blacklist | null = await this.BlacklistModel.findOne({ [this.id]: id });

        if(blacklist) await this.BlacklistModel.deleteOne({ [this.id]: id });
        else blacklist = this.getDefaultBlacklist(id);

        if (site === "global") {
            tags.forEach((tag) => {
                const index = blacklist?.global.indexOf(tag);
                if (index !== undefined && index > -1) {
                    blacklist?.global.splice(index, 1);
                }
            });
        }
        else {
            tags.forEach((tag) => {
                const index = blacklist?.sites[site].indexOf(tag, 0);
                if (index !== undefined && index > -1) {
                    blacklist?.sites[site].splice(index, 1);
                }
            });
        }

        const updated: Blacklist = {
            [this.id]: blacklist.serverID,
            global: blacklist.global,
            sites: blacklist.sites
        };

        return (new this.BlacklistModel(updated)).save();
    }

    public async getBlacklist(id: string, site: Sites | "global"): Promise<string[]> {
        let blacklist: Blacklist | null = await this.BlacklistModel.findOne({ [this.id]: id });
        if(blacklist === null) blacklist = await this.create(id);
        return site === "global" ? blacklist.global : blacklist.sites[site];
    }

    public async getBlacklists(id: string): Promise<Blacklist> {
        return (await this.BlacklistModel.findOne({ [this.id]: id })) || (await this.BlacklistModel.create(id));
    }
}