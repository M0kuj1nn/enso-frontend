'use client';

import { FC, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { Conditional } from '@components/Conditionals';
import { useChatContext } from '@contexts/ChatContext';
import { Chat } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Badge } from '@ui/Badge';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Input } from '@ui/Input';
import { Text } from '@ui/typography/Text';
import {
  Menu,
  MessageSquarePlus,
  Mic,
  MicOff,
  Plus,
  Search,
  Settings,
  User,
} from 'lucide-react';

import { AddFriendModal } from './AddFriendModal';
import { NewChatModal } from './NewChatModal';

// ─── ChatItem в списке ────────────────────────────────────────────────────────

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: (id: string) => void;
}

const ChatItem: FC<ChatItemProps> = ({ chat, isActive, onSelect }) => (
  <Button
    variantsUi={{ color: 'ghost' }}
    cn={[
      'w-full justify-start items-center gap-3 px-3 py-2.5 rounded-none relative',
      isActive &&
        'bg-gradient-to-r from-[#A74BE9]/20 to-[#A74BE9]/5 text-white',
    ]}
    onClick={() => onSelect(chat.id)}
  >
    <Conditional condition={isActive}>
      <Container className='absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-[#DC52FF] to-[#8B10E3] p-0' />
    </Conditional>

    <Avatar
      src={chat.avatar}
      alt={chat.name}
      size='md'
      shape='rounded'
      status={chat.type === 'dm' ? 'online' : undefined}
    />

    <Container
      variantsUi={{ flow: 'col' }}
      className='min-w-0 flex-1 gap-0.5 p-0'
    >
      <Container className='items-center justify-between gap-2 p-0'>
        <Text
          variantsUi={{ size: 'sm', weight: 'medium' }}
          className={isActive ? 'text-white' : 'text-gray-300'}
        >
          {chat.name}
        </Text>
        <Badge count={chat.unread} />
      </Container>
      <Text
        as='p'
        variantsUi={{ size: 'xs', color: 'muted' }}
        className='truncate text-left leading-tight'
      >
        {chat.lastMessage || 'Нет сообщений'}
      </Text>
    </Container>
  </Button>
);

// ─── ChatNavigation ───────────────────────────────────────────────────────────

export const ChatNavigation: FC = () => {
  const { currentUser, chats } = useChatContext();
  const router = useRouter();
  const pathname = usePathname();

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  const activeChatId = pathname.startsWith('/chat/')
    ? pathname.split('/')[2]
    : '';
  const handleSelect = (id: string) => router.push(`/chat/${id}`);

  const filtered = chats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Container className='h-full flex-shrink-0 gap-0 border-r border-white/5 p-0'>
        {/* ── Левая полоска (всегда видна) ── */}
        <Container
          variantsUi={{ flow: 'col' }}
          className='h-full w-[62px] flex-shrink-0 gap-0 border-r border-white/5 bg-[#1a1a1f] p-0'
        >
          <Container
            variantsUi={{ flow: 'col' }}
            className='flex-1 gap-0 overflow-y-auto p-0 py-3'
          >
            {/* Бургер — Expand Panel */}
            <Container className='p-0 px-3 pb-2'>
              <Button
                variantsUi={{ color: 'ghost', rounded: 'xl' }}
                cn='w-10 h-10 p-0'
                title='Expand Panel'
                onClick={() => setIsPanelOpen((v) => !v)}
              >
                <Menu className='h-5 w-5' />
              </Button>
            </Container>

            {/* DM — Direct Messages */}
            <Container className='p-0 px-3 pb-2'>
              <Button
                variantsUi={{
                  color: pathname.startsWith('/chat') ? 'primary' : 'ghost',
                  rounded: 'xl',
                }}
                cn='w-10 h-10 p-0'
                title='Direct Messages'
                onClick={() => {
                  if (!isPanelOpen) setIsPanelOpen(true);
                  router.push('/chat');
                }}
              >
                <User className='h-5 w-5' />
              </Button>
            </Container>

            {/* Разделитель */}
            <Container className='p-0 px-3 py-2'>
              <Container className='h-[1px] w-8 rounded-full bg-white/10 p-0' />
            </Container>

            {/* Серверы (заглушка: у нового пользователя — кнопка Add Server) */}
            <Container className='p-0 px-3'>
              <Button
                variantsUi={{ color: 'ghost', rounded: 'full' }}
                cn='w-10 h-10 p-0 border border-dashed border-white/20'
                title='Добавить сервер'
              >
                <Plus className='h-5 w-5 text-[#969696]' />
              </Button>
            </Container>
          </Container>

          {/* Нижняя панель — аватар пользователя */}
          <Container className='gap-0 border-t border-white/5 p-0 p-2'>
            <Container
              variantsUi={{ rounded: 'md' }}
              className='w-full justify-between gap-2 bg-[#141418] p-2'
            >
              <Avatar
                src={currentUser.avatar}
                alt={currentUser.name}
                size='xs'
                shape='circle'
                status={currentUser.status}
              />
              <Button
                variantsUi={{ color: 'ghost', rounded: 'lg' }}
                cn={[
                  'p-1.5',
                  isMuted && 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
                ]}
                onClick={() => setIsMuted((v) => !v)}
              >
                <MicOff className='h-3.5 w-3.5' />
              </Button>
              <Button variantsUi={{ color: 'ghost', rounded: 'lg' }} cn='p-1.5'>
                <Settings className='h-3.5 w-3.5' />
              </Button>
            </Container>
          </Container>
        </Container>

        {/* ── Раскрывающаяся панель DM ── */}
        <Conditional condition={isPanelOpen}>
          <Container
            variantsUi={{ flow: 'col' }}
            className='h-full w-64 flex-shrink-0 gap-0 border-r border-white/5 bg-[#141418] p-0'
          >
            {/* Заголовок */}
            <Container className='justify-between border-b border-white/5 p-0 px-4 py-4'>
              <Text variantsUi={{ weight: 'semibold' }}>Direct Messages</Text>
              <Button
                variantsUi={{ color: 'ghost', rounded: 'lg' }}
                cn='p-1.5'
                title='Новый чат'
                onClick={() => setIsNewChatOpen(true)}
              >
                <MessageSquarePlus className='h-4 w-4' />
              </Button>
            </Container>

            {/* Поиск */}
            <Container className='relative border-b border-white/5 p-0 px-3 py-3'>
              <Search className='pointer-events-none absolute top-1/2 left-6 z-10 h-4 w-4 -translate-y-1/2 text-[#969696]' />
              <Input
                variantsUi={{ style: 'search' }}
                placeholder='Поиск...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Container>

            {/* Список чатов */}
            <Container
              variantsUi={{ flow: 'col' }}
              className='flex-1 gap-0 overflow-y-auto p-0'
            >
              {filtered.length > 0 ? (
                filtered.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onSelect={handleSelect}
                  />
                ))
              ) : (
                <Container
                  variantsUi={{ items: 'centered' }}
                  className='flex-1 p-0 py-8'
                >
                  <Text variantsUi={{ size: 'sm', color: 'muted' }}>
                    Нет чатов
                  </Text>
                </Container>
              )}
            </Container>

            {/* Нижняя панель — пользователь */}
            <Container className='gap-3 border-t border-white/5 p-0 px-4 py-3'>
              <Avatar
                src={currentUser.avatar}
                alt={currentUser.name}
                size='md'
                shape='circle'
                status={currentUser.status}
              />
              <Container
                variantsUi={{ flow: 'col' }}
                className='min-w-0 flex-1 gap-0 p-0'
              >
                <Text variantsUi={{ size: 'sm', weight: 'semibold' }}>
                  {currentUser.name}
                </Text>
                <Text variantsUi={{ size: 'xs', color: 'muted' }}>
                  {currentUser.username}
                </Text>
              </Container>
              <Button
                variantsUi={{ color: 'ghost', rounded: 'lg' }}
                cn={[
                  'p-1.5',
                  isMuted && 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
                ]}
                onClick={() => setIsMuted((v) => !v)}
              >
                {isMuted ? (
                  <MicOff className='h-4 w-4' />
                ) : (
                  <Mic className='h-4 w-4' />
                )}
              </Button>
              <Button variantsUi={{ color: 'ghost', rounded: 'lg' }} cn='p-1.5'>
                <Settings className='h-4 w-4' />
              </Button>
            </Container>
          </Container>
        </Conditional>
      </Container>

      {/* Модалки */}
      <AddFriendModal
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
      />
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onCreated={(id) => router.push(`/chat/${id}`)}
      />
    </>
  );
};
