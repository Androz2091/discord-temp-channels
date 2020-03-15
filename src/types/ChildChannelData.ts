import { GuildMember, VoiceChannel } from "discord.js";

export interface ChildChannelData {
    owner: GuildMember;
    channel: VoiceChannel;
}
