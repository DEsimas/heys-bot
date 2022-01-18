import { connect } from "mongoose";

export class DAO {
    public static async connect(): Promise<void> {
        if(!process.env.MONGO) throw new Error("Mongo uri not found");

        connect(process.env.MONGO, error => {
            if (error) {
                throw new Error("Failed to connect to Mongo");
            }
            console.log("Database connected successfully");     
        });
    }
};