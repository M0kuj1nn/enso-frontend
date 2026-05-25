import { User } from '@shared/types/user';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

type MockUser = User & { email: string; password: string };

const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    name: 'JonSnow',
    email: 'jonsnow@email.com',
    password: 'YouKnowNothingJonSnow789',
    username: '@jonsnow',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    status: 'online',
  },
];

export const loginRequest = async (data: LoginData): Promise<User> => {
  await new Promise((r) => setTimeout(r, 1000));
  const user = MOCK_USERS.find(
    (u) => u.email === data.email && u.password === data.password,
  );
  if (!user) throw new Error('Неверный email или пароль');
  const { email, password, ...userData } = user;
  return userData;
};

export const registerRequest = async (data: RegisterData): Promise<User> => {
  await new Promise((r) => setTimeout(r, 1000));
  const exists = MOCK_USERS.some((u) => u.email === data.email);
  if (exists) throw new Error('Пользователь с таким email уже существует');
  const newUser: MockUser = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    password: data.password,
    username: `@${data.name.toLowerCase().replace(/\s/g, '')}`,
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    status: 'online',
  };
  MOCK_USERS.push(newUser);
  const { email, password, ...userData } = newUser;
  return userData;
};
