// Базовые типы
export type ChatType = 'dm' | 'group';
export type UserStatus = 'online' | 'away' | 'offline';
export type FriendState = 'none' | 'pending_out' | 'pending_in' | 'friends';

// Пользователь
export interface User {
  id: string;
  username: string; // уникальный тег (@username)
  name: string;
  avatar: string;
  status: UserStatus;
}

export interface Friend extends User {
  friendState: FriendState;
}

export interface Participant extends User {}

// Реакция на сообщение
export interface Reaction {
  emoji: string;
  count: number;
  user_ids: string[];
}

// Сообщение
export interface Message {
  // Поля от бэка
  id: string;
  text: string;
  sender_id: string;
  receiver_id: string | null; // null для групповых чатов
  media_links: string[]; // вложения
  is_read: boolean;
  reactions: Reaction[];
  reply_to: string | null; // id сообщения на которое отвечаем
  created_at: string; // ISO дата или HH:mm для мока
  updated_at: string;

  // WS: эти поля заполнять из usersCache по sender_id
  sender: string; // display name
  avatar: string; // url аватара
  isOwn?: boolean; // вычисляется на фронте: sender_id === currentUser.id
}

// Чат
export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageSenderName?: string; // <- добавить. "Вы" / "Кто-то" / undefined
  unread: number;
  participantIds: string[];
}

// Серверная часть (будет нужна для вкладки серверов)
export interface TextChannel {
  id: string;
  name: string;
  messages: Message[];
}

export interface Server {
  id: string;
  name: string;
  text_channels: TextChannel[];
  voice_channels: VoiceChannel[];
  members: string[]; // user ids
  owner: string; // user id
  invite_links: string[];
}

export interface VoiceChannel {
  id: string;
  name: string;
}

export interface Role {
  user_id: string;
  permissions_bitmap: number; // битовая маска прав
  color: string;
}

// WS-события
// WS: ws.on('message', (event: WsChatEvent) => dispatch(event))

export type WsChatEvent =
  | { type: 'MESSAGE_CREATED'; payload: Message }
  | {
      type: 'MESSAGE_UPDATED';
      payload: Pick<Message, 'id' | 'text' | 'updated_at'>;
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
