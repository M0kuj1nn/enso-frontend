'use client';

import { FC, memo, useRef, useState } from 'react';

import { Conditional } from '@components/Conditionals';
import { useChatDetailsContext } from '@contexts/ChatDetailsContext';
import { useClickOutside } from '@shared/hooks/useClickOutside';
import { Chat, Participant } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import {
  BarChart3,
  BellOff,
  LogOut,
  MoreVertical,
  Search,
  Users2,
} from 'lucide-react';

// ChatMenu ("Подробнее")

const MENU_ITEMS = [
  { icon: BellOff, label: 'Выключить уведомления' },
  { icon: Users2, label: 'Управление группой' },
  { icon: BarChart3, label: 'Создать опрос' },
] as const;

interface ChatMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatMenu: FC<ChatMenuProps> = ({ isOpen, onClose }) => (
  <Conditional condition={isOpen}>
    {/*
      stopPropagation на контейнере меню:
      любой клик внутри меню не дойдёт до onClick={openDetails} на шапке
    */}
    <Container
      variantsUi={{ flow: 'col', style: 'whiteglass' }}
      className='absolute top-full right-0 z-50 mt-1 w-56 gap-0 overflow-hidden rounded-2xl bg-[#25252c]/95 p-1'
      onClick={(e) => e.stopPropagation()}
    >
      {MENU_ITEMS.map(({ icon: Icon, label }) => (
        <Button
          key={label}
          variantsUi={{ color: 'ghost', rounded: 'xl' }}
          className='w-full justify-start gap-3 px-4 py-2.5 hover:bg-white/10'
          onClick={onClose}
        >
          <Icon className='h-4 w-4 shrink-0 text-gray-400' />
          <Text variantsUi={{ size: 'sm' }}>{label}</Text>
        </Button>
      ))}

      <Container className='my-1 h-px bg-white/10 p-0' />

      <Button
        variantsUi={{ color: 'ghost', rounded: 'xl' }}
        className='group w-full justify-start gap-3 px-4 py-2.5 hover:bg-red-500/15'
        onClick={onClose}
      >
        <LogOut className='h-4 w-4 shrink-0 text-red-500 group-hover:text-red-400' />
        <Text
          variantsUi={{ size: 'sm' }}
          className='text-red-500 group-hover:text-red-400'
        >
          Выйти из группы
        </Text>
      </Button>
    </Container>
  </Conditional>
);

// ChatHeader

interface ChatHeaderProps {
  chat: Chat;
  participants: Participant[];
}

export const ChatHeader: FC<ChatHeaderProps> = memo(
  ({ chat, participants }) => {
    const { openDetails, openSearch } = useChatDetailsContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // ref на враппер кнопки "Подробнее" + выпадающее меню
    const menuWrapperRef = useRef<HTMLDivElement>(null);

    // Закрываем по клику вне враппера (не используем fixed backdrop!)
    useClickOutside(menuWrapperRef, () => setIsMenuOpen(false), isMenuOpen);

    return (
      <Container className='w-full shrink-0 p-0 px-6 py-3'>
        <Container
          as='header'
          variantsUi={{ style: 'whiteglass', rounded: 'full' }}
          className='group w-full cursor-pointer gap-3 bg-[#25252c]/80 px-4 py-2'
          onClick={openDetails}
        >
          <Avatar src={chat.avatar} alt={chat.name} size='md' shape='rounded' />

          <Container variantsUi={{ flow: 'col' }} className='flex-1 gap-0 p-0'>
            <Text
              variantsUi={{ weight: 'semibold' }}
              className='transition-colors group-hover:text-[#A74BE9]'
            >
              {chat.name}
            </Text>
            <Container className='gap-1.5 p-0'>
              <Users2 className='h-3 w-3 text-[#969696]' />
              <Text variantsUi={{ size: 'xs', color: 'muted' }}>
                {participants.length} участников
              </Text>
            </Container>
          </Container>

          <Container className='gap-1 p-0'>
            {/* Поиск */}
            <Button
              variantsUi={{ color: 'ghost', rounded: 'lg' }}
              className='p-2'
              onClick={(e) => {
                e.stopPropagation();
                openSearch();
              }}
            >
              <Search className='h-5 w-5' />
            </Button>

            {/*
            "Подробнее" — враппер содержит и кнопку и меню.
            stopPropagation на уровне враппера блокирует всплытие
            к onClick={openDetails} для любого клика внутри.
          */}
            <Container
              ref={menuWrapperRef}
              className='relative p-0'
              onClick={(e) => e.stopPropagation()}
            >
              <ChatMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
              />
              <Button
                variantsUi={{ color: 'ghost', rounded: 'lg' }}
                className='p-2'
                title='Подробнее'
                onClick={() => setIsMenuOpen((v) => !v)}
              >
                <MoreVertical className='h-5 w-5' />
              </Button>
            </Container>
          </Container>
        </Container>
      </Container>
    );
  },
);

ChatHeader.displayName = 'ChatHeader';
