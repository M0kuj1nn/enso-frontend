'use client';

import { FC, memo, useCallback, useState } from 'react';

import { Conditional } from '@components/Conditionals';
import { useChatContext } from '@contexts/ChatContext';
import { useDebounce } from '@shared/hooks/useDebounce';
import { User } from '@shared/types/chat';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Input } from '@ui/Input';
import { Modal } from '@ui/Modal';
import { Text } from '@ui/typography/Text';
import { Check, Search, UserPlus } from 'lucide-react';

// FriendEntry
// memo теперь работает корректно: tanstack query возвращает стабильные ссылки
// на объекты из кэша - shallow-сравнение проходит - лишних ререндеров нет вроде как

type FriendEntryState = 'none' | 'just_added' | 'already_friend';

interface FriendEntryProps {
  user: User;
  state: FriendEntryState;
  onAdd: (user: User) => void;
}

const FriendEntry: FC<FriendEntryProps> = memo(({ user, state, onAdd }) => (
  <Container className='gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/5'>
    <Avatar
      src={user.avatar}
      alt={user.name}
      size='md'
      shape='rounded'
      status={user.status}
    />

    <Container variantsUi={{ flow: 'col' }} className='flex-1 gap-0 p-0'>
      <Text variantsUi={{ size: 'sm', weight: 'medium' }}>{user.name}</Text>
      <Text variantsUi={{ size: 'xs', color: 'muted' }}>{user.username}</Text>
    </Container>

    {state === 'just_added' || state === 'already_friend' ? (
      <Container className='gap-1.5 p-0'>
        <Check className='h-4 w-4 text-emerald-400' />
        <Text variantsUi={{ size: 'xs' }} className='text-emerald-400'>
          {state === 'just_added' ? 'Добавлен!' : 'Уже друг'}
        </Text>
      </Container>
    ) : (
      <Button
        variantsUi={{ color: 'primary', size: 'sm', rounded: 'xl' }}
        onClick={() => onAdd(user)}
      >
        <UserPlus className='h-3.5 w-3.5' />
        Добавить
      </Button>
    )}
  </Container>
));

FriendEntry.displayName = 'FriendEntry';

// AddFriendModal

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

  const debouncedQuery = useDebounce(query, 300);

  const { data: results = [], isFetching } = useQuery({
    // уникальный ключ
    queryKey: ['users', 'search', debouncedQuery],
    // WS/API: заменить на fetch(`/api/users/search?q=${debouncedQuery}`).then(r => r.json())
    queryFn: () => searchUsers(debouncedQuery),
    // Не делаем запрос пока поле пустое
    enabled: debouncedQuery.trim().length > 0,
    // Данные из кэша считаются актуальными 1 минуту - повторного запроса не будет
    staleTime: 60_000,
    placeholderData: [],
  });

  const getFriendState = (user: User): FriendEntryState => {
    if (added.has(user.id)) return 'just_added';
    if (friends.some((f) => f.id === user.id)) return 'already_friend';
    return 'none';
  };

  const handleAdd = useCallback(
    (user: User) => {
      addFriend(user.id);
      setAdded((prev) => new Set(prev).add(user.id));
    },
    [addFriend],
  );

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
        {/* Header */}
        <Container
          variantsUi={{ flow: 'col' }}
          className='gap-1 border-b border-white/5 px-6 pt-6 pb-4'
        >
          <Text variantsUi={{ size: 'xl', weight: 'semibold' }}>
            Добавить друзей
          </Text>
          <Text as='p' variantsUi={{ size: 'sm', color: 'muted' }}>
            Найди друга по имени или @username
          </Text>
        </Container>

        {/* Поиск */}
        <Container className='px-6 py-4'>
          <Container className='relative w-full p-0'>
            <Search className='pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-[#969696]' />
            <Input
              variantsUi={{ style: 'search' }}
              className='pl-9'
              placeholder='Найти пользователя...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </Container>
        </Container>

        {/* Resaults */}
        <Container
          variantsUi={{ flow: 'col' }}
          className='max-h-72 gap-1 overflow-y-auto px-4 pb-4'
        >
          <Conditional condition={isFetching}>
            <Container variantsUi={{ items: 'centered' }} className='py-6'>
              <Text variantsUi={{ size: 'sm', color: 'muted' }}>Поиск...</Text>
            </Container>
          </Conditional>

          <Conditional
            condition={
              !isFetching &&
              debouncedQuery.trim().length > 0 &&
              results.length === 0
            }
          >
            <Container variantsUi={{ items: 'centered' }} className='py-8'>
              <Text variantsUi={{ size: 'sm', color: 'muted' }}>
                Пользователи не найдены
              </Text>
            </Container>
          </Conditional>

          {!isFetching &&
            results.map((user) => (
              <FriendEntry
                key={user.id}
                user={user}
                state={getFriendState(user)}
                onAdd={handleAdd}
              />
            ))}

          <Conditional condition={debouncedQuery.trim().length === 0}>
            <Container variantsUi={{ items: 'centered' }} className='py-8'>
              <Text variantsUi={{ size: 'sm', color: 'muted' }}>
                Начни вводить имя или @username
              </Text>
            </Container>
          </Conditional>
        </Container>

        <Container className='justify-end border-t border-white/5 px-6 py-4'>
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
