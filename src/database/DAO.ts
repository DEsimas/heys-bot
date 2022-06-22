import { Prefixes } from "./Prefixes";
import { UsersBlacklists } from "./UsersBlacklists";
import { ServersBlacklists } from "./ServersBlacklists";
import { createConnection } from "mongoose";

export class DAO {
    public static Prefixes: Prefixes;
    public static ServersBalacklists: ServersBlacklists;
    public static UsersBlacklists: UsersBlacklists;

    public static async connect(uri: string): Promise<void> {
        const connection = createConnection(uri);

        this.Prefixes = new Prefixes(connection);
        this.ServersBalacklists = new ServersBlacklists(connection);
        this.UsersBlacklists = new UsersBlacklists(connection);
    }
};