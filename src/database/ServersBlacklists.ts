import { Schema } from "mongoose";
import { Blacklist, Blacklists } from "./Blacklists";

export class ServersBlacklists extends Blacklists {
    constructor() {
        super("serversBlacklists", "serverID");
    }

    public getBlacklistSchema(): Schema<Blacklist> {
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
}