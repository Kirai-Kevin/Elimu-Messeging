"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let ChatService = class ChatService {
    constructor(configService) {
        this.configService = configService;
        const appId = this.configService.get('SENDBIRD_APP_ID');
        this.apiToken = this.configService.get('SENDBIRD_API_TOKEN');
        this.sendbirdApi = `https://api-${appId}.sendbird.com/v3`;
    }
    getUserType(userId) {
        return userId.startsWith('Student_') ? 'student' : 'instructor';
    }
    getChannelType(userType, otherUserType) {
        if (userType === otherUserType) {
            return `${userType}_${userType}`;
        }
        return 'student_instructor';
    }
    async createChannel(userId, otherUserId, metadata) {
        try {
            const userType = this.getUserType(userId);
            const otherUserType = this.getUserType(otherUserId);
            const channelType = this.getChannelType(userType, otherUserType);
            const channelMetadata = {
                channelType,
                ...metadata
            };
            const response = await axios_1.default.post(`${this.sendbirdApi}/group_channels`, {
                user_ids: [userId, otherUserId],
                is_distinct: true,
                operator_ids: [userType === 'instructor' ? userId : otherUserId],
                name: `${channelType}_chat`,
                channel_url: `${userId}_${otherUserId}_${Date.now()}`,
                metadata: channelMetadata,
            }, {
                headers: {
                    'Api-Token': this.apiToken,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to create channel: ${error.message}`);
        }
    }
    async sendMessage(channelUrl, message, userId) {
        try {
            const response = await axios_1.default.post(`${this.sendbirdApi}/group_channels/${channelUrl}/messages`, {
                message_type: 'MESG',
                user_id: userId,
                message,
            }, {
                headers: {
                    'Api-Token': this.apiToken,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to send message: ${error.message}`);
        }
    }
    async getChannelMessages(channelUrl, messageTimestamp) {
        try {
            const response = await axios_1.default.get(`${this.sendbirdApi}/group_channels/${channelUrl}/messages`, {
                params: {
                    message_ts: messageTimestamp,
                    include_metadata: true,
                },
                headers: {
                    'Api-Token': this.apiToken,
                },
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get channel messages: ${error.message}`);
        }
    }
    async getUserChannels(userId, channelType) {
        try {
            const params = {
                include_metadata: true,
            };
            if (channelType) {
                params.metadata_key = 'channelType';
                params.metadata_values = channelType;
            }
            const response = await axios_1.default.get(`${this.sendbirdApi}/users/${userId}/my_group_channels`, {
                params,
                headers: {
                    'Api-Token': this.apiToken,
                },
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get user channels: ${error.message}`);
        }
    }
    async getStudentInstructorChannels(userId) {
        return this.getUserChannels(userId, 'student_instructor');
    }
    async getPeerChannels(userId) {
        const userType = this.getUserType(userId);
        return this.getUserChannels(userId, `${userType}_${userType}`);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChatService);
//# sourceMappingURL=chat.service.js.map