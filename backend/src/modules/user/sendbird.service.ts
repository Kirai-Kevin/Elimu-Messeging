import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendbirdChat from '@sendbird/chat';
import { UserUpdateParams } from '@sendbird/chat';

@Injectable()
export class SendbirdService {
  private readonly apiToken: string;
  private readonly appId: string;

  constructor(private readonly configService: ConfigService) {
    this.apiToken = this.configService.get<string>('SENDBIRD_API_TOKEN');
    this.appId = this.configService.get<string>('SENDBIRD_APP_ID');

    if (!this.apiToken || !this.appId) {
      throw new Error('SendBird credentials not configured');
    }
  }

  async createSendbirdUser(userId: string, nickname: string, profileUrl?: string): Promise<any> {
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
    } catch (error) {
      console.error('Error creating SendBird user:', error);
      throw error;
    }
  }

  async updateSendbirdUser(userId: string, params: Partial<UserUpdateParams>): Promise<any> {
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
    } catch (error) {
      console.error('Error updating SendBird user:', error);
      throw error;
    }
  }
}
