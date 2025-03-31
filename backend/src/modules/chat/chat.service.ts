import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendBird from '@sendbird/chat';
import axios from 'axios';

type UserType = 'student' | 'instructor';
type ChannelType = 'student_instructor' | 'student_student' | 'instructor_instructor';

interface ChannelMetadata {
  channelType: ChannelType;
  courseId?: string;
  subject?: string;
}

@Injectable()
export class ChatService {
  private readonly sendbirdApi: string;
  private readonly apiToken: string;

  constructor(private configService: ConfigService) {
    const appId = this.configService.get<string>('SENDBIRD_APP_ID');
    this.apiToken = this.configService.get<string>('SENDBIRD_API_TOKEN');
    this.sendbirdApi = `https://api-${appId}.sendbird.com/v3`;
  }

  private getUserType(userId: string): UserType {
    // Check if the user's nickname starts with 'Student_' or 'Instructor_'
    return userId.startsWith('Student_') ? 'student' : 'instructor';
  }

  private getChannelType(userType: UserType, otherUserType: UserType): ChannelType {
    if (userType === otherUserType) {
      return `${userType}_${userType}` as ChannelType;
    }
    return 'student_instructor';
  }

  async createChannel(userId: string, otherUserId: string, metadata?: { courseId?: string; subject?: string }) {
    try {
      const userType = this.getUserType(userId);
      const otherUserType = this.getUserType(otherUserId);
      const channelType = this.getChannelType(userType, otherUserType);

      const channelMetadata: ChannelMetadata = {
        channelType,
        ...metadata
      };

      const response = await axios.post(
        `${this.sendbirdApi}/group_channels`,
        {
          user_ids: [userId, otherUserId],
          is_distinct: true,
          operator_ids: [userType === 'instructor' ? userId : otherUserId], // Instructor is always operator
          name: `${channelType}_chat`,
          channel_url: `${userId}_${otherUserId}_${Date.now()}`,
          metadata: channelMetadata,
        },
        {
          headers: {
            'Api-Token': this.apiToken,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create channel: ${error.message}`);
    }
  }

  async sendMessage(channelUrl: string, message: string, userId: string) {
    try {
      const response = await axios.post(
        `${this.sendbirdApi}/group_channels/${channelUrl}/messages`,
        {
          message_type: 'MESG',
          user_id: userId,
          message,
        },
        {
          headers: {
            'Api-Token': this.apiToken,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  async getChannelMessages(channelUrl: string, messageTimestamp?: number) {
    try {
      const response = await axios.get(
        `${this.sendbirdApi}/group_channels/${channelUrl}/messages`,
        {
          params: {
            message_ts: messageTimestamp,
            include_metadata: true,
          },
          headers: {
            'Api-Token': this.apiToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get channel messages: ${error.message}`);
    }
  }

  async getUserChannels(userId: string, channelType?: ChannelType) {
    try {
      const params: any = {
        include_metadata: true,
      };

      // Filter channels by type if specified
      if (channelType) {
        params.metadata_key = 'channelType';
        params.metadata_values = channelType;
      }

      const response = await axios.get(
        `${this.sendbirdApi}/users/${userId}/my_group_channels`,
        {
          params,
          headers: {
            'Api-Token': this.apiToken,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user channels: ${error.message}`);
    }
  }

  async getStudentInstructorChannels(userId: string) {
    return this.getUserChannels(userId, 'student_instructor');
  }

  async getPeerChannels(userId: string) {
    const userType = this.getUserType(userId);
    return this.getUserChannels(userId, `${userType}_${userType}` as ChannelType);
  }
}
