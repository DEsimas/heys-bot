import { Payload } from "discordjs-commands-parser";
import { command } from "./../Command"

export class ServerBlacklist extends command {
    constructor(payload: Payload) {
        super(payload);
    }

    public execute(): void {
        
    }
}