import { ICommand } from "discordjs-commands-parser";
import { Get } from "./commands/Get";
import { Help } from "./commands/Help";

export const commands: Array<ICommand> = [
    {
        name: ["help", "h", "guide", "?"],
        out: Help,
        multicase: true
    },
    {
        name: ["get", ""],
        out: Get,
        multicase: true
    }
];