// ─── Базовые типы ────────────────────────────────────────────────────────────

export type ChatType = 'dm' | 'group';
export type UserStatus = 'online' | 'away' | 'offline';
export type FriendState = 'none' | 'pending_out' | 'pending_in' | 'friends';

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

export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  participantIds: string[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  isOwn?: boolean;
  // WS: добавить editedAt?, deletedAt? когда бэк будет готов
}

export interface Participant extends User {}

// ─── WS-события (готовы к подключению) ───────────────────────────────────────
// WS: эти типы понадобятся при подключении WebSocket
// ws.on('message', (event: WsChatEvent) => handleWsEvent(event))

export type WsChatEvent =
  | { type: 'MESSAGE_CREATED'; payload: Message }
  | { type: 'MESSAGE_UPDATED'; payload: Pick<Message, 'id' | 'content'> }
  | { type: 'MESSAGE_DELETED'; payload: { id: string; chatId: string } }
  | { type: 'FRIEND_REQUEST_SENT'; payload: Friend }
  | { type: 'FRIEND_REQUEST_ACCEPT'; payload: Friend }
  | { type: 'CHAT_CREATED'; payload: Chat }
  | {
      type: 'USER_STATUS_CHANGED';
      payload: { userId: string; status: UserStatus };
    };
