import { ChannelType, VoiceChannel, VoiceState } from "discord.js";
import TempChannelsManager from "../index";

export const handleVoiceStateUpdate = async (
    manager: TempChannelsManager,
    oldState: VoiceState,
    newState: VoiceState
) => {
    const voiceChannelLeft: boolean =
        !!oldState.channelId && !newState.channelId;
    const voiceChannelMoved: boolean =
        !!oldState.channelId &&
        !!newState.channelId &&
        oldState.channelId !== newState.channelId;
    const voiceChannelJoined: boolean =
        !oldState.channelId && !!newState.channelId;

    // If the member left a channel or moved to a new one
    if (voiceChannelLeft || voiceChannelMoved) {
        // The parent channel of the channel in which the member isn't anymore
        const parentChannel = manager.channels.find((channelData) =>
            channelData.children.some(
                (child) => child.channel.id === oldState.channelId
            )
        );
        // If there is a parent
        if (parentChannel) {
            const childToDelete = parentChannel.children.find(
                (child) => child.channel.id === oldState.channelId
            );
            // If the channel has to be deleted and is empty
            if (
                (parentChannel.options.childAutoDeleteIfEmpty &&
                    oldState.channel.members.size === 0) ||
                (parentChannel.options.childAutoDeleteIfOwnerLeaves &&
                    !oldState.channel.members.has(childToDelete.owner.id))
            ) {
                // Delete it
                childToDelete.channel
                    .delete()
                    .then(() => {
                        // Remove the channel from the children
                        parentChannel.children = parentChannel.children.filter(
                            (child) =>
                                child.channel.id !== childToDelete.channel.id
                        );
                        manager.emit(
                            "childDelete",
                            newState.member,
                            childToDelete.channel,
                            manager.client.channels.cache.get(
                                parentChannel.channelID
                            )
                        );
                    })
                    .catch((error) => {
                        manager.emit(
                            "error",
                            error.message,
                            "Cannot auto delete channel " +
                                childToDelete.channel.id
                        );
                    });
            }
        }
    }

    // If the member joined a voice channel or moved to a new one
    if (voiceChannelJoined || voiceChannelMoved) {
        // Check if the member is in a parent channel
        const parentChannel = manager.channels.find(
            (channelData) => channelData.channelID === newState.channelId
        );
        // If the member is in a parent channel
        if (parentChannel) {
            // Create a child channel
            const count = parentChannel.children.length + 1;
            const newChannelName = parentChannel.options.childFormat(
                newState.member,
                count
            );
            const channel = await newState.guild.channels.create({
                name: newChannelName,
                parent: parentChannel.options.childCategory,
                bitrate: parentChannel.options.childBitrate,
                userLimit: parentChannel.options.childMaxUsers,
                type: ChannelType.GuildVoice,
            });
            manager.emit(
                "childCreate",
                newState.member,
                channel,
                manager.client.channels.cache.get(parentChannel.channelID)
            );
            // Move the member in the new channel
            newState.setChannel(channel);
            // Add the child
            parentChannel.children.push({
                owner: newState.member,
                channel,
            });
        }
    }
};