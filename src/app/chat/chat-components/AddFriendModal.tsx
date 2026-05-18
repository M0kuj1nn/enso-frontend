'use client';

import { FC, useState } from 'react';

import { useChatContext } from '@contexts/ChatContext';
import { User } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Input } from '@ui/Input';
import { Modal } from '@ui/Modal';
import { Text } from '@ui/typography/Text';
import { Check, Search, UserPlus } from 'lucide-react';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFriendModal: FC<AddFriendModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { friends, searchUsers, addFriend } = useChatContext();
  const [query, setQuery] = useState('');
  const [added, setAdded] = useState<Set<string>>(new Set());

  const results = searchUsers(query);
  const getFriendState = (user: User) => {
    if (added.has(user.id)) return 'just_added';
    if (friends.some((f) => f.id === user.id)) return 'already_friend';
    return 'none';
  };

  const handleAdd = (user: User) => {
    addFriend(user.id);
    setAdded((prev) => new Set(prev).add(user.id));
  };

  const handleClose = () => {
    setQuery('');
    setAdded(new Set());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Container
        variantsUi={{ flow: 'col' }}
        className='w-[480] gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1f] p-0'
      >
        {/* Шапка */}
        <Container
          variantsUi={{ flow: 'col' }}
          cn='px-6 pt-6 pb-4 p-0 px-6 pt-6 pb-4 gap-1 border-b border-white/5'
        >
          <Text variantsUi={{ size: 'xl', weight: 'semibold' }}>
            Добавить друзей
          </Text>
          <Text as='p' variantsUi={{ size: 'sm', color: 'muted' }}>
            Найди друга по имени или @username
          </Text>
        </Container>

        {/* Поиск */}
        <Container cn='px-6 py-4 relative p-0 px-6 py-4'>
          <Search className='pointer-events-none absolute top-1/2 left-9 z-10 h-4 w-4 -translate-y-1/2 text-[#969696]' />
          <Input
            variantsUi={{ style: 'search' }}
            placeholder='Найти пользователя...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </Container>

        {/* Результаты */}
        <Container
          variantsUi={{ flow: 'col' }}
          cn='px-4 pb-4 max-h-72 overflow-y-auto p-0 px-4 pb-4 gap-1'
        >
          {query.trim() && results.length === 0 && (
            <Container variantsUi={{ items: 'centered' }} cn='py-8 p-0 py-8'>
              <Text variantsUi={{ size: 'sm', color: 'muted' }}>
                Пользователи не найдены
              </Text>
            </Container>
          )}

          {results.map((user) => {
            const state = getFriendState(user);
            return (
              <Container
                key={user.id}
                cn='px-2 py-2 rounded-xl hover:bg-white/5 transition-colors gap-3 p-0 px-2 py-2'
              >
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  size='md'
                  shape='rounded'
                  status={user.status}
                />
                <Container
                  variantsUi={{ flow: 'col' }}
                  className='flex-1 gap-0 p-0'
                >
                  <Text variantsUi={{ size: 'sm', weight: 'medium' }}>
                    {user.name}
                  </Text>
                  <Text variantsUi={{ size: 'xs', color: 'muted' }}>
                    {user.username}
                  </Text>
                </Container>

                {state === 'just_added' || state === 'already_friend' ? (
                  <Container className='gap-1.5 p-0 text-emerald-400'>
                    <Check className='h-4 w-4' />
                    <Text
                      variantsUi={{ size: 'xs' }}
                      className='text-emerald-400'
                    >
                      {state === 'just_added' ? 'Добавлен!' : 'Уже друг'}
                    </Text>
                  </Container>
                ) : (
                  <Button
                    variantsUi={{ color: 'primary', size: 'sm', rounded: 'xl' }}
                    onClick={() => handleAdd(user)}
                  >
                    <UserPlus className='h-3.5 w-3.5' />
                    Добавить
                  </Button>
                )}
              </Container>
            );
          })}

          {/* Подсказка когда ничего не введено */}
          {!query.trim() && (
            <Container variantsUi={{ items: 'centered' }} cn='py-8 p-0 py-8'>
              <Text variantsUi={{ size: 'sm', color: 'muted' }}>
                Начни вводить имя или @username
              </Text>
            </Container>
          )}
        </Container>

        {/* Нижняя кнопка */}
        <Container cn='px-6 py-4 border-t border-white/5 justify-end p-0 px-6 py-4'>
          <Button
            variantsUi={{ color: 'ghost', size: 'sm', rounded: 'xl' }}
            onClick={handleClose}
          >
            Закрыть
          </Button>
        </Container>
      </Container>
    </Modal>
  );
};
