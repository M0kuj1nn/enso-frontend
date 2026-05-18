'use client';

import { FC } from 'react';

import { Chat, Participant } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { MoreVertical, Search, Users } from 'lucide-react';

interface ChatHeaderProps {
  chat: Chat;
  participants: Participant[];
  onOpenDetails: () => void;
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  chat,
  participants,
  onOpenDetails,
}) => (
  <Container
    as='header'
    cn='h-16 border-b border-white/5 px-4 gap-3 flex-shrink-0 bg-[#1a1a1f] cursor-pointer group transition-colors hover:bg-white/5 p-0 px-4'
    onClick={onOpenDetails}
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
        cn='p-2'
        onClick={(e) => e.stopPropagation()}
      >
        <Search className='h-5 w-5' />
      </Button>
      <Button
        variantsUi={{ color: 'ghost', rounded: 'lg' }}
        cn='p-2'
        onClick={(e) => e.stopPropagation()}
      >
        <MoreVertical className='h-5 w-5' />
      </Button>
    </Container>
  </Container>
);
