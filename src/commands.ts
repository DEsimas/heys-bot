import { ICommand } from "discordjs-commands-parser";
import { Get } from "./commands/Get";
import { Help } from "./commands/help";

export const commands: Array<ICommand> = [
    {
        name: ["help"],
        out: new Help(),
        multicase: true
    },
    {
        name: ["get", ""],
        out: new Get(),
        multicase: true
    }
];