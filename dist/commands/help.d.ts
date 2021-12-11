import { ICommandHandler, IPayload } from "discordjs-commands-parser";
export declare class Help implements ICommandHandler {
    private message;
    constructor(payload: IPayload);
    execute(): void;
}
