import { Payload } from "discordjs-commands-parser";
import { DAO } from "./../../database/DAO";
import { Sites } from "./../../database/sites";
import { command } from "./../Command"
import { BlacklistManager } from "./BlacklistManager";

export class UserBlacklist extends command {
    private readonly manager: BlacklistManager;
    private readonly command: string;
    private readonly tags: string[];

    constructor(payload: Payload) {
        super(payload);
        this.manager = new BlacklistManager(this.message, DAO.UsersBlacklists);
        this.command = this.args[1];
        this.tags = [ ...this.args];
        this.tags.splice(0, 3);
    }

    public execute(): void {
        switch(this.command?.toLowerCase()) {
            case "add":
                const site = this.getSrc(this.args[2]);
                if(site === null || this.tags.length === 0) return this.sendError(`Check **${this.prefix}help blacklist** for command syntaxis`);
                this.manager.add(this.message.author.id, site, this.tags);
            break;
            case "remove":
                const origin = this.getSrc(this.args[2]);
                if(origin === null || this.tags.length === 0) return this.sendError(`Check **${this.prefix}help blacklist** for command syntaxis`);
                this.manager.remove(this.message.author.id, origin, this.tags);
            break;
            default:
                this.manager.show(this.message.author.id, this.getSrc(this.args[1]) || undefined);
            break;
        }
    }
}