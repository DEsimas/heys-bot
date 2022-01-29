import { Payload } from "discordjs-commands-parser";
import { DAO } from "../../database/DAO";
import { command } from "./../Command"
import { BlacklistManager } from "./BlacklistManager";

export class ServerBlacklist extends command {
    private readonly manager: BlacklistManager;
    private readonly command: string;
    private readonly tags: string[];

    constructor(payload: Payload) {
        super(payload);
        this.manager = new BlacklistManager(this.message, DAO.ServersBalacklists);
        this.command = this.args[1];
        this.tags = [ ...this.args];
        this.tags.splice(0, 3);
    }

    public async execute(): Promise<void> {
        const serverID = this.message.guild?.id;
        if(serverID === undefined) return;
        switch(this.command?.toLowerCase()) {
            case "add":
                if(!(await this.isAdmin())) return this.sendError("This command is avalible only for admins");
                let site = this.getSrc(this.args[2]);
                if(site === null) {
                    site = "global";
                    this.tags.push(this.args[2]);
                }
                if(this.tags.length === 0) return this.sendError(`Check **${this.prefix}help blacklist** for command syntaxis`);
                this.manager.add(serverID, site, this.tags);
            break;
            case "remove":
                if(!(await this.isAdmin())) return this.sendError("This command is avalible only for admins");
                let origin = this.getSrc(this.args[2]);
                if(origin === null) {
                    origin = "global";
                    this.tags.push(this.args[2]);
                }
                if(this.tags.length === 0) return this.sendError(`Check **${this.prefix}help blacklist** for command syntaxis`);
                this.manager.remove(serverID, origin, this.tags);
            break;
            default:
                this.manager.show(serverID, this.getSrc(this.args[1]) || undefined);
            break;
        }
    }
}