import { Snowflake } from "discord.js";
import { ChildChannelData, ParentChannelOptions } from "./";
export interface ParentChannelData {
    channelID: Snowflake;
    options: ParentChannelOptions;
    children: ChildChannelData[];
}
