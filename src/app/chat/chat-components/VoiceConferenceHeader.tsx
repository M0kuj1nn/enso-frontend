'use client';

import { FC, memo } from 'react';

import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { PhoneOff } from 'lucide-react';

interface VoiceConferenceHeaderProps {
  channelName: string;
  participantCount: number;
  onLeave: () => void;
}

export const VoiceConferenceHeader: FC<VoiceConferenceHeaderProps> = memo(
  ({ channelName, participantCount }) => (
    <Container className='w-full shrink-0 p-0 px-6 py-3'>
      <Container
        variantsUi={{ style: 'whiteglass', rounded: 'full', items: 'centered' }}
        className='w-full gap-3 bg-[#25252c]/80 px-4 py-2'
      >
        {/* Мигающий зелёный кружок */}
        <span className='relative flex h-3 w-3 shrink-0'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60' />
          <span className='relative inline-flex h-3 w-3 rounded-full bg-emerald-400' />
        </span>

        <Container variantsUi={{ flow: 'col' }} className='flex-1 gap-0 p-0'>
          <Text variantsUi={{ weight: 'semibold' }}>{channelName}</Text>
          <Text variantsUi={{ size: 'xs', color: 'muted' }}>
            {participantCount} участников
          </Text>
        </Container>
      </Container>
    </Container>
  ),
);

VoiceConferenceHeader.displayName = 'VoiceConferenceHeader';
