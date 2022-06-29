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
}