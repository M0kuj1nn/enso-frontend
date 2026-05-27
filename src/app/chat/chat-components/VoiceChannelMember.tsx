'use client';

import { FC, memo } from 'react';

import { User } from '@shared/types/chat';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';

interface VoiceChannelMemberProps {
  user: User;
  isSpeaking: boolean;
}

export const VoiceChannelMember: FC<VoiceChannelMemberProps> = memo(
  ({ user, isSpeaking }) => (
    <Container className='items-center gap-2 px-1 py-0.5'>
      <div className='relative shrink-0'>
        <img
          src={user.avatar}
          alt={user.name}
          className={[
            'h-5 w-5 rounded-full object-cover transition-all duration-200',
            isSpeaking
              ? 'ring-1 ring-emerald-400 ring-offset-1 ring-offset-[#141418]'
              : '',
          ].join(' ')}
        />
      </div>
      <Text variantsUi={{ size: 'xs', color: 'muted' }} className='truncate'>
        {user.name}
      </Text>
    </Container>
  ),
);

VoiceChannelMember.displayName = 'VoiceChannelMember';
