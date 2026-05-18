'use client';

import { createContext } from 'react';

import { Chat, Friend, Message, Participant, User } from '@shared/types/chat';
import { useContextWrapper } from '@shared/utils';

export interface ChatContextValue {
  // ─── Данные ──────────────────────────────────────────────────────────────
  currentUser: User;
  friends: Friend[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  participants: Record<string, Participant[]>;

  // ─── Операции (WS-ready интерфейс) ──────────────────────────────────────
  // WS: каждую функцию заменить на ws.send() + оптимистичный апдейт стейта

  /** Отправить сообщение в чат */
  sendMessage: (chatId: string, content: string) => void;

  /** Найти пользователей по строке (имя или @username) */
  searchUsers: (query: string) => User[];

  /** Отправить заявку в друзья */
  addFriend: (userId: string) => void;

  /** Создать новый DM-чат с другом */
  createDm: (friendId: string) => Chat;

  /** Создать групповой чат */
  createGroup: (name: string, memberIds: string[]) => Chat;
}

export const ChatContext = createContext<ChatContextValue | undefined>(
  undefined,
);

export const useChatContext = () => useContextWrapper(ChatContext);
