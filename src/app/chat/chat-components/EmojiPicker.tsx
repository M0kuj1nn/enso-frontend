'use client';

import { FC, memo, useEffect, useRef, useState } from 'react';

import { useClickOutside } from '@shared/hooks/useClickOutside';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { AnimatePresence, motion } from 'framer-motion';
import { Smile } from 'lucide-react';

const RECENT_EMOJIS_KEY = 'enso:recent-emojis';
const MAX_RECENT = 8;

// До 50 основных эмодзи — без нижней панели категорий/истории
const EMOJIS = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '🤣',
  '😂',
  '🙂',
  '🙃',
  '😉',
  '😊',
  '😇',
  '🥰',
  '😍',
  '🤩',
  '😘',
  '😗',
  '😚',
  '😋',
  '😛',
  '😜',
  '🤪',
  '🤨',
  '🧐',
  '🤓',
  '😎',
  '🤗',
  '🤔',
  '🤐',
  '😐',
  '😑',
  '😶',
  '🙄',
  '😏',
  '😣',
  '😥',
  '😮',
  '🤯',
  '😪',
  '😴',
  '🥳',
  '😭',
  '😤',
  '😡',
  '🥶',
  '🥵',
  '😱',
  '👍',
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export const EmojiPicker: FC<EmojiPickerProps> = memo(({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_EMOJIS_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      // localStorage недоступен — просто без истории
    }
  }, []);

  useClickOutside(wrapperRef, () => setIsOpen(false), isOpen);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setRecent((prev) => {
      const next = [emoji, ...prev.filter((e) => e !== emoji)].slice(
        0,
        MAX_RECENT,
      );
      try {
        localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(next));
      } catch {
        // localStorage недоступен — история не сохранится
      }
      return next;
    });
  };

  return (
    <Container
      ref={wrapperRef}
      className='relative shrink-0 p-0'
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className='absolute right-0 bottom-full z-50 mb-2 origin-bottom-right'
          >
            <Container
              variantsUi={{ flow: 'col', style: 'whiteglass', rounded: '2xl' }}
              className='max-h-80 w-72 gap-3 overflow-y-auto bg-[#1e1e26]/95 p-3'
            >
              {recent.length > 0 && (
                <Container variantsUi={{ flow: 'col' }} className='gap-2 p-0'>
                  <Text
                    variantsUi={{ size: 'xs', color: 'muted' }}
                    className='px-1 uppercase'
                  >
                    Недавние
                  </Text>
                  <Container className='flex-wrap gap-1 p-0'>
                    {recent.map((emoji, i) => (
                      <button
                        key={`recent-${i}`}
                        type='button'
                        className='flex h-9 w-9 items-center justify-center rounded-lg text-xl transition-colors hover:bg-white/10'
                        onClick={() => handleSelect(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </Container>
                </Container>
              )}

              <Container variantsUi={{ flow: 'col' }} className='gap-2 p-0'>
                <Text
                  variantsUi={{ size: 'xs', color: 'muted' }}
                  className='px-1 uppercase'
                >
                  Смайлы и люди
                </Text>
                <Container className='flex-wrap gap-1 p-0'>
                  {EMOJIS.map((emoji, i) => (
                    <button
                      key={`emoji-${i}`}
                      type='button'
                      className='flex h-9 w-9 items-center justify-center rounded-lg text-xl transition-colors hover:bg-white/10'
                      onClick={() => handleSelect(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </Container>
              </Container>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      <Button variantsUi={{ color: 'ghost', rounded: 'lg' }} className='p-1.5'>
        <Smile className='h-4 w-4' />
      </Button>
    </Container>
  );
});

EmojiPicker.displayName = 'EmojiPicker';
