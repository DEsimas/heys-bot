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

    public async GetRating(userID: string): Promise<UserRating> {
        const rating = await this.UsersRatingsModel.findOne({ userID: userID });
        if(rating) return rating;
        return await (new this.UsersRatingsModel({
            userID: userID,
            likedPosts: [],
            dislikedPosts: []
        })).save();
    }
}