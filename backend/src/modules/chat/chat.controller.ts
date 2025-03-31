import { Controller, Post, Body, Get, Param, HttpException, HttpStatus, Query } from '@nestjs/common';
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

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('channels/student-instructor')
  async createStudentInstructorChannel(
    @Body() data: CreateChannelDto,
    @Query('userId') userId: string,
  ) {
    try {
      if (!userId || !data.otherUserId) {
        throw new HttpException(
          'Missing required user IDs',
          HttpStatus.BAD_REQUEST,
        );
      }

      const channel = await this.chatService.createChannel(
        userId,
        data.otherUserId,
        {
          courseId: data.courseId,
          subject: data.subject,
        },
      );
      return channel;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create channel',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('channels/peer')
  async createPeerChannel(
    @Body() data: CreateChannelDto,
    @Query('userId') userId: string,
  ) {
    try {
      if (!userId || !data.otherUserId) {
        throw new HttpException(
          'Missing required user IDs',
          HttpStatus.BAD_REQUEST,
        );
      }

      const channel = await this.chatService.createChannel(
        userId,
        data.otherUserId,
      );
      return channel;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create channel',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('channels/:channelUrl/messages')
  async sendMessage(
    @Param('channelUrl') channelUrl: string,
    @Body() data: SendMessageDto,
  ) {
    try {
      if (!channelUrl || !data.message || !data.userId) {
        throw new HttpException(
          'Missing required fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      const message = await this.chatService.sendMessage(
        channelUrl,
        data.message,
        data.userId,
      );
      return message;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to send message',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('channels/:channelUrl/messages')
  async getChannelMessages(
    @Param('channelUrl') channelUrl: string,
    @Query('timestamp') timestamp?: string,
  ) {
    try {
      if (!channelUrl) {
        throw new HttpException(
          'Channel URL is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const messages = await this.chatService.getChannelMessages(
        channelUrl,
        timestamp ? parseInt(timestamp) : undefined,
      );
      return messages;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get messages',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('users/:userId/channels/student-instructor')
  async getStudentInstructorChannels(@Param('userId') userId: string) {
    try {
      if (!userId) {
        throw new HttpException(
          'User ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const channels = await this.chatService.getStudentInstructorChannels(userId);
      return channels;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get channels',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('users/:userId/channels/peer')
  async getPeerChannels(@Param('userId') userId: string) {
    try {
      if (!userId) {
        throw new HttpException(
          'User ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const channels = await this.chatService.getPeerChannels(userId);
      return channels;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get channels',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
