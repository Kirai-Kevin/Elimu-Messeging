import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../modules/chat/chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    private userSockets;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(client: Socket, userId: string): {
        event: string;
        userId: string;
    };
    handleMessage(client: Socket, payload: {
        channelUrl: string;
        message: string;
        userId: string;
    }): Promise<{
        success: boolean;
        message: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    handleJoinChannel(client: Socket, channelUrl: string): {
        event: string;
        channelUrl: string;
    };
    handleLeaveChannel(client: Socket, channelUrl: string): {
        event: string;
        channelUrl: string;
    };
    sendNotification(userId: string, notification: any): Promise<void>;
}
