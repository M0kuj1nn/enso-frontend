// WS: весь этот файл заменится реальными запросами к API.
// Структура типов сохраняется — компоненты переписывать не придётся.
import { Chat, Friend, Message, User } from '@shared/types/chat';

export const CURRENT_USER: User = {
  id: 'me',
  username: '@abracadabra',
  name: 'MIDNIGHT',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  status: 'online',
};

// Пользователи которых можно найти через поиск при добавлении друга
export const MOCK_SEARCHABLE_USERS: User[] = [
  {
    id: 'u1',
    username: '@sarahchen',
    name: 'Sarah Chen',
    avatar:
      'https://images.unsplash.com/photo-1573497620166-aef748c8c792?w=100&h=100&fit=crop',
    status: 'online',
  },
  {
    id: 'u2',
    username: '@marcusj',
    name: 'Marcus Johnson',
    avatar:
      'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=100&h=100&fit=crop',
    status: 'online',
  },
  {
    id: 'u3',
    username: '@emilyrod',
    name: 'Emily Rodriguez',
    avatar:
      'https://images.unsplash.com/photo-1752860872185-78926b52ef77?w=100&h=100&fit=crop',
    status: 'away',
  },
  {
    id: 'u4',
    username: '@alexkim',
    name: 'Alex Kim',
    avatar:
      'https://images.unsplash.com/photo-1765248149092-4e0ea5e2edd9?w=100&h=100&fit=crop',
    status: 'offline',
  },
  {
    id: 'u5',
    username: '@danielpark',
    name: 'Daniel Park',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    status: 'online',
  },
];

export const MOCK_FRIENDS: Friend[] = [
  { ...MOCK_SEARCHABLE_USERS[0], friendState: 'friends' },
  { ...MOCK_SEARCHABLE_USERS[1], friendState: 'friends' },
  { ...MOCK_SEARCHABLE_USERS[2], friendState: 'friends' },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    type: 'group',
    name: 'Design Team',
    avatar:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    lastMessage: 'Обновлённые макеты в Figma',
    unread: 7,
    participantIds: ['me', 'u1', 'u2', 'u3'],
  },
  {
    id: '2',
    type: 'dm',
    name: 'Sarah Chen',
    avatar:
      'https://images.unsplash.com/photo-1573497620166-aef748c8c792?w=100&h=100&fit=crop',
    lastMessage: 'Можем провести быстрый созвон?',
    unread: 1,
    participantIds: ['me', 'u1'],
  },
  {
    id: '3',
    type: 'dm',
    name: 'Marcus Johnson',
    avatar:
      'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=100&h=100&fit=crop',
    lastMessage: 'Спасибо за фидбек!',
    unread: 0,
    participantIds: ['me', 'u2'],
  },
  {
    id: '4',
    type: 'dm',
    name: 'Emily Rodriguez',
    avatar:
      'https://images.unsplash.com/photo-1752860872185-78926b52ef77?w=100&h=100&fit=crop',
    lastMessage: 'Дизайн выглядит идеально 🎨',
    unread: 0,
    participantIds: ['me', 'u3'],
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      chatId: '1',
      senderId: 'u1',
      sender: 'Sarah Chen',
      avatar: MOCK_SEARCHABLE_USERS[0].avatar,
      timestamp: '9:23',
      content:
        'Привет команда! Только что загрузила последние макеты. Жду фидбек до конца дня.',
      isOwn: false,
    },
    {
      id: 'm2',
      chatId: '1',
      senderId: 'u2',
      sender: 'Marcus Johnson',
      avatar: MOCK_SEARCHABLE_USERS[1].avatar,
      timestamp: '9:45',
      content:
        'Выглядит отлично! Только вопрос — нужно ли скорректировать отступы на мобайле?',
      isOwn: false,
    },
    {
      id: 'm3',
      chatId: '1',
      senderId: 'me',
      sender: 'You',
      avatar: CURRENT_USER.avatar,
      timestamp: '10:12',
      content:
        'Хорошее замечание! Внесу правки и выложу новую версию сегодня днём.',
      isOwn: true,
    },
    {
      id: 'm4',
      chatId: '1',
      senderId: 'me',
      sender: 'You',
      avatar: CURRENT_USER.avatar,
      timestamp: '10:12',
      content: 'Также работаю над мобильной адаптацией.',
      isOwn: true,
    },
    {
      id: 'm5',
      chatId: '1',
      senderId: 'u3',
      sender: 'Emily Rodriguez',
      avatar: MOCK_SEARCHABLE_USERS[2].avatar,
      timestamp: '10:34',
      content:
        'Смотрится великолепно! Градиентные фоны — очень стильно. Не могу дождаться финала 🚀',
      isOwn: false,
    },
    {
      id: 'm6',
      chatId: '1',
      senderId: 'u1',
      sender: 'Sarah Chen',
      avatar: MOCK_SEARCHABLE_USERS[0].avatar,
      timestamp: '11:08',
      content:
        'Отлично! Запланировала ревью дизайна на завтра в 14:00. Скоро пришлю приглашения.',
      isOwn: false,
    },
  ],
  '2': [
    {
      id: 'm7',
      chatId: '2',
      senderId: 'u1',
      sender: 'Sarah Chen',
      avatar: MOCK_SEARCHABLE_USERS[0].avatar,
      timestamp: '14:00',
      content: 'Можем провести быстрый созвон?',
      isOwn: false,
    },
  ],
  '3': [
    {
      id: 'm8',
      chatId: '3',
      senderId: 'u2',
      sender: 'Marcus Johnson',
      avatar: MOCK_SEARCHABLE_USERS[1].avatar,
      timestamp: '13:15',
      content: 'Спасибо за фидбек!',
      isOwn: false,
    },
  ],
  '4': [],
};
