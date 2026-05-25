'use client';

import { FC, ReactNode, useState } from 'react';

import { useAuth } from '@contexts/AuthContext';
import { ChatContext } from '@contexts/ChatContext';
import {
  MOCK_CHATS,
  MOCK_FRIENDS,
  MOCK_MESSAGES,
  MOCK_SEARCHABLE_USERS,
} from '@shared/mock/chat';
import { Chat, Friend, Message, Participant, User } from '@shared/types/chat';

export const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>(MOCK_FRIENDS);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(MOCK_MESSAGES);

  // Участники каждого чата (join по participantIds)
  const participants: Record<string, Participant[]> = chats.reduce(
    (acc, chat) => {
      const members = chat.participantIds.map<Participant>((id) => {
        if (id === 'me') return user!;
        return MOCK_SEARCHABLE_USERS.find((u) => u.id === id) ?? user!;
      });
      return { ...acc, [chat.id]: members };
    },
    {},
  );

  // sendMessage
  // WS: заменить на ws.send({ type: 'MESSAGE_CREATED', payload: { text, reply_to, ... } })
  //     Оставить оптимистичное добавление пока сервер не подтвердил
  const sendMessage = (chatId: string, text: string, replyTo?: string) => {
    const now = new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newMsg: Message = {
      id: `local-${Date.now()}`,
      text,
      sender_id: user!.id,
      receiver_id: null,
      media_links: [],
      is_read: false,
      reactions: [],
      reply_to: replyTo ?? null,
      created_at: now,
      updated_at: now,
      sender: user!.name,
      avatar: user!.avatar,
      isOwn: true,
    };
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] ?? []), newMsg],
    }));
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, lastMessage: text, LastMessageSenderName: 'Вы', unread: 0 }
          : c,
      ),
    );
  };

  // searchUsers
  // WS: заменить на GET /api/users/search?q=query
  const searchUsers = (query: string): User[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return MOCK_SEARCHABLE_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q),
    );
  };

  // addFriend
  // WS: заменить на POST /api/friends/request  (+ WS event FRIEND_REQUEST_SENT)
  const addFriend = (userId: string) => {
    const user = MOCK_SEARCHABLE_USERS.find((u) => u.id === userId);
    if (!user || friends.some((f) => f.id === userId)) return;
    setFriends((prev) => [...prev, { ...user, friendState: 'friends' }]);
  };

  // createDm
  // WS: заменить на POST /api/chats/dm  (+ WS event CHAT_CREATED)
  const createDm = (friendId: string): Chat => {
    const existing = chats.find(
      (c) => c.type === 'dm' && c.participantIds.includes(friendId),
    );
    if (existing) return existing;

    const friend = friends.find((f) => f.id === friendId)!;
    const newChat: Chat = {
      id: `dm-${Date.now()}`,
      type: 'dm',
      name: friend.name,
      avatar: friend.avatar,
      lastMessage: '',
      unread: 0,
      participantIds: ['me', friendId],
    };
    setChats((prev) => [newChat, ...prev]);
    setMessages((prev) => ({ ...prev, [newChat.id]: [] }));
    return newChat;
  };

  // ─── createGroup ─────────────────────────────────────────────────────────
  // WS: заменить на POST /api/chats/group  (+ WS event CHAT_CREATED)
  const createGroup = (name: string, memberIds: string[]): Chat => {
    const firstMember = friends.find((f) => f.id === memberIds[0]);
    const newChat: Chat = {
      id: `group-${Date.now()}`,
      type: 'group',
      name,
      avatar: firstMember?.avatar ?? user!.avatar,
      lastMessage: '',
      unread: 0,
      participantIds: ['me', ...memberIds],
    };
    setChats((prev) => [newChat, ...prev]);
    setMessages((prev) => ({ ...prev, [newChat.id]: [] }));
    return newChat;
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser: user!,
        friends,
        chats,
        messages,
        participants,
        sendMessage,
        searchUsers,
        addFriend,
        createDm,
        createGroup,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
