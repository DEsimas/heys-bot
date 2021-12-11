import { ICommandHandler, IPayload } from "discordjs-commands-parser";

export class Help implements ICommandHandler {
    execute(): void {
        console.log("help");
    }
};