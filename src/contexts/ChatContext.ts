'use client';

import { createContext } from 'react';

import {
  Chat,
  ChatMessage,
  Friend,
  Participant,
  Server,
  User,
} from '@shared/types/chat';
import { useContextWrapper } from '@shared/utils';

export interface ChatContextValue {
  // Данные
  currentUser: User;
  friends: Friend[];
  chats: Chat[];
  servers: Server[];
  messages: Record<string, ChatMessage[]>;
  participants: Record<string, Participant[]>;
  activeVoiceChannelId: string | null;
  activeScreenStream: MediaStream | null;
  activeCameraStream: MediaStream | null;

  // Операции (WS-ready интерфейс)
  // WS: каждую функцию заменить на ws.send() + оптимистичный апдейт стейта

  markAsRead: (chatId: string) => void;

  sendMessage: (chatId: string, text: string, replyTo?: string) => void;

  searchUsers: (query: string) => User[];

  addFriend: (userId: string) => void;

  createDm: (friendId: string) => Chat;

  createGroup: (name: string, memberIds: string[]) => Chat;

  createServer: (name: string, topic: string, icon: string) => Server;

  addTextChannel: (serverId: string, name: string) => void;

  addVoiceChannel: (serverId: string, name: string) => void;

  getChatData: (id: string) => Chat | null;

  joinVoiceChannel: (channelId: string) => void;

  leaveVoiceChannel: () => void;

  startScreenShare: () => Promise<void>;

  stopScreenShare: () => void;

  startCamera: () => Promise<void>;

  stopCamera: () => void;

  setMySpeaking: (isSpeaking: boolean) => void;

  // WS: эти методы добавятя когда бэк будет готов к слиянию
  // addReaction:    (messageId: string, emoji: string) => void
  // removeReaction: (messageId: string, emoji: string) => void
  // editMessage:    (messageId: string, text: string)  => void
  // deleteMessage:  (messageId: string)                => void
  // pinMessage:     (messageId: string)                => void
  // replyToMessage: (chatId: string, replyTo: string, text: string) => void
}

export const ChatContext = createContext<ChatContextValue | undefined>(
  undefined,
);

export const useChatContext = () => useContextWrapper(ChatContext);
