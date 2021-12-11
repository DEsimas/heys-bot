import { ICommandHandler, IPayload } from "discordjs-commands-parser";
export declare class Get implements ICommandHandler {
    private message;
    private source;
    private tags;
    private amount;
    private args;
    private readonly errorColour;
    private readonly maxAmount;
    private readonly nhentaiAllias;
    constructor(payload: IPayload);
    private sendError;
    private validateRequest;
    private isSourceNhentai;
    execute(): void;
}
