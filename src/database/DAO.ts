import { Rating } from "./Rating";
import { Prefixes } from "./Prefixes";
import { UsersBlacklists } from "./UsersBlacklists";
import { ServersBlacklists } from "./ServersBlacklists";

import { createConnection } from "mongoose";

export class DAO {
    public static Rating: Rating;
    public static Prefixes: Prefixes;
    public static UsersBlacklists: UsersBlacklists;
    public static ServersBalacklists: ServersBlacklists;

    public static async connect(uri: string): Promise<void> {
        const connection = createConnection(uri);

        this.Rating = new Rating(connection);
        this.Prefixes = new Prefixes(connection);
        this.UsersBlacklists = new UsersBlacklists(connection);
        this.ServersBalacklists = new ServersBlacklists(connection);
    }
};