'use client';

import { FC, useState } from 'react';

import { Conditional } from '@components/Conditionals';
import { useChatContext } from '@contexts/ChatContext';
import { useChatDetailsContext } from '@contexts/ChatDetailsContext';
import { useDebounce } from '@shared/hooks/useDebounce';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Input } from '@ui/Input';
import { Text } from '@ui/typography/Text';
import { Search, X } from 'lucide-react';

// Подсветка совпадения

const Highlight: FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <>{text}</>;

  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);

  if (idx === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, idx)}
      <Text
        as='span'
        className='rounded bg-[#A74BE9]/25 px-0.5 font-semibold text-[#A74BE9]'
      >
        {text.slice(idx, idx + query.length)}
      </Text>
      {text.slice(idx + query.length)}
    </>
  );
};

// ChatSearch

interface ChatSearchProps {
  chatId: string;
}

export const ChatSearch: FC<ChatSearchProps> = ({ chatId }) => {
  const { isSearchOpen, closeSearch } = useChatDetailsContext();
  const { messages } = useChatContext();
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 500);
  const allMessages = messages[chatId] ?? [];

  // Простая фильтрация - заменится на Elasticsearch API
  const results =
    debouncedQuery.trim().length >= 2
      ? allMessages.filter((msg) =>
          msg.text.toLowerCase().includes(debouncedQuery.toLowerCase()),
        )
      : [];

  const handleClose = () => {
    setQuery('');
    closeSearch();
  };

  return (
    <Conditional condition={isSearchOpen}>
      <>
        {/* Прозрачный backdrop — закрывает панель по клику вне */}
        <Container
          className='absolute inset-0 z-29 p-0'
          onClick={handleClose}
        />

        <Container
          variantsUi={{ flow: 'col' }}
          className='absolute top-0 right-0 bottom-0 z-30 w-80 gap-0 overflow-hidden border-l border-white/5 bg-[#1a1a1f] p-0'
        >
          {/* Шапка */}
          <Container className='shrink-0 gap-3 border-b border-white/5 px-4 py-4'>
            <Container className='relative w-full p-0'>
              <Search className='pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-[#969696]' />
              <Input
                variantsUi={{ style: 'search' }}
                className='pl-9'
                placeholder='Поиск в чате...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </Container>
            <Button
              variantsUi={{ color: 'ghost', rounded: 'lg' }}
              className='shrink-0 p-1.5'
              onClick={handleClose}
            >
              <X className='h-5 w-5' />
            </Button>
          </Container>

          {/* Результаты */}
          <Container
            variantsUi={{ flow: 'col' }}
            className='flex-1 overflow-y-auto p-0 px-2 py-2'
          >
            {/* Ждём ввода */}
            <Conditional condition={debouncedQuery.trim().length < 2}>
              <Container
                variantsUi={{ items: 'centered' }}
                className='flex-1 py-12'
              >
                <Container
                  variantsUi={{ flow: 'col', items: 'centered' }}
                  className='gap-2 p-0'
                >
                  <Search className='h-8 w-8 text-[#969696]' />
                  <Text variantsUi={{ size: 'sm', color: 'muted' }}>
                    Введите минимум 2 символа
                  </Text>
                </Container>
              </Container>
            </Conditional>

            {/* Нет результатов */}
            <Conditional
              condition={
                debouncedQuery.trim().length >= 2 && results.length === 0
              }
            >
              <Container variantsUi={{ items: 'centered' }} className='py-12'>
                <Text variantsUi={{ size: 'sm', color: 'muted' }}>
                  Ничего не найдено
                </Text>
              </Container>
            </Conditional>

            {/* Результаты */}
            {results.length > 0 && (
              <>
                <Text
                  variantsUi={{ size: 'xs', color: 'muted' }}
                  className='mb-1 px-2 font-semibold tracking-wider uppercase'
                >
                  {results.length} совпадений
                </Text>
                {results.map((msg) => (
                  <Button
                    key={msg.id}
                    variantsUi={{ color: 'ghost' }}
                    className='w-full justify-start gap-3 rounded-xl px-3 py-2.5'
                    onClick={handleClose}
                  >
                    <Avatar
                      src={msg.avatar}
                      alt={msg.sender}
                      size='md'
                      shape='rounded'
                    />
                    <Container
                      variantsUi={{ flow: 'col' }}
                      className='min-w-0 flex-1 gap-0.5 p-0 text-left'
                    >
                      <Container className='items-center justify-between gap-2 p-0'>
                        <Text
                          variantsUi={{ size: 'sm', weight: 'medium' }}
                          className='truncate'
                        >
                          {msg.sender}
                        </Text>
                        <Text
                          variantsUi={{ size: 'xs', color: 'muted' }}
                          className='shrink-0'
                        >
                          {msg.created_at}
                        </Text>
                      </Container>
                      <Text
                        as='p'
                        variantsUi={{ size: 'xs', color: 'muted' }}
                        className='truncate text-gray-400'
                      >
                        <Highlight text={msg.text} query={debouncedQuery} />
                      </Text>
                    </Container>
                  </Button>
                ))}
              </>
            )}
          </Container>
        </Container>
      </>
    </Conditional>
  );
};
