"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChannelDelete = void 0;
var handleChannelDelete = function (manager, channel) {
    // Check if the channel is a parent or a child
    var parentChannel = manager.channels.find(function (channelData) { return channelData.channelID === channel.id; });
    if (parentChannel) {
        // Remove the parent channel
        manager.channels = manager.channels.filter(function (channelData) { return channelData.channelID !== channel.id; });
        return manager.emit("channelUnregister", parentChannel);
    }
    var parentChildChannel = manager.channels.find(function (channelData) {
        return channelData.children.some(function (child) { return child.channel.id === channel.id; });
    });
    if (parentChildChannel) {
        // Remove the child from children
        parentChildChannel.children = parentChildChannel.children.filter(function (child) { return child.channel.id !== channel.id; });
    }
};
exports.handleChannelDelete = handleChannelDelete;
