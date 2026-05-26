// WS: этот файл целиком заменится на реальные запросы к API
// Структура типов сохраняется — компоненты переписывать не придётся
import { Chat, Friend, Message, User } from '@shared/types/chat';

export const CURRENT_USER: User = {
  id: 'me',
  username: '@abracadabra',
  name: 'MIDNIGHT',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  status: 'online',
};

// Пользователи для поиска при добавлении друга
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
    lastMessage:
      'Запланировала ревью дизайна на завтра в 14:00. Скоро пришлю приглашения.',
    lastMessageSenderName: 'Sarah',
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
    lastMessageSenderName: undefined,
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
    lastMessageSenderName: undefined,
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
    lastMessageSenderName: undefined,
    unread: 0,
    participantIds: ['me', 'u3'],
  },
];

// Хелпер для создания мок-сообщения
const msg = (
  id: string,
  chatId: string,
  sender_id: string,
  sender: string,
  avatar: string,
  text: string,
  created_at: string,
  isOwn = false,
): Message => ({
  id,
  text,
  sender_id,
  receiver_id: null,
  media_links: [],
  is_read: true,
  reactions: [],
  reply_to: null,
  created_at,
  updated_at: created_at,
  sender,
  avatar,
  isOwn,
});

export const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    msg(
      'm1',
      '1',
      'u1',
      'Sarah Chen',
      MOCK_SEARCHABLE_USERS[0].avatar,
      'Привет команда! Только что загрузила последние макеты. Жду фидбек до конца дня.',
      '9:23',
    ),
    msg(
      'm2',
      '1',
      'u2',
      'Marcus Johnson',
      MOCK_SEARCHABLE_USERS[1].avatar,
      'Выглядит отлично! Только вопрос — нужно ли скорректировать отступы на мобайле?',
      '9:45',
    ),
    msg(
      'm3',
      '1',
      'me',
      'You',
      CURRENT_USER.avatar,
      'Хорошее замечание! Внесу правки и выложу новую версию сегодня днём.',
      '10:12',
      true,
    ),
    msg(
      'm4',
      '1',
      'me',
      'You',
      CURRENT_USER.avatar,
      'Также работаю над мобильной адаптацией.',
      '10:12',
      true,
    ),
    msg(
      'm5',
      '1',
      'u3',
      'Emily Rodriguez',
      MOCK_SEARCHABLE_USERS[2].avatar,
      'Смотрится великолепно! Не могу дождаться финала 🚀',
      '10:34',
    ),
    msg(
      'm6',
      '1',
      'u1',
      'Sarah Chen',
      MOCK_SEARCHABLE_USERS[0].avatar,
      'Запланировала ревью дизайна на завтра в 14:00. Скоро пришлю приглашения.',
      '11:08',
    ),
  ],
  '2': [
    msg(
      'm7',
      '2',
      'u1',
      'Sarah Chen',
      MOCK_SEARCHABLE_USERS[0].avatar,
      'Можем провести быстрый созвон?',
      '14:00',
    ),
  ],
  '3': [
    msg(
      'm8',
      '3',
      'u2',
      'Marcus Johnson',
      MOCK_SEARCHABLE_USERS[1].avatar,
      'Спасибо за фидбек!',
      '13:15',
    ),
  ],
  '4': [],
};
