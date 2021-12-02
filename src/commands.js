import help from "./commands/help.js";
import nhentai from "./commands/nhentai.js";
import rule34 from "./commands/rule.34.js";

export default [
    {
        name: ["help", "h"],
        out: help
    },
    {
        name: ["nhentai", "gethentai", "getdoujin"],
        out: nhentai
    },
    {
        name: ["rule34", "r34"],
        out: rule34
    }
];