'use client';

import { FC, memo } from 'react';

import { usePathname } from 'next/navigation';

import { Server } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Menu, Plus, User } from 'lucide-react';

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
  onAddServerClick: () => void;
  servers: Server[];
  activeServerId: string;
  onServerClick: (serverId: string) => void;
}

export const NavStrip: FC<NavStripProps> = memo(
  ({
    isPanelOpen,
    isMuted,
    currentUserAvatar,
    currentUserName,
    currentUserStatus,
    onTogglePanel,
    onToggleMute,
    onDmClick,
    onAddServerClick,
    servers,
    activeServerId,
    onServerClick,
  }) => {
    const pathname = usePathname();
    const isDmActive = pathname.startsWith('/chat/@me');

    return (
      <Container
        variantsUi={{ flow: 'col', items: 'centered' }}
        className='h-full w-[70] shrink-0 gap-0 border-r border-white/5 bg-[#1a1a1f] p-0'
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
          {servers.map((server) => (
            <Container key={server.id} className='p-0 px-3 pt-3'>
              <Button
                variantsUi={{ color: 'ghost', rounded: 'full' }}
                className={`h-10 w-10 overflow-hidden border-2 p-0 transition-colors ${
                  activeServerId === server.id
                    ? 'border-[#A74BE9]'
                    : 'border-transparent'
                }`}
                title={server.name}
                onClick={() => onServerClick(server.id)}
              >
                <Avatar
                  src={server.icon}
                  alt={server.name}
                  size='sm'
                  shape='rounded'
                />
              </Button>
            </Container>
          ))}

          {/* Кнопка добавить сервер */}
          <Container className='p-0 px-3 pt-3'>
            <Button
              variantsUi={{ color: 'ghost', rounded: 'full' }}
              className='h-10 w-10 border border-dashed border-white/20 p-0'
              title='Добавить сервер'
              onClick={onAddServerClick}
            >
              <Plus className='h-5 w-5 text-[#969696]' />
            </Button>
          </Container>
        </Container>
      </Container>
    );
  },
);

NavStrip.displayName = 'NavStrip';
