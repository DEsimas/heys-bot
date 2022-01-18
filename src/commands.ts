import { Command } from "discordjs-commands-parser";
import { Get } from "./commands/Get/Get";
import { UserBlacklist } from "./commands/UserBlacklist/UserBlacklist";
import { Help } from "./commands/Help/Help";
import { SetPrefix } from "./commands/SetPrefix/SetPrefix";
import { ServerBlacklist } from "./commands/ServerBlacklist/ServerBlacklist";

export const commands: Array<Command> = [
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
    },
    {
        name: ["userbalcklist", "blacklist", "tags"],
        out: UserBlacklist,
        multicase: true
    },
    {
        name: ["serverblacklist", "servertags"],
        out: ServerBlacklist,
        multicase: true
    }
];