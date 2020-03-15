import { GuildMember, Snowflake } from "discord.js";

export interface ParentChannelOptions {
    childAutoDelete: boolean;
    childAutoDeleteIfOwnerLeaves: boolean;
    childFormat(member: GuildMember, count: number): string;
    childMaxUsers?: number;
    childBitrate?: number;
    childCategory?: Snowflake;
}
