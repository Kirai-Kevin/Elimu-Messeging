import { ConfigService } from '@nestjs/config';
type ChannelType = 'student_instructor' | 'student_student' | 'instructor_instructor';
export declare class ChatService {
    private configService;
    private readonly sendbirdApi;
    private readonly apiToken;
    constructor(configService: ConfigService);
    private getUserType;
    private getChannelType;
    createChannel(userId: string, otherUserId: string, metadata?: {
        courseId?: string;
        subject?: string;
    }): Promise<any>;
    sendMessage(channelUrl: string, message: string, userId: string): Promise<any>;
    getChannelMessages(channelUrl: string, messageTimestamp?: number): Promise<any>;
    getUserChannels(userId: string, channelType?: ChannelType): Promise<any>;
    getStudentInstructorChannels(userId: string): Promise<any>;
    getPeerChannels(userId: string): Promise<any>;
}
export {};
