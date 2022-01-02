import { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";

export class ReactionHandler {
    private readonly reaction: MessageReaction | PartialMessageReaction;
    private readonly user: User | PartialUser;
    
    constructor(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
        this.reaction = reaction;
        this.user = user;
    }

    public async handle() {
        
    }
};