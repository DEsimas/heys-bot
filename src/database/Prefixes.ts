import { Connection, Model, Schema } from "mongoose";

export interface Prefix {
    serverID: string;
    prefix: string;
};

export class Prefixes {
    private readonly PrefixModel: Model<Prefix>;

    constructor(connection: Connection) {
        this.PrefixModel = connection.model<Prefix>("prefixes", this.getPrefixSchema());
    }

    private getPrefixSchema(): Schema<Prefix> {
        return new Schema<Prefix>({
            serverID: String,
            prefix: String
        });
    };

    public async getPrefix(serverID: string): Promise<string> {
        const prefix = (await this.PrefixModel.findOne({serverID: serverID}))?.prefix;
        return prefix || "$";
    }

    public async editPrefix(serverID: string, prefix: string): Promise<Prefix> {
        await this.PrefixModel.deleteOne({serverID: serverID});
        return (new this.PrefixModel({serverID: serverID, prefix: prefix})).save();
    }
};