'use client';

import { FC, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { MessageSquarePlus, UserPlus } from 'lucide-react';

import { AddFriendModal } from './AddFriendModal';
import { NewChatModal } from './NewChatModal';

export const EmptyChat: FC = () => {
  const router = useRouter();
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  return (
    <>
      <Container
        variantsUi={{ flow: 'col', items: 'centered' }}
        className='flex-1 gap-4 bg-[#141418] p-0'
      >
        {/* Карточка */}
        <Container
          variantsUi={{ flow: 'col', items: 'centered' }}
          cn='bg-[#1a1a1f] border border-white/10 rounded-2xl px-10 py-10 gap-6 p-0 px-10 py-10'
        >
          {/* Иконка + */}
          <Button
            variantsUi={{ color: 'glamor', rounded: 'full' }}
            cn='w-16 h-16 p-0 text-2xl shadow-[0_0_30px_rgba(167,75,233,0.4)]'
            onClick={() => setIsAddFriendOpen(true)}
          >
            <UserPlus className='h-7 w-7' />
          </Button>

          <Container
            variantsUi={{ flow: 'col', items: 'centered' }}
            className='gap-1 p-0'
          >
            <Text variantsUi={{ size: 'lg', weight: 'semibold' }}>
              Добавить друзей
            </Text>
            <Text
              as='p'
              variantsUi={{ size: 'sm', color: 'muted' }}
              className='max-w-56 text-center'
            >
              Найди друга по @username и начни общаться
            </Text>
          </Container>

          <Container className='gap-3 p-0'>
            <Button
              variantsUi={{ color: 'primary', rounded: '2xl' }}
              onClick={() => setIsAddFriendOpen(true)}
            >
              <UserPlus className='h-4 w-4' />
              Добавить друга
            </Button>
            <Button
              variantsUi={{ color: 'gray', rounded: '2xl' }}
              onClick={() => setIsNewChatOpen(true)}
            >
              <MessageSquarePlus className='h-4 w-4' />
              Новый чат
            </Button>
          </Container>
        </Container>
      </Container>

      <AddFriendModal
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
      />
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onCreated={(id) => router.push(`/chat/${id}`)}
      />
    </>
  );
};
