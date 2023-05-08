"use strict";
const { ChannelType } = require("discord.js");
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === "function" &&
				(g[Symbol.iterator] = function () {
					return this;
				}),
			g
		);
		function verb(n) {
			return function (v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while (_)
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y["return"]
									: op[0]
									? y["throw"] || ((t = y["return"]) && t.call(y), 0)
									: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVoiceStateUpdate = void 0;
var handleVoiceStateUpdate = function (manager, oldState, newState) {
	return __awaiter(void 0, void 0, void 0, function () {
		var voiceChannelLeft,
			voiceChannelMoved,
			voiceChannelJoined,
			parentChannel_1,
			childToDelete_1,
			parentChannel,
			count,
			newChannelName,
			channel;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					voiceChannelLeft = !!oldState.channelId && !newState.channelId;
					voiceChannelMoved =
						!!oldState.channelId &&
						!!newState.channelId &&
						oldState.channelId !== newState.channelId;
					voiceChannelJoined = !oldState.channelId && !!newState.channelId;
					// If the member left a channel or moved to a new one
					if (voiceChannelLeft || voiceChannelMoved) {
						parentChannel_1 = manager.channels.find(function (channelData) {
							return channelData.children.some(function (child) {
								return child.channel.id === oldState.channelId;
							});
						});
						// If there is a parent
						if (parentChannel_1) {
							childToDelete_1 = parentChannel_1.children.find(function (child) {
								return child.channel.id === oldState.channelId;
							});
							// If the channel has to be deleted and is empty
							if (
								(parentChannel_1.options.childAutoDeleteIfEmpty &&
									oldState.channel.members.size === 0) ||
								(parentChannel_1.options.childAutoDeleteIfOwnerLeaves &&
									!oldState.channel.members.has(childToDelete_1.owner.id))
							) {
								// Delete it
								childToDelete_1.channel
									.delete()
									.then(function () {
										// Remove the channel from the children
										parentChannel_1.children = parentChannel_1.children.filter(
											function (child) {
												return child.channel.id !== childToDelete_1.channel.id;
											}
										);
										manager.emit(
											"childDelete",
											newState.member,
											childToDelete_1.channel,
											manager.client.channels.cache.get(
												parentChannel_1.channelID
											)
										);
									})
									.catch(function (error) {
										manager.emit(
											"error",
											error.message,
											"Cannot auto delete channel " + childToDelete_1.channel.id
										);
									});
							}
						}
					}
					if (!(voiceChannelJoined || voiceChannelMoved))
						return [3 /*break*/, 2];
					parentChannel = manager.channels.find(function (channelData) {
						return channelData.channelID === newState.channelId;
					});
					if (!parentChannel) return [3 /*break*/, 2];
					count = parentChannel.children.length + 1;
					newChannelName = parentChannel.options.childFormat(
						newState.member,
						count
					);
					return [
						4 /*yield*/,
						newState.guild.channels.create(newChannelName, {
							parent: parentChannel.options.childCategory,
							bitrate: parentChannel.options.childBitrate,
							userLimit: parentChannel.options.childMaxUsers,
							type: ChannelType.GuildVoice,
						}),
					];
				case 1:
					channel = _a.sent();
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
						channel: channel,
					});
					_a.label = 2;
				case 2:
					return [2 /*return*/];
			}
		});
	});
};
exports.handleVoiceStateUpdate = handleVoiceStateUpdate;
