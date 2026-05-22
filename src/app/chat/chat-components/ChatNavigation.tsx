'use client';

import { FC, memo, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { Conditional } from '@components/Conditionals';
import { useChatContext } from '@contexts/ChatContext';
import { useDebounce } from '@shared/hooks/useDebounce';
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

// ChatItem
interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: (id: string) => void;
}

const ChatItem: FC<ChatItemProps> = memo(({ chat, isActive, onSelect }) => (
  <Button
    variantsUi={{ color: 'ghost' }}
    cn={[
      'w-full justify-start items-center gap-3 px-3 py-2.5 rounded-none relative',
      isActive && 'bg-gradient-to-r from-[#A74BE9]/20 to-[#A74BE9]/5',
    ]}
    onClick={() => onSelect(chat.id)}
  >
    <Conditional condition={isActive}>
      <Container className='absolute top-2 bottom-2 left-0 w-[3] rounded-r-full bg-linear-to-b from-[#DC52FF] to-[#8B10E3] p-0' />
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
        {chat.lastMessageSenderName
          ? `${chat.lastMessageSenderName}: ${chat.lastMessage}`
          : chat.lastMessage || 'Нет сообщений'}
      </Text>
    </Container>
  </Button>
));

ChatItem.displayName = 'ChatItem';

// NavStrip
// Крайняя левая колонка с Бургер меню, DM и серваками
interface NavStripProps {
  isPanelOpen: boolean;
  isMuted: boolean;
  currentUserAvatar: string;
  currentUserName: string;
  currentUserStatus: 'online' | 'away' | 'offline';
  onTogglePanel: () => void;
  onToggleMute: () => void;
  onDmClick: () => void;
}

const NavStrip: FC<NavStripProps> = memo(
  ({
    isPanelOpen,
    isMuted,
    currentUserAvatar,
    currentUserName,
    currentUserStatus,
    onTogglePanel,
    onToggleMute,
    onDmClick,
  }) => {
    const pathname = usePathname();
    const isDmActive = pathname.startsWith('/chat');

    return (
      <Container
        variantsUi={{ flow: 'col' }}
        className='h-full w-[62] shrink-0 gap-0 border-r border-white/5 bg-[#1a1a1f] p-0'
      >
        <Container
          variantsUi={{ flow: 'col' }}
          className='flex-1 gap-0 overflow-y-auto p-0'
        >
          {/* Бургер */}
          <Container className='h-16 items-center p-0 px-3'>
            <Button
              variantsUi={{ color: 'ghost', rounded: 'xl' }}
              className='h-10 w-10 p-0'
              title={isPanelOpen ? 'Свернуть панель' : 'Развернуть панель'}
              onClick={onTogglePanel}
            >
              <Menu className='h-5 w-5' />
            </Button>
          </Container>

          {/* DM */}
          <Container className='items-center p-0 px-3 py-3'>
            <Button
              variantsUi={{
                color: isDmActive ? 'primary' : 'ghost',
                rounded: 'xl',
              }}
              className='h-10 w-10 p-0'
              title='Direct Messages'
              onClick={onDmClick}
            >
              <User className='h-5 w-5' />
            </Button>
          </Container>

          {/* Разделитель */}
          <Container className='p-0 px-3'>
            <Container className='h-[1] w-full rounded-full bg-white/10 p-0' />
          </Container>

          {/* Серверы */}
          <Container className='p-0 px-3 pt-3'>
            <Button
              variantsUi={{ color: 'ghost', rounded: 'full' }}
              className='h-10 w-10 border border-dashed border-white/20 p-0'
              title='Добавить сервер'
            >
              <Plus className='h-5 w-5 text-[#969696]' />
            </Button>
          </Container>
        </Container>

        {/* Профиль — только когда NavPanel свёрнут */}
        {!isPanelOpen && (
          <Container className='gap-0 border-t border-white/5 p-2'>
            <Container
              variantsUi={{ rounded: 'md' }}
              className='w-full justify-between gap-2 bg-[#141418] p-2'
            >
              <Avatar
                src={currentUserAvatar}
                alt={currentUserName}
                size='xs'
                shape='circle'
                status={currentUserStatus}
              />
              <Button
                variantsUi={{ color: 'ghost', rounded: 'lg' }}
                cn={[
                  'p-1.5',
                  isMuted && 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
                ]}
                onClick={onToggleMute}
              >
                {isMuted ? (
                  <MicOff className='h-3.5 w-3.5' />
                ) : (
                  <Mic className='h-3.5 w-3.5' />
                )}
              </Button>
              <Button
                variantsUi={{ color: 'ghost', rounded: 'lg' }}
                className='p-1.5'
              >
                <Settings className='h-3.5 w-3.5' />
              </Button>
            </Container>
          </Container>
        )}
      </Container>
    );
  },
);

NavStrip.displayName = 'NavStrip';

NavStrip.displayName = 'NavStrip';

// NavPanel
// Раскрывающаяся панель: поиск, список чатов, полная панель пользователя

interface NavPanelProps {
  chats: Chat[];
  activeChatId: string;
  isMuted: boolean;
  currentUserAvatar: string;
  currentUserName: string;
  currentUserStatus: 'online' | 'away' | 'offline';
  currentUserTag: string;
  onSelect: (id: string) => void;
  onToggleMute: () => void;
  onNewChat: () => void;
}

const NavPanel: FC<NavPanelProps> = memo(
  ({
    chats,
    activeChatId,
    isMuted,
    currentUserAvatar,
    currentUserName,
    currentUserStatus,
    currentUserTag,
    onSelect,
    onToggleMute,
    onNewChat,
  }) => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const filtered = chats.filter((c) =>
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
    const groups = filtered.filter((c) => c.type === 'group');
    const dms = filtered.filter((c) => c.type === 'dm');

    return (
      <Container
        variantsUi={{ flow: 'col' }}
        className='h-full w-64 shrink-0 gap-0 border-r border-white/5 bg-[#141418] p-0'
      >
        {/* Заголовок */}
        <Container className='h-16 justify-between border-b border-white/5 py-4'>
          <Text variantsUi={{ weight: 'semibold' }}>Direct Messages</Text>
          <Button
            variantsUi={{ color: 'ghost', rounded: 'lg' }}
            className='p-1.5'
            title='Новый чат'
            onClick={onNewChat}
          >
            <MessageSquarePlus className='h-4 w-4' />
          </Button>
        </Container>

        {/* Поиск */}
        <Container className='border-b border-white/5 px-3 py-3'>
          <Container className='relative w-full p-0'>
            <Search className='pointer-events-none absolute top-1/2 right-6 z-10 h-4 w-4 -translate-y-1/2 text-[#969696]' />
            <Input
              variantsUi={{ style: 'search' }}
              placeholder='Поиск...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Container>
        </Container>

        {/* Список чатов */}
        <Container
          variantsUi={{ flow: 'col' }}
          className='flex-1 gap-3 overflow-y-auto p-3'
        >
          {/* Группы */}
          <Conditional condition={groups.length > 0}>
            <Container variantsUi={{ flow: 'col' }} className='gap-0 p-0 py-3'>
              <Text
                variantsUi={{ size: 'xs', color: 'muted' }}
                className='mb-2 px-4 font-semibold tracking-wider uppercase'
              >
                Группы
              </Text>
              {groups.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === activeChatId}
                  onSelect={onSelect}
                />
              ))}
            </Container>
          </Conditional>

          {/* Личные сообщения */}
          <Conditional condition={dms.length > 0}>
            <Container variantsUi={{ flow: 'col' }} className='gap-0 p-0 py-3'>
              <Text
                variantsUi={{ size: 'xs', color: 'muted' }}
                className='mb-2 px-4 font-semibold tracking-wider uppercase'
              >
                Личные сообщения
              </Text>
              {dms.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === activeChatId}
                  onSelect={onSelect}
                />
              ))}
            </Container>
          </Conditional>

          <Conditional condition={filtered.length === 0}>
            <Container
              variantsUi={{ items: 'centered' }}
              className='flex-1 py-8'
            >
              <Text variantsUi={{ size: 'sm', color: 'muted' }}>Нет чатов</Text>
            </Container>
          </Conditional>
        </Container>

        {/* Полная панель пользователя */}
        <Container className='gap-3 border-t border-white/5 px-4 py-3'>
          <Avatar
            src={currentUserAvatar}
            alt={currentUserName}
            size='md'
            shape='circle'
            status={currentUserStatus}
          />
          <Container
            variantsUi={{ flow: 'col' }}
            className='min-w-0 flex-1 gap-0 p-0'
          >
            <Text variantsUi={{ size: 'sm', weight: 'semibold' }}>
              {currentUserName}
            </Text>
            <Text variantsUi={{ size: 'xs', color: 'muted' }}>
              {currentUserTag}
            </Text>
          </Container>
          <Button
            variantsUi={{ color: 'ghost', rounded: 'lg' }}
            cn={[
              'p-1.5',
              isMuted && 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
            ]}
            onClick={onToggleMute}
          >
            {isMuted ? (
              <MicOff className='h-4 w-4' />
            ) : (
              <Mic className='h-4 w-4' />
            )}
          </Button>
          <Button
            variantsUi={{ color: 'ghost', rounded: 'lg' }}
            className='p-1.5'
          >
            <Settings className='h-4 w-4' />
          </Button>
        </Container>
      </Container>
    );
  },
);

NavPanel.displayName = 'NavPanel';

// ChatNavigation
// Композиция: только состояние и роутинг, никакого JSX кроме сборки частей

export const ChatNavigation: FC = () => {
  const { currentUser, chats } = useChatContext();
  const router = useRouter();
  const pathname = usePathname();

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  const activeChatId = pathname.startsWith('/chat/')
    ? pathname.split('/')[2]
    : '';

  const handleSelect = (id: string) => router.push(`/chat/${id}`);
  const handleDmClick = () => {
    if (!isPanelOpen) setIsPanelOpen(true);
    router.push('/chat');
  };

  return (
    <>
      <Container className='h-full shrink-0 gap-0 border-r border-white/5 p-0'>
        <NavStrip
          isPanelOpen={isPanelOpen}
          isMuted={isMuted}
          currentUserAvatar={currentUser.avatar}
          currentUserName={currentUser.name}
          currentUserStatus={currentUser.status}
          onTogglePanel={() => setIsPanelOpen((v) => !v)}
          onToggleMute={() => setIsMuted((v) => !v)}
          onDmClick={handleDmClick}
        />

        <Conditional condition={isPanelOpen}>
          <NavPanel
            chats={chats}
            activeChatId={activeChatId}
            isMuted={isMuted}
            currentUserAvatar={currentUser.avatar}
            currentUserName={currentUser.name}
            currentUserStatus={currentUser.status}
            currentUserTag={currentUser.username}
            onSelect={handleSelect}
            onToggleMute={() => setIsMuted((v) => !v)}
            onNewChat={() => setIsNewChatOpen(true)}
          />
        </Conditional>
      </Container>

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
