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
    const { openDetails } = useChatDetailsContext();

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
      </Container>
    );
  },
);

ChatHeader.displayName = 'ChatHeader';
