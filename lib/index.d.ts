/// <reference types="node" />
import { Client, Snowflake } from "discord.js";
import { EventEmitter } from "events";
import { ParentChannelData, ParentChannelOptions } from "./types";
declare class TempChannelsManager extends EventEmitter {
    client: Client;
    channels: ParentChannelData[];
    constructor(client: Client);
    registerChannel(channelID: Snowflake, options?: ParentChannelOptions): void;
    unregisterChannel(channelID: Snowflake): boolean;
}
export = TempChannelsManager;
