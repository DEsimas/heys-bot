import { Prefixes } from "./Prefixes";
import { UsersBlacklists } from "./UsersBlacklists";
import { ServersBlacklists } from "./ServersBlacklists";
import { Connection, createConnection } from "mongoose";

export class DAO {
    public static Prefixes: Prefixes;
    public static ServersBalacklists: ServersBlacklists;
    public static UsersBlacklists: UsersBlacklists;

    public static async connect(uri: string): Promise<void> {
        const connection = createConnection(uri);
    }
};