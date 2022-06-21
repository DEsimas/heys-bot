import { connect } from "mongoose";
import { Prefixes } from "./Prefixes";
import { ServersBlacklists } from "./ServersBlacklists";
import { UsersBlacklists } from "./UsersBlacklists";

export class DAO {
    public static readonly Prefixes = new Prefixes();
    public static readonly ServersBalacklists = new ServersBlacklists();
    public static readonly UsersBlacklists = new UsersBlacklists();

    public static async connect(uri: string): Promise<void> {
        connect(uri, error => {
            if (error) {
                throw new Error("Failed to connect to Mongo");
            }
            console.log("Database connected successfully"); 
        });
    }
};