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
        name: ["gethentai", "get", "hentai"],
        description: "fetch pictures from huge amount of interesting sites. State { nhentai, e621, e926, hypnohub, danbooru, konac, konan, yandere, gelbooru, rule34, safebooru, tbib, xbooru, paheal, derpibooru, realbooru } and tags for filtering",
        out: gethentai
    }
];