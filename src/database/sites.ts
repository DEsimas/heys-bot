export const sitesArray = [
    'e621',         'e926',
    'hypnohub',     'danbooru',
    'konachanCOM',  'konachanNET',
    'yandere',      'gelbooru',
    'rule34',       'safebooru',
    'tbib',         'xbooru',
    'paheal',       'derpibooru',
    'realbooru',    'nhentai'
] as const;

export type Sites = typeof sitesArray[number];

export const sites: Record<Sites, string[]> = {
    "e621": ["e621.net", "e6","e621"],
    "e926": ["e926.net", "e9","e926"],
    "hypnohub": ["hypnohub.net", "hh","hypno","hypnohub"],
    "danbooru": ["danbooru.donmai.us", "db","dan",'danbooru'],
    "konachanCOM": ["konachan.com", "kc","konac","kcom"],
    "konachanNET": ["konachan.net", "kn","konan","knet"],
    "yandere": ["yande.re", "yd","yand","yandere"],
    "gelbooru": ["gelbooru.com", "gb","gel",'gelbooru'],
    "rule34": ["rule34.xxx", "r34","rule34"],
    "safebooru": ["safebooru.org", "sb","safe","safebooru"],
    "tbib": ["tbib.org", "tb","tbib","big"],
    "xbooru": ["xbooru.com", "xb","xbooru"],
    "paheal": ["rule34.paheal.net", "pa","paheal"],
    "derpibooru": ["derpibooru.org", "dp","derp","derpi","derpibooru"],
    "realbooru": ["realbooru.com", "rb","realbooru"],
    "nhentai": ["nhentai.net", "nhentai", "nh"]
};