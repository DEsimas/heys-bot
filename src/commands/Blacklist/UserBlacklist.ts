import { Payload } from "discordjs-commands-parser";
import { command } from "./../Command"

export class UserBlacklist extends command {
    constructor(payload: Payload) {
        super(payload);
    }

    public execute(): void {
        
    }
}