import { connect } from "mongoose";
import { Doujins } from "./Doujins";
import { Prefixes } from "./Prefixes";

export class DAO {
    public static readonly Prefixes = new Prefixes();
    public static readonly Doujins = new Doujins();

    public static async connect(): Promise<void> {
        if(!process.env.MONGO) throw new Error("Mongo uri not found");

        connect(process.env.MONGO, error => {
            if (error) {
                throw new Error("Failed to connect to Mongo");
            }
            console.log("Database connected successfully");            
        });
    }
};