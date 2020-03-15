import { Client, VoiceChannel, Snowflake } from "discord.js";
import { EventEmitter } from "events";

import { ParentChannelData, ParentChannelOptions } from "./types";

import { handleChannelDelete, handleVoiceStateUpdate } from "./handlers";

class TempChannelsManager extends EventEmitter {
    public client: Client;
    public channels: ParentChannelData[];

    constructor(client: Client) {
        super();
        this.channels = [];
        this.client = client;

        this.client.on("voiceStateUpdate", async (oldState, newState) => {
            handleVoiceStateUpdate(this, oldState, newState);
        });

        this.client.on("channelDelete", channel => {
            handleChannelDelete(this, channel as VoiceChannel);
        });
    }

    registerChannel(
        channelID: Snowflake,
        options: ParentChannelOptions = {
            childCategory: null,
            childAutoDelete: true,
            childAutoDeleteIfOwnerLeaves: true,
            childFormat: (member, count) => `#${count} | ${member}'s lounge`,
            childMaxUsers: null
        }
    ) {
        const channelData: ParentChannelData = {
            channelID,
            options,
            children: []
        };
        this.channels.push(channelData);
        this.emit("channelRegister", channelData);
    }

    unregisterChannel(channelID: Snowflake) {
        const channel = this.channels.find(
            channelData => channelData.channelID === channelID
        );
        this.channels = this.channels.filter(
            channelData => channelData.channelID !== channelID
        );
        return this.emit("channelUnregister", channel);
    }
}

export = TempChannelsManager;
