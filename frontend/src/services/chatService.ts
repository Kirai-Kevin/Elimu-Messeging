import SendbirdChat from '@sendbird/chat';
import { GroupChannel, GroupChannelModule, GroupChannelCreateParams, GroupChannelListOrder, MyMemberStateFilter, GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { BaseMessage } from '@sendbird/chat/message';
import { ConnectionHandler } from '@sendbird/chat';
import { User } from '@sendbird/chat';
import { BaseChannel } from '@sendbird/chat';

type SendbirdChatWithModules = SendbirdChat & {
  groupChannel: GroupChannelModule;
};

interface ChannelData {
  channelType: 'student_instructor' | 'student_student' | 'instructor_instructor';
  courseId?: string;
  subject?: string;
}

type TypingStatusListener = (typingUsers: User[]) => void;
type ConnectionStatusListener = (isConnected: boolean) => void;

class ChatService {
  private static instance: ChatService;
  private sb: SendbirdChatWithModules;
  private typingListeners: Map<string, TypingStatusListener>;
  private connectionListeners: Set<ConnectionStatusListener>;
  private _isConnected: boolean = false;
  private userId: string | null = null;
  private reconnectAttempts: number = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly connectionHandlerId = 'connection-handler';
  private connectionCheckInterval: number | null = null;

  private constructor() {
    const appId = import.meta.env.VITE_SENDBIRD_APP_ID;
    if (!appId) {
      throw new Error('SendBird App ID is not configured');
    }

    console.log('[ChatService] Initializing with AppID:', appId);
    this.sb = SendbirdChat.init({
      appId,
      modules: [new GroupChannelModule()],
    }) as SendbirdChatWithModules;

    this.typingListeners = new Map();
    this.connectionListeners = new Set();

    // Initialize SendBird first, then set up handlers
    this.sb.connect('system', undefined).then(() => {
      console.log('[ChatService] Initial connection successful');
      this.setupConnectionCheck();
      this.setupConnectionHandlers();
      this.setupChannelHandlers();
      // Disconnect after initialization to allow proper user connection later
      return this.sb.disconnect();
    }).then(() => {
      console.log('[ChatService] Initial setup complete, ready for user connection');
    }).catch((error: unknown) => {
      console.error('[ChatService] Initial setup failed:', error);
    });
  }

  private setupConnectionCheck() {
    // Check connection status every 30 seconds
    this.connectionCheckInterval = window.setInterval(() => {
      const isCurrentlyConnected = this.sb.connectionState === 'OPEN';
      
      if (this._isConnected !== isCurrentlyConnected) {
        console.log('[ChatService] Connection state changed:', {
          previous: this._isConnected,
          current: isCurrentlyConnected,
          state: this.sb.connectionState,
          reconnectAttempts: this.reconnectAttempts
        });
        this.updateConnectionState(isCurrentlyConnected);
      }
    }, 30000);
  }

  private setupConnectionHandlers(): void {
    try {
      // Remove existing handler first
      try {
        this.sb.removeConnectionHandler(this.connectionHandlerId);
      } catch (error: unknown) {
        console.warn('[ChatService] Error removing existing connection handler:', error);
      }

      const handler: ConnectionHandler = {
        onConnected: (userId: string) => {
          console.log('[ChatService] Connected:', userId);
          this.updateConnectionState(true);
        },
        onDisconnected: (userId: string) => {
          console.log('[ChatService] Disconnected:', userId);
          this.updateConnectionState(false);
        },
        onReconnectStarted: () => {
          console.log('[ChatService] Reconnection started');
          this.reconnectAttempts++;
        },
        onReconnectSucceeded: () => {
          console.log('[ChatService] Reconnection succeeded');
          this.reconnectAttempts = 0;
          this.updateConnectionState(true);
        },
        onReconnectFailed: () => {
          console.log('[ChatService] Reconnection failed');
          this.updateConnectionState(false);
          if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            console.log('[ChatService] Max reconnection attempts reached');
          }
        }
      };

      // Bind all handler methods to the ChatService instance
      Object.keys(handler).forEach((key) => {
        const method = handler[key as keyof ConnectionHandler];
        if (typeof method === 'function') {
          (handler[key as keyof ConnectionHandler] as Function) = method.bind(this);
        }
      });

      this.sb.addConnectionHandler(this.connectionHandlerId, handler);
      console.log('[ChatService] Connection handlers setup complete');
    } catch (error: unknown) {
      console.error('[ChatService] Error setting up connection handler:', error);
      throw error;
    }
  }

  private setupChannelHandlers(): void {
    try {
      // Remove existing handler first
      try {
        this.sb.groupChannel.removeGroupChannelHandler('custom-handler');
      } catch (error: unknown) {
        console.warn('[ChatService] Error removing existing channel handler:', error);
      }

      const handler: GroupChannelHandler = {
        onTypingStatusUpdated: (channel: BaseChannel) => {
          console.log('[ChatService] Typing status updated in channel:', channel.url);
          const groupChannel = channel as GroupChannel;
          const listener = this.typingListeners.get(channel.url);
          if (listener) {
            listener(groupChannel.getTypingUsers());
          }
        },
        onMessageReceived: (channel: BaseChannel, message: BaseMessage) => {
          console.log('[ChatService] Message received in channel:', channel.url, message.messageId);
        },
        onChannelChanged: (channel: BaseChannel) => {
          console.log('[ChatService] Channel changed:', channel.url);
        },
        onChannelFrozen: (channel: BaseChannel) => {
          console.log('[ChatService] Channel frozen:', channel.url);
        },
        onChannelUnfrozen: (channel: BaseChannel) => {
          console.log('[ChatService] Channel unfrozen:', channel.url);
        },
        onMetaDataCreated: (channel: BaseChannel, metaData: { [key: string]: string }) => {
          console.log('[ChatService] Channel metadata created:', channel.url, metaData);
        },
        onMetaDataUpdated: (channel: BaseChannel, metaData: { [key: string]: string }) => {
          console.log('[ChatService] Channel metadata updated:', channel.url, metaData);
        },
        onMetaDataDeleted: (channel: BaseChannel, metaDataKeys: string[]) => {
          console.log('[ChatService] Channel metadata deleted:', channel.url, metaDataKeys);
        }
      };

      // Bind all handler methods to the ChatService instance
      Object.keys(handler).forEach((key) => {
        const method = handler[key as keyof GroupChannelHandler];
        if (typeof method === 'function') {
          (handler[key as keyof GroupChannelHandler] as Function) = method.bind(this);
        }
      });

      this.sb.groupChannel.addGroupChannelHandler('custom-handler', handler);
      console.log('[ChatService] Channel handlers setup complete');
    } catch (error: unknown) {
      console.error('[ChatService] Error setting up channel handler:', error);
      throw error;
    }
  }

  private updateConnectionState(connected: boolean): void {
    if (this._isConnected !== connected) {
      this._isConnected = connected;
      this.notifyConnectionListeners();
    }
  }

  private notifyConnectionListeners(): void {
    console.log('[ChatService] Notifying connection listeners. Connected:', this._isConnected);
    this.connectionListeners.forEach(listener => {
      try {
        listener(this._isConnected);
      } catch (error: unknown) {
        console.error('[ChatService] Error in connection listener:', error);
      }
    });
  }

  private clearConnectionState(): void {
    this.updateConnectionState(false);
    this.userId = null;
    this.reconnectAttempts = 0;
    this.typingListeners.clear();
    this.connectionListeners.clear();
    if (this.connectionCheckInterval) {
      window.clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
    }
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public addConnectionListener(listener: ConnectionStatusListener): void {
    console.log('[ChatService] Adding connection listener');
    this.connectionListeners.add(listener);
    // Immediately notify the new listener of current state
    try {
      listener(this._isConnected);
    } catch (error: unknown) {
      console.error('[ChatService] Error in initial connection listener call:', error);
    }
  }

  public removeConnectionListener(listener: ConnectionStatusListener): void {
    console.log('[ChatService] Removing connection listener');
    this.connectionListeners.delete(listener);
  }

  public getConnectionState(): boolean {
    return this._isConnected;
  }

  public addTypingListener(channelUrl: string, listener: TypingStatusListener): void {
    console.log('[ChatService] Adding typing listener for channel:', channelUrl);
    this.typingListeners.set(channelUrl, listener);
  }

  public removeTypingListener(channelUrl: string): void {
    console.log('[ChatService] Removing typing listener for channel:', channelUrl);
    this.typingListeners.delete(channelUrl);
  }

  public async connect(userId: string, accessToken?: string): Promise<void> {
    try {
      if (this._isConnected) {
        console.log('[ChatService] Already connected, disconnecting first...');
        await this.disconnect();
      }

      console.log('[ChatService] Connecting user:', userId);
      await this.sb.connect(userId, accessToken);
      this.updateConnectionState(true);
      this.userId = userId;

      // Re-setup handlers after successful connection
      this.setupConnectionHandlers();
      this.setupChannelHandlers();
      
      console.log('[ChatService] Connection successful');
    } catch (error: unknown) {
      console.error('[ChatService] Connection failed:', error);
      this.updateConnectionState(false);
      this.userId = null;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (!this._isConnected) {
        console.log('[ChatService] Already disconnected');
        return;
      }

      console.log('[ChatService] Disconnecting user:', this.userId);
      this.clearConnectionState();
      
      // Remove all handlers before disconnecting
      try {
        this.sb.removeConnectionHandler(this.connectionHandlerId);
        this.sb.groupChannel.removeGroupChannelHandler('custom-handler');
      } catch (error: unknown) {
        console.warn('[ChatService] Error removing handlers:', error);
      }

      await this.sb.disconnect();
      console.log('[ChatService] Disconnection successful');
    } catch (error: unknown) {
      console.error('[ChatService] Disconnection failed:', error);
      throw error;
    }
  }

  public async startTyping(channelUrl: string): Promise<void> {
    if (!this._isConnected) {
      console.warn('[ChatService] Cannot start typing - not connected');
      return;
    }
    try {
      console.log('[ChatService] Starting typing in channel:', channelUrl);
      const channel = await this.getChannel(channelUrl);
      await channel.startTyping();
    } catch (error: unknown) {
      console.error('[ChatService] Error starting typing:', error);
    }
  }

  public async endTyping(channelUrl: string): Promise<void> {
    if (!this._isConnected) {
      console.warn('[ChatService] Cannot end typing - not connected');
      return;
    }
    try {
      console.log('[ChatService] Ending typing in channel:', channelUrl);
      const channel = await this.getChannel(channelUrl);
      await channel.endTyping();
    } catch (error: unknown) {
      console.error('[ChatService] Error ending typing:', error);
    }
  }

  public async createStudentInstructorChannel(
    studentId: string,
    instructorId: string,
    data?: Omit<ChannelData, 'channelType'>
  ): Promise<GroupChannel> {
    if (!this._isConnected) {
      throw new Error('Cannot create channel - not connected');
    }
    try {
      // Validate user types
      if (!studentId.startsWith('Student_')) {
        throw new Error('Invalid student ID format');
      }
      if (!instructorId.startsWith('Instructor_')) {
        throw new Error('Invalid instructor ID format');
      }

      const channelName = `student_instructor_chat`;
      const params: GroupChannelCreateParams = {
        invitedUserIds: [studentId, instructorId],
        name: channelName,
        customType: 'student_instructor',
        operatorUserIds: [instructorId], // Instructor is automatically channel operator
        isDistinct: false,
        data: JSON.stringify({
          channelType: 'student_instructor',
          ...data,
        }),
      };

      const channel = await this.sb.groupChannel.createChannel(params);
      console.log('[ChatService] Created student-instructor channel:', channel.url);
      return channel;
    } catch (error: unknown) {
      console.error('[ChatService] Error creating student-instructor channel:', error);
      throw error;
    }
  }

  public async createPeerChannel(
    userId1: string,
    userId2: string,
    data?: Omit<ChannelData, 'channelType'>
  ): Promise<GroupChannel> {
    if (!this._isConnected) {
      throw new Error('Cannot create channel - not connected');
    }
    try {
      const type1 = this.getUserType(userId1);
      const type2 = this.getUserType(userId2);

      // Ensure both users are of the same type
      if (type1 !== type2) {
        throw new Error('Peer channels can only be created between users of the same type');
      }

      const channelType = type1 === 'student' ? 'student_student' : 'instructor_instructor';
      const channelName = `${channelType}_chat`;

      const params: GroupChannelCreateParams = {
        invitedUserIds: [userId1, userId2],
        name: channelName,
        customType: channelType,
        isDistinct: false,
        data: JSON.stringify({
          channelType,
          ...data,
        }),
      };

      const channel = await this.sb.groupChannel.createChannel(params);
      console.log('[ChatService] Created peer channel:', channel.url);
      return channel;
    } catch (error: unknown) {
      console.error('[ChatService] Error creating peer channel:', error);
      throw error;
    }
  }

  public async getChannel(channelUrl: string): Promise<GroupChannel> {
    if (!this._isConnected) {
      throw new Error('Cannot get channel - not connected');
    }
    try {
      console.log('[ChatService] Getting channel:', channelUrl);
      const channel = await this.sb.groupChannel.getChannel(channelUrl);
      console.log('[ChatService] Retrieved channel:', channel.url);
      return channel;
    } catch (error: unknown) {
      console.error('[ChatService] Error getting channel:', error);
      throw error;
    }
  }

  public async getStudentInstructorChannels(): Promise<GroupChannel[]> {
    if (!this._isConnected) {
      throw new Error('Cannot get channels - not connected');
    }
    try {
      console.log('[ChatService] Getting student-instructor channels');
      const query = this.sb.groupChannel.createMyGroupChannelListQuery({
        customTypesFilter: ['student_instructor'],
        includeEmpty: true,
        myMemberStateFilter: 'member' as MyMemberStateFilter,
        order: 'latest_last_message' as GroupChannelListOrder,
      });

      const channels = await query.next();
      console.log('[ChatService] Retrieved student-instructor channels:', channels.length);
      return channels;
    } catch (error: unknown) {
      console.error('[ChatService] Error getting student-instructor channels:', error);
      throw error;
    }
  }

  public async getPeerChannels(userType: 'student' | 'instructor'): Promise<GroupChannel[]> {
    if (!this._isConnected) {
      throw new Error('Cannot get channels - not connected');
    }
    try {
      console.log('[ChatService] Getting peer channels for user type:', userType);
      const channelType = userType === 'student' ? 'student_student' : 'instructor_instructor';

      const query = this.sb.groupChannel.createMyGroupChannelListQuery({
        customTypesFilter: [channelType],
        includeEmpty: true,
        myMemberStateFilter: 'member' as MyMemberStateFilter,
        order: 'latest_last_message' as GroupChannelListOrder,
      });

      const channels = await query.next();
      console.log('[ChatService] Retrieved peer channels:', channels.length);
      return channels;
    } catch (error: unknown) {
      console.error('[ChatService] Error getting peer channels:', error);
      throw error;
    }
  }

  public async getMessageHistory(channelUrl: string): Promise<BaseMessage[]> {
    if (!this._isConnected) {
      throw new Error('Cannot get message history - not connected');
    }

    try {
      const channel = await this.getChannel(channelUrl);
      const messageListParams = {
        prevResultSize: 0,
        nextResultSize: 20,
        includeThreadInfo: true,
        reverse: true,
        includeReactions: true,
        includeMetaArray: true
      };

      const messages = await channel.getMessagesByTimestamp(Date.now(), messageListParams);
      console.log('[ChatService] Retrieved message history for channel:', channelUrl, messages.length);
      return messages;
    } catch (error: unknown) {
      console.error('[ChatService] Error getting message history:', error);
      throw error;
    }
  }

  private getUserType(userId: string): 'student' | 'instructor' {
    return userId.startsWith('Student_') ? 'student' : 'instructor';
  }
}

export default ChatService;
