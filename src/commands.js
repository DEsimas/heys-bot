import help from "./commands/help.js";
import nhentai from "./commands/nhentai.js";
import gethentai from "./commands/gethentai.js";

export default [
    {
        name: ["help", "h"],
        description: "shows this message",
        out: help
    },
    {
        name: ["nhentai", "getdoujin"],
        description: "fetch doujin from nhentai.net using its code, you can also pass \"random\" to get random doujin",
        out: nhentai
    },
    {
        name: ["gethentai", "get"],
        description: "fetch pictures from huge amount of interesting sites. State { e621, e926, hypnohub, danbooru, konac, konan, yandere, gelbooru, rule34, safebooru, tbib, xbooru, paheal, derpibooru, realbooru } and tags for filtering",
        out: gethentai
    }
];