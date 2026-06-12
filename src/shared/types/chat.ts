// Базовые типы
import type { User, UserStatus } from '@shared/types/user';

export type { User, UserStatus };
//#TODO:убрать export type { User, UserStatus }
//поправить импорты в других местах где используется User и UserStatus в /chat

export type ChatType = 'dm' | 'group';

// Файл — общая схема вложений/аватаров/баннеров с бэка.
// Назван FileAsset, а не File, т.к. File - встроенный тип браузера (input type="file")
export interface FileAsset {
  url: string;
  name: string;
  sizeb: number;
  type: string;
  created_at: string;
  updated_at: string;
}

// Связь между пользователями: заявка в друзья / дружба / блокировка
export interface Relationship {
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'blocked' | 'accepted';
  created_at: string;
  updated_at: string;
}

// UI-статус дружбы относительно текущего пользователя.
// Вычисляется на фронте из Relationship + currentUser.id, бэк это поле не отдаёт.
export type FriendState =
  | 'none'
  | 'pending_out'
  | 'pending_in'
  | 'friends'
  | 'blocked';

export interface Friend extends User {
  friendState: FriendState;
}

export interface Participant extends User {}

// Историческое событие реакции (лог изменений, приходит по WS)
export interface ReactionEvent {
  id: string;
  message_id: string;
  sequence_number: string;
  event_type: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

// Текущее агрегированное состояние реакции - то, что показывается под сообщением
export interface Reaction {
  id: string;
  message_id: string;
  emoji: string;
  count: number;
  last_sequence_number: string;
}

// Сообщение — форма, в которой оно приходит с бэка
export interface Message {
  id: string;
  target_id: string; // id канала или группы, в которую отправлено сообщение
  bucket: string; // дата-бакет для постраничной подгрузки (например, "2026-06")
  sender_id: string;
  reply_to_id: string | null;
  text: string;
  is_pinned: boolean;
  media: FileAsset[];
  created_at: string;
  updated_at: string;
}

// Сообщение для отображения в чате: Message + поля, "обогащённые" из usersCache
export interface ChatMessage extends Message {
  // WS: эти поля заполнять из usersCache по sender_id
  sender: string; // display name отправителя
  avatar: string; // url аватара отправителя
  isOwn?: boolean; // вычисляется на фронте: sender_id === currentUser.id
  reactions?: Reaction[];
}

// Группа — то, что приходит с бэка.
// И личные переписки (DM), и групповые чаты на бэке - это Group.
export interface Group {
  id: string;
  name: string;
  picture: FileAsset;
  banner: FileAsset;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// Участник группы - персональные данные о прочтении для текущего пользователя
export interface GroupMember {
  group_id: string;
  user_id: string;
  last_read_message_id: string;
  last_read_at: string;
  unread_count: number;
}

// Чат - элемент списка чатов слева (UI-вид).
// Собирается из Group + GroupMember (unread) + последнего сообщения.
//
// type вычисляется на фронте по числу участников:
//   1-2 участника -> 'dm'    (личные сообщения)
//   3+ участника  -> 'group' (групповой чат)
// От этого зависит, например, какие пункты показывать в меню ChatHeader
// ("Выйти из группы" - только для group).
export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageSenderName?: string; // "Вы" / "Кто-то" / undefined
  unread: number;
  participantIds: string[];
}

// Серверная часть (будет нужна для вкладки серверов)
export interface TextChannel {
  id: string;
  serverId: string;
  name: string;
}

//#TODO: меняем
export interface Server {
  id: string;
  name: string;
  topic: string;
  icon: string;
  text_channels: TextChannel[];
  voice_channels: VoiceChannel[];
  members: string[]; // user ids
  owner: string; // user id
  invite_links: string[];
}

export interface VoiceParticipant {
  userId: string;
  isSpeaking: boolean;
}

export interface VoiceChannel {
  id: string;
  serverId: string;
  name: string;
  participants: VoiceParticipant[];
}

//#TODO: мб убрать
export interface Role {
  user_id: string;
  permissions_bitmap: number; // битовая маска прав
  color: string;
}

// Памятка для серверной части (новые схемы с бэка, когда дойдёт очередь):
//
// Server:
//   id: uuid, name: str, theme: str, picture: File, banner: File,
//   owner_id: uuid, created_at: date, updated_at: date
//
// Channel:
//   id: uuid, name: str, server_id: uuid, namespace_name: str, type: 'text' | 'voice'

// WS-события
// WS: ws.on('message', (event: WsChatEvent) => dispatch(event))
// TODO: формат WS-событий не сверен с протоколом - пересмотрим отдельно
export type WsChatEvent =
  | { type: 'MESSAGE_CREATED'; payload: ChatMessage }
  | {
      type: 'MESSAGE_UPDATED';
      payload: Pick<ChatMessage, 'id' | 'text' | 'updated_at'>;
    }
  | { type: 'MESSAGE_DELETED'; payload: { id: string } }
  | {
      type: 'REACTION_ADDED';
      payload: { message_id: string; reaction: Reaction };
    }
  | {
      type: 'REACTION_REMOVED';
      payload: { message_id: string; emoji: string; user_id: string };
    }
  | { type: 'FRIEND_REQUEST_SENT'; payload: Friend }
  | { type: 'FRIEND_REQUEST_ACCEPT'; payload: Friend }
  | { type: 'CHAT_CREATED'; payload: Chat }
  | {
      type: 'USER_STATUS_CHANGED';
      payload: { userId: string; status: UserStatus };
    }
  | {
      type: 'MESSAGE_READ';
      payload: { message_id: string; reader_id: string };
    };
