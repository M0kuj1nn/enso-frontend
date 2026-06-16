'use client';

import { FC, memo, useState } from 'react';

import { Conditional } from '@components/Conditionals';
import { useDebounce } from '@shared/hooks/useDebounce';
import { Chat } from '@shared/types/chat';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Input } from '@ui/Input';
import { Text } from '@ui/typography/Text';
import { MessageSquarePlus, Search } from 'lucide-react';

import { ChatItem } from './ChatItem';

// NavPanel
// Раскрывающаяся панель: поиск, список чатов

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

export const NavPanel: FC<NavPanelProps> = memo(
  ({ chats, activeChatId, onSelect, onNewChat }) => {
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
      </Container>
    );
  },
);

NavPanel.displayName = 'NavPanel';
