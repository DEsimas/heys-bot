import { model, Model, Schema } from "mongoose";
import { Sites, sitesArray } from "./../sites";

export interface Blacklist {
    userID: string;
    global: string[];
    sites: Record<Sites, string[]>;
}

export class UsersBlacklists {
    private readonly BlacklistModel: Model<Blacklist>

    constructor() {
        this.BlacklistModel = model<Blacklist>("UsersBlacklists", this.getBlacklistSchema());
    }

    private getBlacklistSchema(): Schema<Blacklist> {
        return new Schema<Blacklist>({
            userID: String,
            global: [String],
            sites: {
                e621: [String],
                e926: [String],
                hypnohub: [String],
                danbooru: [String],
                konachanCOM: [String],
                konachanNET: [String],
                yandere: [String],
                gelbooru: [String],
                rule34: [String],
                safebooru: [String],
                tbib: [String],
                xbooru: [String],
                paheal: [String],
                derpibooru: [String],
                realbooru: [String],
                nhentai: [String]
            }
        });
    }

    public getDefaultBlacklist(userID: string): Blacklist {
        return {
            userID: userID,
            global: [],
            sites: {
                e621: [],
                e926: [],
                hypnohub: [],
                danbooru: [],
                konachanCOM: [],
                konachanNET: [],
                yandere: [],
                gelbooru: [],
                rule34: [],
                safebooru: [],
                tbib: [],
                xbooru: [],
                paheal: [],
                derpibooru: [],
                realbooru: [],
                nhentai: []
            }
        }
    }

    public concat(black1: Blacklist, black2: Blacklist): Blacklist {
        const black = this.getDefaultBlacklist("");
        black.global = black1.global.concat(black2.global);
        sitesArray.forEach(site => {
            black.sites[site] = black1.sites[site].concat(black2.sites[site]);
        });
        return black;
    }

    public async create(serverID: string): Promise<Blacklist> {
        return (new this.BlacklistModel(this.getDefaultBlacklist(serverID))).save();
    }

    public async addTags(userID: string, site: Sites | "global", tags: string[]): Promise<Blacklist | null> {
        let server = await this.BlacklistModel.findOne({ userID: userID });
        if (!server) return null;
        else await this.BlacklistModel.deleteOne({ userID: userID });

        if (site === "global") server.global = server.global.concat(tags);
        else server.sites[site] = server.sites[site].concat(tags);

        const updated: Blacklist = {
            userID: server.userID,
            global: server.global,
            sites: server.sites
        }

        return (new this.BlacklistModel(updated)).save();
    }

    public async removeTags(userID: string, site: Sites | "global", tags: string[]): Promise<Blacklist | null> {
        let server = await this.BlacklistModel.findOne({ userID: userID });
        if (!server) return null;
        else await this.BlacklistModel.deleteOne({ userID: userID });

        if (site === "global") {
            tags.forEach((tag) => {
                const index = server?.global.indexOf(tag);
                if (index !== undefined && index > -1) {
                    server?.global.splice(index, 1);
                }
            });
        }
        else {
            tags.forEach((tag) => {
                const index = server?.sites[site].indexOf(tag, 0);
                if (index && index > -1) {
                    server?.sites[site].splice(index, 1);
                }
            });
        }

        const updated: Blacklist = {
            userID: server.userID,
            global: server.global,
            sites: server.sites
        }

        return (new this.BlacklistModel(updated)).save();
    }

    public async getBlacklist(userID: string, site: Sites | "global"): Promise<string[] | null> {
        const server = await this.BlacklistModel.findOne({ userID: userID });
        if(!server) return null;
        return site === "global" ? server.global : server.sites[site];
    }

    public async getBlacklists(userID: string): Promise<Blacklist | null> {
        return this.BlacklistModel.findOne({ userID: userID });
    }

    public async doesExist(userID: string): Promise<boolean> {
        return (await this.BlacklistModel.findOne({ userID: userID })) !== null;
    }
};