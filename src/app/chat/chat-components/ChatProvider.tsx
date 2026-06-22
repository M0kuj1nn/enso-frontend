'use client';

import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAuth } from '@contexts/AuthContext';
import { ChatContext } from '@contexts/ChatContext';
import {
  MOCK_CHATS,
  MOCK_MESSAGES,
  MOCK_RELATIONSHIPS,
  MOCK_SEARCHABLE_USERS,
  MOCK_SERVERS,
} from '@shared/mock/chat';
import {
  Chat,
  ChatMessage,
  Friend,
  Participant,
  Relationship,
  Server,
  User,
} from '@shared/types/chat';
import { getFriendState } from '@shared/utils/friend.util';

// Демо: пул случайных ответов для имитации активности собеседников в группе
const DEMO_REPLY_POOL = [
  'Отличная идея!',
  'Звучит отлично 👍',
  'Поддерживаю!',
  'Вперёд к новым вершинам!',
  'Всем привет)',
  'Супер!',
  'Очередной тест))',
];

export const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isInitialized } = useAuth();
  const [relationships, setRelationships] =
    useState<Relationship[]>(MOCK_RELATIONSHIPS);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [servers, setServers] = useState<Server[]>(MOCK_SERVERS);
  const [messages, setMessages] =
    useState<Record<string, ChatMessage[]>>(MOCK_MESSAGES);
  const [activeVoiceChannelId, setActiveVoiceChannelId] = useState<
    string | null
  >(null);
  const [activeScreenStream, setActiveScreenStream] =
    useState<MediaStream | null>(null);
  const [activeCameraStream, setActiveCameraStream] =
    useState<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const demoReplyTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Демо: счётчик подряд отправленных мной сообщений в ЛС (для триггера авто-ответа)
  const dmMessageCountRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const timers = demoReplyTimersRef.current;
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  // friends: вычисляется из relationships (status === 'accepted') + профилей пользователей
  const friends = useMemo<Friend[]>(() => {
    if (!user) return [];
    const result: Friend[] = [];
    for (const r of relationships) {
      const friendState = getFriendState(r, user.id);
      if (friendState !== 'friends') continue;
      const otherId = r.sender_id === user.id ? r.receiver_id : r.sender_id;
      const profile = MOCK_SEARCHABLE_USERS.find((u) => u.id === otherId);
      if (profile) result.push({ ...profile, friendState });
    }
    return result;
  }, [relationships, user]);

  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      // Когда пользователь сам останавливает через браузерный UI
      stream.getVideoTracks()[0].onended = () => {
        setActiveScreenStream(null);
        screenStreamRef.current = null;
      };
      screenStreamRef.current = stream;
      setActiveScreenStream(stream);
    } catch {
      // пользователь отменил выбор — ничего не делаем
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    setActiveScreenStream(null);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      stream.getVideoTracks()[0].onended = () => {
        setActiveCameraStream(null);
        cameraStreamRef.current = null;
      };
      cameraStreamRef.current = stream;
      setActiveCameraStream(stream);
    } catch {
      // пользователь отказал в доступе
    }
  }, []);

  const stopCamera = useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    cameraStreamRef.current = null;
    setActiveCameraStream(null);
  }, []);

  if (!isInitialized) return null;
  if (!user) return null;

  // Участники каждого чата (join по participantIds)
  const participants: Record<string, Participant[]> = {
    // участники чатов
    ...chats.reduce<Record<string, Participant[]>>((acc, chat) => {
      const members = chat.participantIds.map<Participant>((id) => {
        if (id === 'me') return user;
        return MOCK_SEARCHABLE_USERS.find((u) => u.id === id) ?? user;
      });
      return { ...acc, [chat.id]: members };
    }, {}),

    // участники каналов серверов
    ...servers.reduce<Record<string, Participant[]>>((acc, server) => {
      const members = server.members.map<Participant>((id) => {
        if (id === 'me') return user;
        return MOCK_SEARCHABLE_USERS.find((u) => u.id === id) ?? user;
      });
      const channelEntries = server.text_channels.reduce<
        Record<string, Participant[]>
      >(
        (channelAcc, channel) => ({ ...channelAcc, [channel.id]: members }),
        {},
      );
      return { ...acc, ...channelEntries };
    }, {}),
  };

  const joinVoiceChannel = (channelId: string) => {
    setServers((prev) =>
      prev.map((s) => ({
        ...s,
        voice_channels: s.voice_channels.map((vc) => {
          // Убираем из всех каналов
          const withoutMe = vc.participants.filter(
            (p) => p.userId !== user!.id,
          );
          // Добавляем только в нужный
          if (vc.id === channelId) {
            return {
              ...vc,
              participants: [
                ...withoutMe,
                { userId: user!.id, isSpeaking: false },
              ],
            };
          }
          return { ...vc, participants: withoutMe };
        }),
      })),
    );
    setActiveVoiceChannelId(channelId);
  };

  const leaveVoiceChannel = () => {
    stopScreenShare();
    stopCamera();
    setServers((prev) =>
      prev.map((s) => ({
        ...s,
        voice_channels: s.voice_channels.map((vc) => ({
          ...vc,
          participants: vc.participants.filter((p) => p.userId !== user!.id),
        })),
      })),
    );
    setActiveVoiceChannelId(null);
  };

  // Демо: добавляет входящее сообщение от собеседника (имитация ответа)
  // TODO: убрать при подключении реального бэка/WS
  const pushDemoIncomingMessage = (
    chatId: string,
    responder: User,
    text: string,
  ) => {
    const replyTime = new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const replyMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      target_id: chatId,
      bucket: '2026-06',
      text,
      sender_id: responder.id,
      reply_to_id: null,
      is_pinned: false,
      media: [],
      reactions: [],
      created_at: replyTime,
      updated_at: replyTime,
      sender: responder.name,
      avatar: responder.avatar,
      isOwn: false,
    };
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] ?? []), replyMsg],
    }));
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, lastMessage: text, lastMessageSenderName: responder.name }
          : c,
      ),
    );
  };

  // markAsRead
  // WS: заменить на ws.send({ type: 'MESSAGE_READ', ... }) + оптимистичный сброс unread
  const markAsRead = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c)),
    );
  };

  // sendMessage
  // WS: заменить на ws.send({ type: 'MESSAGE_CREATED', payload: { text, reply_to, ... } })
  //     Оставить оптимистичное добавление пока сервер не подтвердил
  const sendMessage = (chatId: string, text: string, replyTo?: string) => {
    const now = new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      target_id: chatId,
      bucket: '2026-06', // TODO: подставить реальный год-месяц при подключении бэка
      text,
      sender_id: user!.id,
      reply_to_id: replyTo ?? null,
      is_pinned: false,
      media: [],
      reactions: [],
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
          ? { ...c, lastMessage: text, lastMessageSenderName: 'Вы', unread: 0 }
          : c,
      ),
    );

    // Демо: имитация активности собеседника
    // TODO: убрать при подключении реального бэка/WS — сообщения будут приходить от живых людей
    const chat = chats.find((c) => c.id === chatId);

    if (chat?.type === 'group') {
      // В группе — случайный ответ от случайного участника через 7-8 секунд
      const otherIds = chat.participantIds.filter((id) => id !== 'me');
      if (otherIds.length > 0) {
        const responderId =
          otherIds[Math.floor(Math.random() * otherIds.length)];
        const responder = MOCK_SEARCHABLE_USERS.find(
          (u) => u.id === responderId,
        );
        if (responder) {
          const delay = 4000 + Math.random() * 2000;
          const replyText =
            DEMO_REPLY_POOL[Math.floor(Math.random() * DEMO_REPLY_POOL.length)];
          const timer = setTimeout(() => {
            pushDemoIncomingMessage(chatId, responder, replyText);
          }, delay);
          demoReplyTimersRef.current.push(timer);
        }
      }
    } else if (chat?.type === 'dm') {
      // В ЛС — после 2 подряд отправленных мной сообщений собеседник отвечает через 4 секунды
      const count = (dmMessageCountRef.current[chatId] ?? 0) + 1;
      dmMessageCountRef.current[chatId] = count;

      if (count >= 2) {
        dmMessageCountRef.current[chatId] = 0;
        const otherId = chat.participantIds.find((id) => id !== 'me');
        const responder = MOCK_SEARCHABLE_USERS.find((u) => u.id === otherId);
        if (responder) {
          const timer = setTimeout(() => {
            pushDemoIncomingMessage(
              chatId,
              responder,
              'Я проверю обязательно 👍',
            );
          }, 4000);
          demoReplyTimersRef.current.push(timer);
        }
      }
    }
  };

  // searchUsers
  // заменить на GET /api/users/search?q=query
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
  // заменить на POST /api/friends/request
  // TODO: для демо заявка сразу 'accepted' (нет второго юзера для подтверждения).
  //       На реальном бэке статус должен быть 'pending' до подтверждения получателем.
  const addFriend = (userId: string) => {
    const target = MOCK_SEARCHABLE_USERS.find((u) => u.id === userId);
    if (!user || !target) return;
    const alreadyExists = relationships.some(
      (r) =>
        (r.sender_id === user.id && r.receiver_id === userId) ||
        (r.sender_id === userId && r.receiver_id === user.id),
    );
    if (alreadyExists) return;

    const now = new Date().toISOString();
    setRelationships((prev) => [
      ...prev,
      {
        sender_id: user.id,
        receiver_id: userId,
        status: 'accepted',
        created_at: now,
        updated_at: now,
      },
    ]);
  };

  // createDm
  // заменить на POST /api/chats/dm  (+ WS event CHAT_CREATED)
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
  // заменить на POST /api/chats/group  (+ WS event CHAT_CREATED)
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

  const createServer = (name: string, topic: string, icon: string): Server => {
    const newServer: Server = {
      id: `server-${Date.now()}`,
      name,
      topic,
      icon,
      text_channels: [
        {
          id: `tc-${Date.now()}-1`,
          serverId: `server-${Date.now()}`,
          name: 'общий',
        },
      ],
      voice_channels: [
        {
          id: `vc-${Date.now()}-1`,
          serverId: `server-${Date.now()}`,
          name: 'Войсчат',
          participants: [],
        },
      ],
      members: [user!.id],
      owner: user!.id,
      invite_links: [],
    };
    setServers((prev) => [...prev, newServer]);
    return newServer;
  };

  // addTextChannel
  // WS: заменить на POST /api/servers/:id/channels/text  (+ WS event CHANNEL_CREATED)
  const addTextChannel = (serverId: string, name: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId
          ? {
              ...s,
              text_channels: [
                ...s.text_channels,
                { id: `tc-${Date.now()}`, serverId, name },
              ],
            }
          : s,
      ),
    );
  };

  // addVoiceChannel
  // WS: заменить на POST /api/servers/:id/channels/voice  (+ WS event CHANNEL_CREATED)
  const addVoiceChannel = (serverId: string, name: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId
          ? {
              ...s,
              voice_channels: [
                ...s.voice_channels,
                { id: `vc-${Date.now()}`, serverId, name, participants: [] },
              ],
            }
          : s,
      ),
    );
  };

  const setMySpeaking = (isSpeaking: boolean) => {
    if (!activeVoiceChannelId) return;
    setServers((prev) =>
      prev.map((s) => ({
        ...s,
        voice_channels: s.voice_channels.map((vc) => {
          if (vc.id !== activeVoiceChannelId) return vc;
          return {
            ...vc,
            participants: vc.participants.map((p) =>
              p.userId === user!.id ? { ...p, isSpeaking } : p,
            ),
          };
        }),
      })),
    );
  };

  const getChatData = (id: string): Chat | null => {
    const chat = chats.find((c) => c.id === id);
    if (chat) return chat;

    const channel = servers
      .flatMap((s) => s.text_channels)
      .find((c) => c.id === id);
    const server = channel
      ? servers.find((s) => s.id === channel.serverId)
      : null;
    if (channel && server)
      return {
        id: channel.id,
        type: 'group' as const,
        name: `# ${channel.name}`,
        avatar: server.icon,
        lastMessage: '',
        unread: 0,
        participantIds: server.members,
      };

    return null;
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser: user!,
        friends,
        chats,
        servers,
        messages,
        participants,
        activeVoiceChannelId,
        activeScreenStream,
        activeCameraStream,
        markAsRead,
        sendMessage,
        searchUsers,
        addFriend,
        createDm,
        createGroup,
        createServer,
        addTextChannel,
        addVoiceChannel,
        getChatData,
        joinVoiceChannel,
        leaveVoiceChannel,
        startScreenShare,
        stopScreenShare,
        startCamera,
        stopCamera,
        setMySpeaking,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
