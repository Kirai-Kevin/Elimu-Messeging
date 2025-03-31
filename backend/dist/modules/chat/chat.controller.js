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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async createStudentInstructorChannel(data, userId) {
        try {
            if (!userId || !data.otherUserId) {
                throw new common_1.HttpException('Missing required user IDs', common_1.HttpStatus.BAD_REQUEST);
            }
            const channel = await this.chatService.createChannel(userId, data.otherUserId, {
                courseId: data.courseId,
                subject: data.subject,
            });
            return channel;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to create channel', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createPeerChannel(data, userId) {
        try {
            if (!userId || !data.otherUserId) {
                throw new common_1.HttpException('Missing required user IDs', common_1.HttpStatus.BAD_REQUEST);
            }
            const channel = await this.chatService.createChannel(userId, data.otherUserId);
            return channel;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to create channel', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendMessage(channelUrl, data) {
        try {
            if (!channelUrl || !data.message || !data.userId) {
                throw new common_1.HttpException('Missing required fields', common_1.HttpStatus.BAD_REQUEST);
            }
            const message = await this.chatService.sendMessage(channelUrl, data.message, data.userId);
            return message;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to send message', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getChannelMessages(channelUrl, timestamp) {
        try {
            if (!channelUrl) {
                throw new common_1.HttpException('Channel URL is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const messages = await this.chatService.getChannelMessages(channelUrl, timestamp ? parseInt(timestamp) : undefined);
            return messages;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get messages', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getStudentInstructorChannels(userId) {
        try {
            if (!userId) {
                throw new common_1.HttpException('User ID is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const channels = await this.chatService.getStudentInstructorChannels(userId);
            return channels;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get channels', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPeerChannels(userId) {
        try {
            if (!userId) {
                throw new common_1.HttpException('User ID is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const channels = await this.chatService.getPeerChannels(userId);
            return channels;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get channels', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('channels/student-instructor'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createStudentInstructorChannel", null);
__decorate([
    (0, common_1.Post)('channels/peer'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createPeerChannel", null);
__decorate([
    (0, common_1.Post)('channels/:channelUrl/messages'),
    __param(0, (0, common_1.Param)('channelUrl')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('channels/:channelUrl/messages'),
    __param(0, (0, common_1.Param)('channelUrl')),
    __param(1, (0, common_1.Query)('timestamp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChannelMessages", null);
__decorate([
    (0, common_1.Get)('users/:userId/channels/student-instructor'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getStudentInstructorChannels", null);
__decorate([
    (0, common_1.Get)('users/:userId/channels/peer'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getPeerChannels", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map