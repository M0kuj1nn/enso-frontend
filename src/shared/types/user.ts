export type UserStatus = 'online' | 'away' | 'offline';

export interface User {
  id: string;
  username: string; //(@username)
  name: string;
  avatar: string;
  status: UserStatus;
}
