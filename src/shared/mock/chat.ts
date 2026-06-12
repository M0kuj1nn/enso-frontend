// WS: этот файл целиком заменится на реальные запросы к API
// Структура типов сохраняется — компоненты переписывать не придётся
import {
  Chat,
  ChatMessage,
  Relationship,
  Server,
  User,
} from '@shared/types/chat';

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

// Связи текущего пользователя с другими (дружба/заявки/блокировки).
// friends в ChatProvider вычисляется из этого списка + профилей пользователей.
export const MOCK_RELATIONSHIPS: Relationship[] = [
  {
    sender_id: 'me',
    receiver_id: MOCK_SEARCHABLE_USERS[0].id,
    status: 'accepted',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    sender_id: 'me',
    receiver_id: MOCK_SEARCHABLE_USERS[1].id,
    status: 'accepted',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    sender_id: 'me',
    receiver_id: MOCK_SEARCHABLE_USERS[2].id,
    status: 'accepted',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
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
  targetId: string,
  sender_id: string,
  sender: string,
  avatar: string,
  text: string,
  created_at: string,
  isOwn = false,
): ChatMessage => ({
  id,
  target_id: targetId,
  bucket: '2026-06', // TODO: подставить реальный год-месяц при подключении бэка
  sender_id,
  reply_to_id: null,
  text,
  is_pinned: false,
  media: [],
  reactions: [],
  created_at,
  updated_at: created_at,
  sender,
  avatar,
  isOwn,
});

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
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
  tc1: [
    msg(
      'tc1m1',
      'tc1',
      'u1',
      'Sarah Chen',
      MOCK_SEARCHABLE_USERS[0].avatar,
      'Всем привет! Добро пожаловать в Design Hub 🎨',
      '10:00',
    ),
    msg(
      'tc1m2',
      'tc1',
      'u2',
      'Marcus Johnson',
      MOCK_SEARCHABLE_USERS[1].avatar,
      'Рад быть здесь! Уже смотрю последние макеты.',
      '10:05',
    ),
    msg(
      'tc1m3',
      'tc1',
      'me',
      'You',
      CURRENT_USER.avatar,
      'Отличный канал! Давайте обсудим новый дизайн системы.',
      '10:10',
      true,
    ),
    msg(
      'tc1m4',
      'tc1',
      'u3',
      'Emily Rodriguez',
      MOCK_SEARCHABLE_USERS[2].avatar,
      'Я подготовила несколько вариантов цветовой палитры, скоро поделюсь.',
      '10:15',
    ),
  ],
  tc2: [
    msg(
      'tc2m1',
      'tc2',
      'u1',
      'Sarah Chen',
      MOCK_SEARCHABLE_USERS[0].avatar,
      'Выложила макеты для ревью. Жду комментарии!',
      '11:00',
    ),
    msg(
      'tc2m2',
      'tc2',
      'me',
      'You',
      CURRENT_USER.avatar,
      'Отступы на мобайле нужно поправить, остальное отлично.',
      '11:20',
      true,
    ),
    msg(
      'tc2m3',
      'tc2',
      'u1',
      'Sarah Chen',
      MOCK_SEARCHABLE_USERS[0].avatar,
      'Принято, исправлю сегодня вечером.',
      '11:25',
    ),
  ],
  tc3: [
    msg(
      'tc3m1',
      'tc3',
      'u2',
      'Marcus Johnson',
      MOCK_SEARCHABLE_USERS[1].avatar,
      'Полезные ресурсы по типографике: https://typescale.com',
      '9:00',
    ),
    msg(
      'tc3m2',
      'tc3',
      'u3',
      'Emily Rodriguez',
      MOCK_SEARCHABLE_USERS[2].avatar,
      'Добавляю сюда коллекцию иконок которыми пользуемся.',
      '9:30',
    ),
  ],

  // Каналы сервера s2 — Dev Team
  tc4: [
    msg(
      'tc4m1',
      'tc4',
      'u2',
      'Marcus Johnson',
      MOCK_SEARCHABLE_USERS[1].avatar,
      'Привет всем! Новый спринт начинается в понедельник.',
      '9:00',
    ),
    msg(
      'tc4m2',
      'tc4',
      'u4',
      'Alex Kim',
      MOCK_SEARCHABLE_USERS[3].avatar,
      'Задачи уже в Jira, можно начинать.',
      '9:15',
    ),
    msg(
      'tc4m3',
      'tc4',
      'me',
      'You',
      CURRENT_USER.avatar,
      'Взял задачу по рефакторингу авторизации.',
      '9:20',
      true,
    ),
  ],
  tc5: [
    msg(
      'tc5m1',
      'tc5',
      'u2',
      'Marcus Johnson',
      MOCK_SEARCHABLE_USERS[1].avatar,
      'Поднял новый эндпоинт для авторизации, можете тестить.',
      '14:00',
    ),
    msg(
      'tc5m2',
      'tc5',
      'u5',
      'Daniel Park',
      MOCK_SEARCHABLE_USERS[4].avatar,
      'Протестил — всё работает. Документацию добавил в Swagger.',
      '14:30',
    ),
  ],
  tc6: [
    msg(
      'tc6m1',
      'tc6',
      'me',
      'You',
      CURRENT_USER.avatar,
      'Переехали на App Router, старые страницы удалены.',
      '13:00',
      true,
    ),
    msg(
      'tc6m2',
      'tc6',
      'u4',
      'Alex Kim',
      MOCK_SEARCHABLE_USERS[3].avatar,
      'Хорошо, обновил зависимости под новую версию Next.js.',
      '13:20',
    ),
    msg(
      'tc6m3',
      'tc6',
      'u5',
      'Daniel Park',
      MOCK_SEARCHABLE_USERS[4].avatar,
      'Middleware тоже обновил, не забудьте запустить npm install.',
      '13:35',
    ),
  ],
};

export const MOCK_SERVERS: Server[] = [
  {
    id: 's1',
    name: 'Design Hub',
    topic: 'Всё про дизайн и UI/UX',
    icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    text_channels: [
      { id: 'tc1', serverId: 's1', name: 'общий' },
      { id: 'tc2', serverId: 's1', name: 'дизайн-ревью' },
      { id: 'tc3', serverId: 's1', name: 'ресурсы' },
    ],
    voice_channels: [
      {
        id: 'vc1',
        serverId: 's1',
        name: 'Войсчат',
        participants: [
          { userId: 'u1', isSpeaking: true },
          { userId: 'u2', isSpeaking: false },
          { userId: 'u3', isSpeaking: false },
        ],
      },
      {
        id: 'vc2',
        serverId: 's1',
        name: 'Стендап',
        participants: [{ userId: 'u2', isSpeaking: false }],
      },
    ],
    members: ['me', 'u1', 'u2', 'u3'],
    owner: 'me',
    invite_links: [],
  },
  {
    id: 's2',
    name: 'Dev Team',
    topic: 'Разработка и код',
    icon: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop',
    text_channels: [
      { id: 'tc4', serverId: 's2', name: 'общий' },
      { id: 'tc5', serverId: 's2', name: 'бэкенд' },
      { id: 'tc6', serverId: 's2', name: 'фронтенд' },
    ],
    voice_channels: [
      {
        id: 'vc3',
        serverId: 's2',
        name: 'Войсчат',
        participants: [
          { userId: 'u4', isSpeaking: false },
          { userId: 'u5', isSpeaking: true },
        ],
      },
    ],
    members: ['me', 'u2', 'u4', 'u5'],
    owner: 'u2',
    invite_links: [],
  },
];
