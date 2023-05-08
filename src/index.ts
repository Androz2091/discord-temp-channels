import {
    Client,
    VoiceChannel,
    Snowflake,
    GatewayIntentBits,
    IntentsBitField,
} from "discord.js";
import { EventEmitter } from "events";

import { ParentChannelData, ParentChannelOptions } from "./types";

import { handleChannelDelete, handleVoiceStateUpdate } from "./handlers";

class TempChannelsManager extends EventEmitter {
    public client: Client;
    public channels: ParentChannelData[];

    constructor(client: Client) {
        super();

        if (
            !new IntentsBitField(client.options.intents).has(
                GatewayIntentBits.GuildVoiceStates
            )
        ) {
            throw new Error(
                "GuildVoiceStates intent is required to use this package!"
            );
        }

        this.channels = [];
        this.client = client;

        this.client.on("voiceStateUpdate", async (oldState, newState) => {
            handleVoiceStateUpdate(this, oldState, newState);
        });

        this.client.on("channelDelete", (channel) => {
            handleChannelDelete(this, channel as VoiceChannel);
        });
    }

    registerChannel(
        channelID: Snowflake,
        options: ParentChannelOptions = {
            childCategory: null,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: true,
            childFormat: (member, count) => `#${count} | ${member}'s lounge`,
            childMaxUsers: null,
        }
    ) {
        const channelData: ParentChannelData = {
            channelID,
            options,
            children: [],
        };
        this.channels.push(channelData);
        this.emit("channelRegister", channelData);
    }

    unregisterChannel(channelID: Snowflake) {
        const channel = this.channels.find(
            (channelData) => channelData.channelID === channelID
        );
        this.channels = this.channels.filter(
            (channelData) => channelData.channelID !== channelID
        );
        return this.emit("channelUnregister", channel);
    }
}

export = TempChannelsManager;