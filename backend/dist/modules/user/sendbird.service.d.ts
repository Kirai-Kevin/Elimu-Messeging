import { ConfigService } from '@nestjs/config';
import { UserUpdateParams } from '@sendbird/chat';
export declare class SendbirdService {
    private readonly configService;
    private readonly apiToken;
    private readonly appId;
    constructor(configService: ConfigService);
    createSendbirdUser(userId: string, nickname: string, profileUrl?: string): Promise<any>;
    updateSendbirdUser(userId: string, params: Partial<UserUpdateParams>): Promise<any>;
}
