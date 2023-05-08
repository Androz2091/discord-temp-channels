"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var events_1 = require("events");
var handlers_1 = require("./handlers");
var TempChannelsManager = /** @class */ (function (_super) {
    __extends(TempChannelsManager, _super);
    function TempChannelsManager(client) {
        var _this = _super.call(this) || this;
        _this.channels = [];
        _this.client = client;
        _this.client.on("voiceStateUpdate", function (oldState, newState) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, handlers_1.handleVoiceStateUpdate)(this, oldState, newState);
                return [2 /*return*/];
            });
        }); });
        _this.client.on("channelDelete", function (channel) {
            (0, handlers_1.handleChannelDelete)(_this, channel);
        });
        return _this;
    }
    TempChannelsManager.prototype.registerChannel = function (channelID, options) {
        if (options === void 0) { options = {
            childCategory: null,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: true,
            childFormat: function (member, count) { return "#".concat(count, " | ").concat(member, "'s lounge"); },
            childMaxUsers: null
        }; }
        var channelData = {
            channelID: channelID,
            options: options,
            children: []
        };
        this.channels.push(channelData);
        this.emit("channelRegister", channelData);
    };
    TempChannelsManager.prototype.unregisterChannel = function (channelID) {
        var channel = this.channels.find(function (channelData) { return channelData.channelID === channelID; });
        this.channels = this.channels.filter(function (channelData) { return channelData.channelID !== channelID; });
        return this.emit("channelUnregister", channel);
    };
    return TempChannelsManager;
}(events_1.EventEmitter));
module.exports = TempChannelsManager;
