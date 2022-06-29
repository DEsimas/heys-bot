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

    public async AddLike(userID: string, postURL: string): Promise<UserRating> {
        const rating = await this.UsersRatingsModel.findOne({ userID: userID });
        if(rating) {
            if(!rating.likedPosts.includes(postURL)) {
                let likedPosts = rating.likedPosts;
                likedPosts.push(postURL);
                await this.UsersRatingsModel.updateOne({ userID: userID }, { likedPosts: likedPosts });
                return {
                    userID: userID,
                    likedPosts: likedPosts,
                    dislikedPosts: rating.dislikedPosts
                }
            }
            return rating;
        }
        else return await (new this.UsersRatingsModel({
            userID: userID,
            likedPosts: [],
            dislikedPosts: []
        }));
    }

    public async AddDislike(userID: string, postURL: string): Promise<UserRating> {
        const rating = await this.UsersRatingsModel.findOne({ userID: userID });
        if(rating) {
            if(!rating.dislikedPosts.includes(postURL)) {
                let dislikedPosts = rating.dislikedPosts;
                dislikedPosts.push(postURL);
                await this.UsersRatingsModel.updateOne({ userID: userID }, { dislikedPosts: dislikedPosts });
                return {
                    userID: userID,
                    likedPosts: rating.likedPosts,
                    dislikedPosts: dislikedPosts
                }
            }
            return rating;
        }
        else return await (new this.UsersRatingsModel({
            userID: userID,
            likedPosts: [],
            dislikedPosts: []
        }));
    }

    public async RemoveLike(userID: string, postURL: string): Promise<UserRating> {
        const rating = await this.UsersRatingsModel.findOne({ userID: userID });
        if(rating) {
            if(rating.likedPosts.includes(postURL)) {
                let likedPosts = rating.likedPosts.filter(val => (val != postURL));
                await this.UsersRatingsModel.updateOne({ userID: userID }, { likedPosts: likedPosts });
                return {
                    userID: userID,
                    likedPosts: likedPosts,
                    dislikedPosts: rating.dislikedPosts
                }
            }
            return rating;
        }
        else return await (new this.UsersRatingsModel({
            userID: userID,
            likedPosts: [],
            dislikedPosts: []
        }));
    }

    public async RemoveDislike(userID: string, postURL: string): Promise<UserRating> {
        const rating = await this.UsersRatingsModel.findOne({ userID: userID });
        if(rating) {
            if(rating.dislikedPosts.includes(postURL)) {
                let dislikedPosts = rating.dislikedPosts.filter(val => (val != postURL));
                await this.UsersRatingsModel.updateOne({ userID: userID }, { dislikedPosts: dislikedPosts });
                return {
                    userID: userID,
                    likedPosts: rating.likedPosts,
                    dislikedPosts: dislikedPosts
                }
            }
            return rating;
        }
        else return await (new this.UsersRatingsModel({
            userID: userID,
            likedPosts: [],
            dislikedPosts: []
        }));
    }
}