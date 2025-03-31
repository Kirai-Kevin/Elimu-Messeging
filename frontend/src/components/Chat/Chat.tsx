import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { SendBirdProvider } from '@sendbird/uikit-react';
import ChannelList from '@sendbird/uikit-react/ChannelList';
import Channel from '@sendbird/uikit-react/Channel';
import ChannelSettings from '@sendbird/uikit-react/ChannelSettings';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type { GroupChannelListOrder, MyMemberStateFilter } from '@sendbird/chat/groupChannel';
import type { User } from '@sendbird/chat';
import '@sendbird/uikit-react/dist/index.css';
import { Box, Container, Paper, Tab, Tabs, Typography, CircularProgress, Button } from '@mui/material';
import ChatService from '../../services/chatService';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

interface ChatProps {
  userId: string;
  nickname: string;
  accessToken?: string;
  userType: 'student' | 'instructor';
}

interface ChannelPreviewProps {
  channel: GroupChannel;
  onLeaveChannel?: () => void;
  onClick?: () => void;
}

const ChatFallback = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error" gutterBottom>
      Chat service is temporarily unavailable
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Please try again later or contact support if the issue persists.
    </Typography>
  </Box>
);

const renderChannelPreview = (props: ChannelPreviewProps) => {
  const { channel, onClick } = props;
  const lastMessage = channel.lastMessage?.message || 'No messages yet';
  
  return (
    <Box 
      sx={{ p: 2, borderBottom: 1, borderColor: 'divider', '&:hover': { bgcolor: 'action.hover' }, cursor: 'pointer' }}
      onClick={onClick}
    >
      <Typography variant="subtitle1" noWrap>
        {channel.name || 'Unnamed Channel'}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {lastMessage}
      </Typography>
    </Box>
  );
};

interface ChannelComponentProps {
  channelUrl: string;
  onChatHeaderActionClick: () => void;
}

const ChannelComponent: React.FC<ChannelComponentProps> = ({ channelUrl, onChatHeaderActionClick }) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const chatService = useMemo(() => ChatService.getInstance(), []);

  useEffect(() => {
    if (!channelUrl) return;

    const handleTypingStatusChange = (typingUsers: User[]) => {
      console.log('[Chat] Typing status updated:', typingUsers.map(user => user.nickname));
      setTypingUsers(typingUsers.map(user => user.nickname || user.userId));
    };

    chatService.addTypingListener(channelUrl, handleTypingStatusChange);

    return () => {
      chatService.removeTypingListener(channelUrl);
    };
  }, [channelUrl, chatService]);

  const handleMessageInput = useCallback((text: string) => {
    return {
      message: text,
      data: JSON.stringify({ type: 'text' }),
    };
  }, []);

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Channel
        channelUrl={channelUrl}
        onChatHeaderActionClick={onChatHeaderActionClick}
        onBeforeSendUserMessage={handleMessageInput}
      />
      {typingUsers.length > 0 && (
        <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, left: 16, zIndex: 1 }}>
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </Typography>
      )}
    </Box>
  );
};

const ChatContent: React.FC<ChatProps> = ({ userId, nickname, accessToken, userType }) => {
  const [currentChannelUrl, setCurrentChannelUrl] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [currentTab, setCurrentTab] = useState<'student_instructor' | 'peer'>('student_instructor');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatService = useMemo(() => ChatService.getInstance(), []);

  const appId = import.meta.env.VITE_SENDBIRD_APP_ID;
  const colorSet = useMemo(() => ({
    '--sendbird-light-primary-500': '#3498db',
    '--sendbird-light-primary-400': '#5dade2',
    '--sendbird-light-primary-300': '#85c1e9',
    '--sendbird-light-primary-200': '#aed6f1',
    '--sendbird-light-primary-100': '#d6eaf8',
  }), []);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        console.log('[Chat] Initializing chat for user:', userId);
        await chatService.connect(userId, accessToken);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error('[Chat] Failed to initialize chat:', error);
        setIsLoading(false);
        setError('Failed to connect to chat service. Please check your connection and try again.');
      }
    };

    initializeChat();

    return () => {
      console.log('[Chat] Cleaning up chat connection');
      chatService.disconnect().catch(error => {
        console.error('[Chat] Error during disconnect:', error);
      });
    };
  }, [userId, accessToken, chatService]);

  const handleChannelSelect = useCallback(async (channel: GroupChannel) => {
    try {
      console.log('[Chat] Channel selected:', channel.url);
      setCurrentChannelUrl(channel.url);
      await chatService.getMessageHistory(channel.url);
    } catch (error) {
      console.error('[Chat] Error loading message history:', error);
      setError('Failed to load message history. Please try again.');
    }
  }, [chatService]);

  const handleSettingsClose = useCallback(() => {
    setShowSettings(false);
  }, []);

  const handleChatHeaderAction = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleTabChange = useCallback((_: unknown, newValue: 'student_instructor' | 'peer') => {
    console.log('[Chat] Tab changed:', newValue);
    setCurrentTab(newValue);
    setCurrentChannelUrl('');
    setError(null); // Clear any previous errors when changing tabs
  }, []);

  const getChannelListQuery = useCallback(() => ({
    channelListQuery: {
      customTypesFilter: currentTab === 'student_instructor'
        ? ['student_instructor']
        : [userType === 'student' ? 'student_student' : 'instructor_instructor'],
      includeEmpty: true,
      includeFrozen: false,
      includeMetaData: true,
      myMemberStateFilter: 'member' as MyMemberStateFilter,
      order: 'latest_last_message' as GroupChannelListOrder,
      limit: 20,
    },
  }), [currentTab, userType]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Please check your connection and try again.
        </Typography>
        <Button variant="contained" onClick={handleRetry} sx={{ mt: 2 }}>
          Retry Connection
        </Button>
      </Box>
    );
  }

  return (
    <SendBirdProvider
      userId={userId}
      nickname={nickname || userId}
      appId={appId}
      colorSet={colorSet}
    >
      <Container maxWidth="xl" sx={{ height: '100vh', py: 2 }}>
        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="chat type tabs"
              variant="fullWidth"
            >
              <Tab
                label={userType === 'student' ? "Chat with Instructors" : "Chat with Students"}
                value="student_instructor"
              />
              <Tab
                label={userType === 'student' ? "Chat with Students" : "Chat with Instructors"}
                value="peer"
              />
            </Tabs>
          </Box>
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <Box sx={{ width: 320, borderRight: 1, borderColor: 'divider' }}>
              <ChannelList
                onChannelSelect={handleChannelSelect}
                queries={getChannelListQuery()}
                renderChannelPreview={renderChannelPreview}
              />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <ChannelComponent
                channelUrl={currentChannelUrl}
                onChatHeaderActionClick={handleChatHeaderAction}
              />
            </Box>
          </Box>
        </Paper>
        {showSettings && (
          <ChannelSettings
            channelUrl={currentChannelUrl}
            onCloseClick={handleSettingsClose}
          />
        )}
      </Container>
    </SendBirdProvider>
  );
};

const Chat: React.FC<ChatProps> = (props) => (
  <ErrorBoundary fallback={<ChatFallback />}>
    <ChatContent {...props} />
  </ErrorBoundary>
);

export default Chat;
