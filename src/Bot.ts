import { Client, Intents, PartialTypes } from "discord.js";
import { CommandsParser } from "discordjs-commands-parser";
import { DAO } from "./database/DAO";
import { getParserOptions } from "./parserOptions";

export class Bot {
    private readonly token: string;
    private readonly mongo_uri: string;
    private readonly client: Client;
    private readonly intents: number[];
    private readonly partials: PartialTypes[];

    constructor(data: {token: string, mongo_uri:string}) {
        this.token = data.token;
        this.mongo_uri = data.mongo_uri;

        this.intents = [
            Intents.FLAGS.GUILDS,                   // interaction with servers
            Intents.FLAGS.GUILD_MESSAGES,           // read messages
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS   // read reactions under messages
        ];

        this.partials = [
            "CHANNEL"
        ];

        this.client = new Client({partials: this.partials, intents: this.intents });
    }

    public start(): void {
        DAO.connect(this.mongo_uri).then(() => {
            this.login();
        });
    }

    private login(): void {
        const handler = new CommandsParser(getParserOptions(this.client));
    
        this.client.on("ready", () => console.log("Bot started!"));
        this.client.on("messageCreate", handler.getEventHandler());
    
        this.client.login(this.token);
    }
}