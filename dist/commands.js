"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const Get_1 = require("./commands/Get");
const help_1 = require("./commands/help");
exports.commands = [
    {
        name: ["help", "h", "guide", "?"],
        out: help_1.Help,
        multicase: true
    },
    {
        name: ["get", ""],
        out: Get_1.Get,
        multicase: true
    }
];
//# sourceMappingURL=commands.js.map