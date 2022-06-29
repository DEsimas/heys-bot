import { Prefixes } from "./Prefixes";
import { PostsRatings } from "./PostsRatings";
import { UsersRatings } from "./UsersRatings";
import { UsersBlacklists } from "./UsersBlacklists";
import { ServersBlacklists } from "./ServersBlacklists";

import { createConnection } from "mongoose";

export class DAO {
    public static Prefixes: Prefixes;
    public static PostsRatings: PostsRatings;
    public static UsersRatings: UsersRatings;
    public static UsersBlacklists: UsersBlacklists;
    public static ServersBalacklists: ServersBlacklists;

    public static async connect(uri: string): Promise<void> {
        const connection = createConnection(uri);

        this.Prefixes = new Prefixes(connection);
        this.PostsRatings = new PostsRatings(connection);
        this.UsersRatings = new UsersRatings(connection);
        this.UsersBlacklists = new UsersBlacklists(connection);
        this.ServersBalacklists = new ServersBlacklists(connection);
    }
};