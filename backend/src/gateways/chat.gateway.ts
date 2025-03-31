import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../modules/chat/chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  private userSockets = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove user mapping when they disconnect
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    this.userSockets.set(userId, client.id);
    client.join(`user_${userId}`);
    return { event: 'joined', userId };
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { channelUrl: string; message: string; userId: string }) {
    try {
      const message = await this.chatService.sendMessage(
        payload.channelUrl,
        payload.message,
        payload.userId,
      );

      // Broadcast the message to all users in the channel
      this.server.to(`channel_${payload.channelUrl}`).emit('newMessage', message);

      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(client: Socket, channelUrl: string) {
    client.join(`channel_${channelUrl}`);
    return { event: 'channelJoined', channelUrl };
  }

  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(client: Socket, channelUrl: string) {
    client.leave(`channel_${channelUrl}`);
    return { event: 'channelLeft', channelUrl };
  }

  // Method to send notifications to specific users
  async sendNotification(userId: string, notification: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(`user_${userId}`).emit('notification', notification);
    }
  }
}
