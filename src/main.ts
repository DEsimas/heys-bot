import { config } from "dotenv";
import { Bot } from "./Bot";

config();

if(process.env.MODE == "BOT") {   
    if(!process.env.TOKEN) throw new Error("Token not found");
    if(!process.env.MONGO) throw new Error("Mongo uri not found");
    
    const bot = new Bot({token: process.env.TOKEN, mongo_uri: process.env.MONGO});
    bot.start();
}