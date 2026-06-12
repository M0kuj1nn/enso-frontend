'use client';

import { FC, memo } from 'react';

import { Conditional } from '@components/Conditionals';
import { Chat } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Badge } from '@ui/Badge';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';

// ChatItem
interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export const ChatItem: FC<ChatItemProps> = memo(
  ({ chat, isActive, onSelect }) => (
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
  ),
);

ChatItem.displayName = 'ChatItem';
