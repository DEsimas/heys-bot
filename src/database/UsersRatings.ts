import { Connection, Model, Schema } from "mongoose";

export interface UserRating {
    userID: string;
    likedPosts: Array<string>;
    dislikedPosts: Array<string>;
}

export class UsersRatings {
    private readonly UsersRatingsModel: Model<UserRating>;

    constructor(connection: Connection) {
        this.UsersRatingsModel = connection.model<UserRating>("usersRatings", this.getUserRatingSchema());
    }

    private getUserRatingSchema(): Schema<UserRating> {
        return new Schema<UserRating>({
            userID: String,
            likedPosts: [String],
            dislikedPosts: [String]
        });
    }
}