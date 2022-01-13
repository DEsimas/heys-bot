import { ICommand } from "discordjs-commands-parser";
import { Get } from "./commands/Get/Get";
import { Help } from "./commands/Help/Help";
import { SetPrefix } from "./commands/SetPrefix/SetPrefix";

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
    },
    {
        name: ["setprefix", "changeprefix"],
        out: SetPrefix,
        multicase: true
    }
];