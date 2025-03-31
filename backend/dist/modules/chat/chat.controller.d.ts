import { ChatService } from './chat.service';
interface CreateChannelDto {
    otherUserId: string;
    courseId?: string;
    subject?: string;
}
interface SendMessageDto {
    message: string;
    userId: string;
}
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createStudentInstructorChannel(data: CreateChannelDto, userId: string): Promise<any>;
    createPeerChannel(data: CreateChannelDto, userId: string): Promise<any>;
    sendMessage(channelUrl: string, data: SendMessageDto): Promise<any>;
    getChannelMessages(channelUrl: string, timestamp?: string): Promise<any>;
    getStudentInstructorChannels(userId: string): Promise<any>;
    getPeerChannels(userId: string): Promise<any>;
}
export {};
