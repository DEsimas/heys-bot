import help from "./commands/help.js";
import nhentai from "./commands/nhentai.js";
import rule34 from "./commands/rule.34.js";

export default [
    {
        name: ["help", "h"],
        description: "shows this message",
        out: help
    },
    {
        name: ["nhentai", "gethentai", "getdoujin"],
        description: "fetch doujin from nhentai.net using its code, you can also pass \"random\" to get random doujin",
        out: nhentai
    },
    {
        name: ["rule34", "r34"],
        description: "fetch pictures from rule34.xxx using tags",
        out: rule34
    }
];