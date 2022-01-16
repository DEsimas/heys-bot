import { model, Model, Schema } from "mongoose";
import { Sites } from "./../sites";

export interface Blacklist {
    serverID: string;
    global: string[];
    sites: Record<Sites, string[]>;
}

export class ServersBlacklists {
    private readonly BlacklistModel: Model<Blacklist>

    constructor() {
        this.BlacklistModel = model<Blacklist>("ServersBlacklists", this.getBlacklistSchema())
    }

    private getBlacklistSchema(): Schema<Blacklist> {
        return new Schema<Blacklist>({
            serverID: String,
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

    public getDefaultBlacklist(serverID: string): Blacklist {
        return {
            serverID: serverID,
            global: ["loli", "lolicon", "shota", "shotacon"],
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

    public async create(serverID: string): Promise<Blacklist> {
        return (new this.BlacklistModel(this.getDefaultBlacklist(serverID))).save();
    }

    public async addTags(serverID: string, site: Sites | "global", tags: string[]): Promise<Blacklist | null> {
        let server = await this.BlacklistModel.findOne({ serverID: serverID });
        if (!server) return null;
        else await this.BlacklistModel.deleteOne({ serverID: serverID });

        if (site === "global") server.global = server.global.concat(tags);
        else server.sites[site] = server.sites[site].concat(tags);

        const updated: Blacklist = {
            serverID: server.serverID,
            global: server.global,
            sites: server.sites
        }

        return (new this.BlacklistModel(updated)).save();
    }

    public async removeTags(serverID: string, site: Sites | "global", tags: string[]): Promise<Blacklist | null> {
        let server = await this.BlacklistModel.findOne({ serverID: serverID });
        if (!server) return null;
        else await this.BlacklistModel.deleteOne({ serverID: serverID });

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
                if (index !== undefined && index > -1) {
                    server?.sites[site].splice(index, 1);
                }
            });
        }

        const updated: Blacklist = {
            serverID: server.serverID,
            global: server.global,
            sites: server.sites
        }

        return (new this.BlacklistModel(updated)).save();
    }

    public async getBlacklist(serverID: string, site: Sites | "global"): Promise<string[] | null> {
        const server = await this.BlacklistModel.findOne({ serverID: serverID });
        if(!server) return null;
        return site === "global" ? server.global : server.sites[site];
    }

    public async getBlacklists(serverID: string): Promise<Blacklist | null> {
        return this.BlacklistModel.findOne({ serverID: serverID });
    }

    public async doesExist(serverID: string): Promise<boolean> {
        return (await this.BlacklistModel.findOne({ serverID: serverID })) !== null;
    }
};