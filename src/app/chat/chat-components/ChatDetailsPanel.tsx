'use client';

import { FC, memo, useState } from 'react';

import { Conditional } from '@components/Conditionals';
import { useChatDetailsContext } from '@contexts/ChatDetailsContext';
import { Chat, Participant } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Pin,
  Settings,
  X,
} from 'lucide-react';

// WS: заменить на GET /api/messages/pinned?chatId=...
const MOCK_PINNED: { id: string; sender: string; text: string }[] = [
  {
    id: 'p1',
    sender: 'Sarah Chen',
    text: 'Важно: совещание перенесено на 15:00 сегодня',
  },
  {
    id: 'p2',
    sender: 'Marcus Johnson',
    text: 'Дедлайн по дизайну — пятница, 18:00',
  },
  {
    id: 'p3',
    sender: 'Emily Rodriguez',
    text: 'Ссылка на макеты: figma.com/file/...',
  },
];

interface SectionTitleProps {
  label: string;
  expandable?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

const SectionTitle: FC<SectionTitleProps> = ({
  label,
  expandable,
  expanded,
  onToggle,
}) => (
  <Container className='justify-between p-0 px-1'>
    <Text
      variantsUi={{ size: 'xs', color: 'muted' }}
      className='font-semibold tracking-wider uppercase'
    >
      {label}
    </Text>
    {expandable && (
      <Button
        variantsUi={{ color: 'ghost', rounded: 'lg' }}
        className='p-1'
        onClick={onToggle}
      >
        {expanded ? (
          <ChevronUp className='h-3.5 w-3.5' />
        ) : (
          <ChevronDown className='h-3.5 w-3.5' />
        )}
      </Button>
    )}
  </Container>
);

interface ChatDetailsPanelProps {
  chat: Chat;
  participants: Participant[];
}

const SETTINGS_ITEMS = [
  { icon: Bell, label: 'Уведомления' },
  { icon: Settings, label: 'Настройки чата' },
] as const;

export const ChatDetailsPanel: FC<ChatDetailsPanelProps> = memo(
  ({ chat, participants }) => {
    const { isDetailsOpen, closeDetails } = useChatDetailsContext();
    const [isPinnedOpen, setIsPinnedOpen] = useState(false);

    return (
      <Conditional condition={isDetailsOpen}>
        <Container
          className='absolute inset-0 z-40 bg-black/20 p-0 backdrop-blur-md'
          onClick={closeDetails}
        />

        {/* Панель */}
        <Container
          variantsUi={{ flow: 'col' }}
          className='absolute top-0 right-0 bottom-0 z-50 w-80 gap-0 overflow-y-auto border-l border-white/10 bg-[#1a1a1f] p-0'
        >
          {/* Шапка */}
          <Container className='sticky top-0 shrink-0 justify-between border-b border-white/10 bg-[#1a1a1f]/95 px-5 py-4 backdrop-blur-sm'>
            <Text variantsUi={{ weight: 'semibold' }}>Детали чата</Text>
            <Button
              variantsUi={{ color: 'ghost', rounded: 'lg' }}
              className='p-1'
              onClick={closeDetails}
            >
              <X className='h-4 w-4' />
            </Button>
          </Container>

          {/* Инфо о чате */}
          <Container
            variantsUi={{ flow: 'col', items: 'centered' }}
            className='border-b border-white/5 px-5 py-6'
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

          <Container
            variantsUi={{ flow: 'col' }}
            className='gap-3 border-b border-white/5 px-4 py-4'
          >
            <SectionTitle label='Участники' />
            {participants.map((p) => (
              <Container
                key={p.id}
                className='gap-3 rounded-xl p-0 px-1 py-1.5 transition-colors hover:bg-white/5'
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

          <Container
            variantsUi={{ flow: 'col' }}
            className='gap-3 border-b border-white/5 px-4 py-4'
          >
            <SectionTitle label='Медиа' />
            <Container className='grid grid-cols-3 gap-2 p-0'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Container
                  key={i}
                  variantsUi={{ items: 'centered' }}
                  className='aspect-square cursor-pointer rounded-xl bg-white/5 transition-colors hover:bg-white/10'
                >
                  <ImageIcon className='h-6 w-6 text-gray-600' />
                </Container>
              ))}
            </Container>
          </Container>

          <Container
            variantsUi={{ flow: 'col' }}
            className='gap-3 border-b border-white/5 px-4 py-4'
          >
            <SectionTitle
              label='Закреплённые'
              expandable
              expanded={isPinnedOpen}
              onToggle={() => setIsPinnedOpen((v) => !v)}
            />

            {/* Первое всегда видно */}
            <Container className='cursor-pointer gap-2 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10'>
              <Pin className='mt-0.5 h-4 w-4 shrink-0 text-[#A74BE9]' />
              <Container
                variantsUi={{ flow: 'col' }}
                className='flex-1 gap-0.5 p-0'
              >
                <Text variantsUi={{ size: 'xs', color: 'muted' }}>
                  {MOCK_PINNED[0].sender}
                </Text>
                <Text
                  as='p'
                  variantsUi={{ size: 'sm' }}
                  className='line-clamp-2 text-gray-300'
                >
                  {MOCK_PINNED[0].text}
                </Text>
              </Container>
            </Container>

            {/* Остальные раскрываются */}
            <Conditional condition={isPinnedOpen}>
              <Container variantsUi={{ flow: 'col' }} className='gap-2 p-0'>
                {MOCK_PINNED.slice(1).map((msg) => (
                  <Container
                    key={msg.id}
                    className='cursor-pointer gap-2 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10'
                  >
                    <Pin className='mt-0.5 h-4 w-4 shrink-0 text-[#A74BE9]' />
                    <Container
                      variantsUi={{ flow: 'col' }}
                      className='flex-1 gap-0.5 p-0'
                    >
                      <Text variantsUi={{ size: 'xs', color: 'muted' }}>
                        {msg.sender}
                      </Text>
                      <Text
                        as='p'
                        variantsUi={{ size: 'sm' }}
                        className='line-clamp-2 text-gray-300'
                      >
                        {msg.text}
                      </Text>
                    </Container>
                  </Container>
                ))}
              </Container>
            </Conditional>
          </Container>

          <Container variantsUi={{ flow: 'col' }} className='gap-2 px-4 py-4'>
            <SectionTitle label='Настройки' />
            {SETTINGS_ITEMS.map(({ icon: Icon, label }) => (
              <Button
                key={label}
                variantsUi={{ color: 'ghost', rounded: 'xl' }}
                className='w-full justify-start gap-3 px-3 py-2.5'
              >
                <Icon className='h-5 w-5' />
                <Text variantsUi={{ size: 'sm' }} className='text-gray-300'>
                  {label}
                </Text>
              </Button>
            ))}
          </Container>
        </Container>
      </Conditional>
    );
  },
);

ChatDetailsPanel.displayName = 'ChatDetailsPanel';
