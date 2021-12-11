import { ICommandHandler, IPayload } from "discordjs-commands-parser";

export class Get implements ICommandHandler {
    execute(payload: IPayload) {
        console.log("get");
    }
};