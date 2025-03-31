export interface User {
  id: string;
  nickname: string;
  profileUrl?: string;
  role: 'student' | 'instructor';
}

export interface Message {
  id: string;
  sender: User;
  message: string;
  createdAt: number;
  updatedAt?: number;
  messageType: 'text' | 'file';
  fileUrl?: string;
}

export interface Channel {
  url: string;
  name: string;
  members: User[];
  lastMessage?: Message;
  unreadMessageCount: number;
  isGroupChannel: boolean;
}
