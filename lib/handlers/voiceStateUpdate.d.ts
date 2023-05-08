import { VoiceState } from "discord.js";
import TempChannelsManager from "../index";
export declare const handleVoiceStateUpdate: (manager: TempChannelsManager, oldState: VoiceState, newState: VoiceState) => Promise<void>;
