import { ICommandHandler, IPayload } from "discordjs-commands-parser";

export class Help implements ICommandHandler {
    execute(payload: IPayload) {
        console.log("help");
    }
};