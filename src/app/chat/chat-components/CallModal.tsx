'use client';

import { FC } from 'react';

import { useRouter } from 'next/navigation';

import { Chat } from '@shared/types/chat';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { Phone, PhoneOff } from 'lucide-react';

interface CallModalProps {
  chat: Chat;
  onClose: () => void;
}

export const CallModal: FC<CallModalProps> = ({ chat, onClose }) => {
  const router = useRouter();

  const handleCall = () => {
    onClose();
    router.push(`/chat/me/${chat.id}/call`);
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
      onClick={onClose}
    >
      <Container
        variantsUi={{ flow: 'col' }}
        className='items-center gap-6 rounded-3xl bg-[#1e1e24] p-8 shadow-2xl ring-1 ring-white/10'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='h-20 w-20 overflow-hidden rounded-full ring-4 ring-[#A74BE9]/40'>
          <img
            src={chat.avatar}
            alt={chat.name}
            className='h-full w-full object-cover'
          />
        </div>

        <Container
          variantsUi={{ flow: 'col' }}
          className='items-center gap-1 p-0'
        >
          <Text variantsUi={{ size: 'lg', weight: 'semibold' }}>
            {chat.name}
          </Text>
          <Text variantsUi={{ size: 'sm', color: 'muted' }}>
            Начать видеозвонок?
          </Text>
        </Container>

        <Container className='gap-4 p-0'>
          <Button
            variantsUi={{ color: 'ghost', rounded: 'full' }}
            className='h-14 w-14 bg-white/10 p-0 hover:bg-white/20'
            title='Отмена'
            onClick={onClose}
          >
            <PhoneOff className='h-6 w-6' />
          </Button>

          <Button
            variantsUi={{ color: 'ghost', rounded: 'full' }}
            className='h-14 w-14 bg-emerald-500 p-0 hover:bg-emerald-400'
            title='Позвонить'
            onClick={handleCall}
          >
            <Phone className='h-6 w-6' />
          </Button>
        </Container>
      </Container>
    </div>
  );
};
