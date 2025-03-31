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
exports.SendbirdService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SendbirdService = class SendbirdService {
    constructor(configService) {
        this.configService = configService;
        this.apiToken = this.configService.get('SENDBIRD_API_TOKEN');
        this.appId = this.configService.get('SENDBIRD_APP_ID');
        if (!this.apiToken || !this.appId) {
            throw new Error('SendBird credentials not configured');
        }
    }
    async createSendbirdUser(userId, nickname, profileUrl) {
        try {
            const response = await fetch(`https://api-${this.appId}.sendbird.com/v3/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Token': this.apiToken,
                },
                body: JSON.stringify({
                    user_id: userId,
                    nickname,
                    profile_url: profileUrl,
                }),
            });
            if (!response.ok) {
                throw new Error(`Failed to create SendBird user: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('Error creating SendBird user:', error);
            throw error;
        }
    }
    async updateSendbirdUser(userId, params) {
        try {
            const response = await fetch(`https://api-${this.appId}.sendbird.com/v3/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Token': this.apiToken,
                },
                body: JSON.stringify(params),
            });
            if (!response.ok) {
                throw new Error(`Failed to update SendBird user: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('Error updating SendBird user:', error);
            throw error;
        }
    }
};
exports.SendbirdService = SendbirdService;
exports.SendbirdService = SendbirdService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SendbirdService);
//# sourceMappingURL=sendbird.service.js.map