import { Connection } from "mongoose";
import { PostRating, PostsRatings } from "./PostsRatings";
import { UserRating, UsersRatings } from "./UsersRatings";

export class Rating {
    private readonly UsersRatings: UsersRatings;
    private readonly PostsRatings: PostsRatings;

    constructor(connection: Connection){
        this.UsersRatings = new UsersRatings(connection);
        this.PostsRatings = new PostsRatings(connection);
    }

    public GetPostRating(postURL: string): Promise<PostRating> {
        return this.PostsRatings.GetRating(postURL);
    }

    public GetUserRating(userID: string): Promise<UserRating> {
        return this.UsersRatings.GetRating(userID);
    }

    public async AddLike(userID: string, postURL: string) {
        return {
            post: await this.PostsRatings.AddLike(postURL),
            user: await this.UsersRatings.AddLike(userID, postURL)
        }
    }

    public async AddDislike(userID: string, postURL: string) {
        return {
            post: await this.PostsRatings.AddDislike(postURL),
            user: await this.UsersRatings.AddDislike(userID, postURL)
        }
    }

    public async RemoveLike(userID: string, postURL: string) {
        return {
            post: await this.PostsRatings.RemoveLike(postURL),
            user: await this.UsersRatings.RemoveLike(userID, postURL)
        }
    }

    public async RemoveDislike(userID: string, postURL: string) {
        return {
            post: await this.PostsRatings.RemoveDislike(postURL),
            user: await this.UsersRatings.RemoveDislike(userID, postURL)
        }
    }
}