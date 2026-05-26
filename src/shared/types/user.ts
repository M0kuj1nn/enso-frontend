export type UserStatus = 'online' | 'away' | 'offline';

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  status: UserStatus;
}
