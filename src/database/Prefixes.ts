import { model, Model, Schema } from "mongoose";

export interface Prefix {
    serverID: string;
    prefix: string;
};

export class Prefixes {
    private readonly PrefixModel: Model<Prefix>;

    constructor() {
        this.PrefixModel = model<Prefix>("prefixes", this.getPrefixSchema());
    }

    private getPrefixSchema(): Schema<Prefix> {
        return new Schema<Prefix>({
            serverID: String,
            prefix: String
        });
    };

    public async getPrefix(serverID: string): Promise<string> {
        const prefix = (await this.PrefixModel.findOne({serverID: serverID}))?.prefix;
        return prefix || process.env.PREFIX || "$";
    }

    public async editPrefix(serverID: string, prefix: string): Promise<Prefix> {
        this.PrefixModel.deleteOne({serverID: serverID});
        return (new this.PrefixModel({serverID: serverID, prefix: prefix})).save();
    }
};