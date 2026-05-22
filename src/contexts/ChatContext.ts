'use client';

import { createContext } from 'react';

import { Chat, Friend, Message, Participant, User } from '@shared/types/chat';
import { useContextWrapper } from '@shared/utils';

export interface ChatContextValue {
  // Данные
  currentUser: User;
  friends: Friend[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  participants: Record<string, Participant[]>;

  // Операции (WS-ready интерфейс)
  // WS: каждую функцию заменить на ws.send() + оптимистичный апдейт стейта

  sendMessage: (chatId: string, text: string, replyTo?: string) => void;

  searchUsers: (query: string) => User[];

  addFriend: (userId: string) => void;

  createDm: (friendId: string) => Chat;

  createGroup: (name: string, memberIds: string[]) => Chat;

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
