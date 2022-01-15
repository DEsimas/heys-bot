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
                konachanCO: [String],
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

    private getDefaultBlacklist(serverID: string): Blacklist {
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

    private async create(serverID: string): Promise<Blacklist> {
        return (new this.BlacklistModel(this.getDefaultBlacklist(serverID))).save();
    }
};