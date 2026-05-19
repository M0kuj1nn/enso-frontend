'use client';

import { FC, memo } from 'react';

import { useChatDetailsContext } from '@contexts/ChatDetailsContext';
import { Chat, Participant } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { MoreVertical, Search, Users } from 'lucide-react';

interface ChatHeaderProps {
  chat: Chat;
  participants: Participant[];
}

export const ChatHeader: FC<ChatHeaderProps> = memo(
  ({ chat, participants }) => {
    // onOpenDetails больше не проп — берём из контекста
    const { openDetails } = useChatDetailsContext();

    return (
      <Container
        as='header'
        className='group h-16 shrink-0 cursor-pointer gap-3 border-b border-white/5 bg-[#1a1a1f] px-4 transition-colors hover:bg-white/5'
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
            <Users className='h-3 w-3 text-[#969696]' />
            <Text variantsUi={{ size: 'xs', color: 'muted' }}>
              {participants.length} участников
            </Text>
          </Container>
        </Container>

        <Container className='gap-1 p-0'>
          <Button
            variantsUi={{ color: 'ghost', rounded: 'lg' }}
            className='p-2'
            onClick={(e) => e.stopPropagation()}
          >
            <Search className='h-5 w-5' />
          </Button>
          <Button
            variantsUi={{ color: 'ghost', rounded: 'lg' }}
            className='p-2'
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className='h-5 w-5' />
          </Button>
        </Container>
      </Container>
    );
  },
);

ChatHeader.displayName = 'ChatHeader';
