import { Connection, Model, Schema } from "mongoose";

export interface PostRating {
    postURL: string;
    likes: number;
    dislikes: number;
}

export class PostsRatings {
    private readonly PostsRatingModel: Model<PostRating>;

    constructor(connection: Connection) {
        this.PostsRatingModel = connection.model<PostRating>("postsRaitings", this.getPostRatingSchema());
    }

    private getPostRatingSchema(): Schema<PostRating> {
        return new Schema<PostRating>({
            postURL: String,
            likes: Number,
            dislikes: Number
        });
    }

    public async AddLike(postURL: string): Promise<PostRating> {
        const rating = await this.PostsRatingModel.findOne({ postURL: postURL });
        if(rating) {
            await this.PostsRatingModel.updateOne({ postURL: postURL }, { likes: rating.likes+1 });
            return {
                postURL: postURL,
                likes: rating.likes+1,
                dislikes: rating.dislikes
            }
        } else {
            return await (new this.PostsRatingModel({
                postURL: postURL,
                likes: 1,
                dislikes: 0
            })).save();
        }
    }

    public async AddDislike(postURL: string): Promise<PostRating> {
        const rating = await this.PostsRatingModel.findOne({ postURL: postURL });
        if(rating) {
            await this.PostsRatingModel.updateOne({ postURL: postURL }, { dislikes: rating.dislikes+1 });
            return {
                postURL: postURL,
                likes: rating.likes,
                dislikes: rating.dislikes+1
            }
        } else {
            return await (new this.PostsRatingModel({
                postURL: postURL,
                likes: 0,
                dislikes: 1
            })).save();
        }
    }
}