import { Doujin } from "nhentai";
import { Sender, SenderOptions } from "./Sender";

export class DoujinSender extends Sender {
    constructor(options: SenderOptions) {
        super(options)
    }

    public async send(): Promise<void> {
        
    }

    private isEnglish(doujin: Doujin): boolean {
        return !doujin.tags.all.every(tag => {
            if (tag.name === "english") return false;
            return true;
        });
    }

    private isProhibited(doujin: Doujin): boolean {
        return !doujin.tags.all.every(tag => {
            if(this.blacklist.global.includes(tag.name)) return false;
            if(this.blacklist.sites.nhentai.includes(tag.name)) return false;
            return true;
        });
    }
}