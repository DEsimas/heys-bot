import { model, Model, Schema } from "mongoose";

export interface Doujin {
    messageID: string;
    requesterID: string;
    pages: string[];
    page: number;
};

export class Doujins {
    private readonly DoujinModel: Model<Doujin>;

    constructor() {
        this.DoujinModel = model<Doujin>("doujins", this.getDoujinSchema());
    }

    private getDoujinSchema(): Schema<Doujin> {
        return new Schema<Doujin>({
            messageID: String,
            requesterID: String,
            pages: [String],
            page: Number
        });
    };

    public async addDoujin(doujin: Doujin): Promise<Doujin> {
        return (new this.DoujinModel(doujin)).save();
    }

    public async delDoujin(messageID: string): Promise<void> {
        await this.DoujinModel.deleteOne({messageID: messageID});
    }

    public async goNext(messageID: string): Promise<void> {
        const doujin = await this.DoujinModel.findOne({messageID: messageID});
        if(!doujin) return;
        let newPage = doujin.page+1;
        if(newPage >= doujin.pages.length) newPage--;
        await this.DoujinModel.updateOne({messageID: messageID}, { page: newPage });
    }

    public async goPrev(messageID: string): Promise<void> {
        const doujin = await this.DoujinModel.findOne({messageID: messageID});
        if(!doujin) return;
        let newPage = doujin.page-1;
        if(newPage < 0) newPage++;
        await this.DoujinModel.updateOne({messageID: messageID}, { page: newPage });
    }
};