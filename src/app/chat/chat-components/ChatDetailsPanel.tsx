'use client';

import { FC } from 'react';

import { Conditional } from '@components/Conditionals';
import { Chat, Participant } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { Bell, Settings, X } from 'lucide-react';

interface ChatDetailsPanelProps {
  isOpen: boolean;
  chat: Chat;
  participants: Participant[];
  onClose: () => void;
}

const ACTIONS = [
  { icon: Bell, label: 'Уведомления' },
  { icon: Settings, label: 'Настройки чата' },
] as const;

export const ChatDetailsPanel: FC<ChatDetailsPanelProps> = ({
  isOpen,
  chat,
  participants,
  onClose,
}) => (
  <Conditional condition={isOpen}>
    <>
      <Container
        className='absolute inset-0 z-40 bg-black/40 p-0'
        onClick={onClose}
      />

      <Container
        variantsUi={{ flow: 'col' }}
        className='absolute top-0 right-0 bottom-0 z-50 w-80 gap-0 overflow-y-auto border-l border-white/10 bg-[#1a1a1f] p-0'
      >
        {/* Шапка */}
        <Container cn='sticky top-0 bg-[#1a1a1f]/95 border-b border-white/10 px-5 py-4 justify-between flex-shrink-0 p-0 px-5 py-4'>
          <Text variantsUi={{ weight: 'semibold' }}>Информация</Text>
          <Button
            variantsUi={{ color: 'ghost', rounded: 'lg' }}
            cn='p-1.5'
            onClick={onClose}
          >
            <X className='h-5 w-5' />
          </Button>
        </Container>

        {/* Инфо о чате */}
        <Container
          variantsUi={{ flow: 'col', items: 'centered' }}
          cn='px-5 py-6 border-b border-white/5 p-0 px-5 py-6'
        >
          <img
            src={chat.avatar}
            alt={chat.name}
            className='mb-3 h-20 w-20 rounded-2xl object-cover'
          />
          <Text
            variantsUi={{ size: 'lg', weight: 'semibold' }}
            className='mb-1'
          >
            {chat.name}
          </Text>
          <Text variantsUi={{ size: 'sm', color: 'muted' }}>
            {participants.length} участников
          </Text>
        </Container>

        {/* Участники */}
        <Container
          variantsUi={{ flow: 'col' }}
          cn='px-4 py-4 border-b border-white/5 p-0 px-4 py-4 gap-3'
        >
          <Text
            variantsUi={{ size: 'xs', color: 'muted' }}
            className='px-1 font-semibold tracking-wider uppercase'
          >
            Участники
          </Text>
          {participants.map((p) => (
            <Container
              key={p.id}
              cn='gap-3 px-1 py-1.5 rounded-xl hover:bg-white/5 transition-colors p-0 px-1 py-1.5'
            >
              <Avatar
                src={p.avatar}
                alt={p.name}
                size='md'
                shape='rounded'
                status={p.status}
              />
              <Container
                variantsUi={{ flow: 'col' }}
                className='flex-1 gap-0 p-0'
              >
                <Text variantsUi={{ size: 'sm', weight: 'medium' }}>
                  {p.name}
                </Text>
                <Text variantsUi={{ size: 'xs', color: 'muted' }}>
                  {p.status}
                </Text>
              </Container>
            </Container>
          ))}
        </Container>

        {/* Настройки */}
        <Container
          variantsUi={{ flow: 'col' }}
          cn='px-4 py-4 p-0 px-4 py-4 gap-2'
        >
          <Text
            variantsUi={{ size: 'xs', color: 'muted' }}
            className='px-1 font-semibold tracking-wider uppercase'
          >
            Настройки
          </Text>
          {ACTIONS.map(({ icon: Icon, label }) => (
            <Button
              key={label}
              variantsUi={{ color: 'ghost', rounded: 'xl' }}
              cn='w-full justify-start gap-3 px-3 py-2.5'
            >
              <Icon className='h-5 w-5' />
              <Text variantsUi={{ size: 'sm' }} className='text-gray-300'>
                {label}
              </Text>
            </Button>
          ))}
        </Container>
      </Container>
    </>
  </Conditional>
);
