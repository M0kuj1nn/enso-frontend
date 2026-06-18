'use client';

import { FC, memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { AnimatePresence, motion } from 'framer-motion';
import { EmojiPicker as Picker } from 'frimousse';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export const EmojiPicker: FC<EmojiPickerProps> = memo(({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ bottom: 0, right: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const onPointerUp = () => {
      isDragging.current = false;
    };
    document.addEventListener('pointerup', onPointerUp);
    return () => document.removeEventListener('pointerup', onPointerUp);
  }, []);

  const computePos = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setPos({
      // 8px зазор от верха кнопки + высота input-бара (~60px) для разрыва
      bottom: window.innerHeight - rect.top + 68,
      right: window.innerWidth - rect.right,
    });
  };

  const scheduleClose = () => {
    if (isDragging.current) return;
    closeTimer.current = setTimeout(() => setIsOpen(false), 200);
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleEnter = () => {
    cancelClose();
    computePos();
    setIsOpen(true);
  };

  return (
    <Container
      ref={wrapperRef}
      className='relative shrink-0 p-0'
      onMouseEnter={handleEnter}
      onMouseLeave={scheduleClose}
    >
      <Button variantsUi={{ color: 'ghost', rounded: 'lg' }} className='p-1.5'>
        <Smile className='h-4 w-4' />
      </Button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  bottom: pos.bottom,
                  right: pos.right,
                  zIndex: 9999,
                  transformOrigin: 'bottom right',
                }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                onPointerDown={() => {
                  isDragging.current = true;
                }}
              >
                <Picker.Root
                  locale='ru'
                  onEmojiSelect={(e) => onSelect(e.emoji)}
                  className='flex w-72 flex-col gap-2 rounded-2xl border border-white/10 bg-[#1e1e26]/95 p-3 shadow-xl backdrop-blur-xl'
                >
                  <Picker.Search
                    placeholder='Поиск...'
                    className='w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white transition-colors outline-none placeholder:text-gray-500 focus:bg-white/10 focus:ring-1 focus:ring-[#A74BE9]'
                  />

                  <Picker.Viewport className='emoji-scrollbar h-64 overflow-y-auto'>
                    <Picker.Loading>
                      <Text className='py-6 text-center text-sm text-gray-500'>
                        Загрузка...
                      </Text>
                    </Picker.Loading>

                    <Picker.Empty>
                      <Text className='py-6 text-center text-sm text-gray-500'>
                        Ничего не найдено
                      </Text>
                    </Picker.Empty>

                    <Picker.List
                      components={{
                        CategoryHeader: ({ category, ...props }) => (
                          <div
                            {...props}
                            className='px-1 pt-2 pb-1 text-xs tracking-wide text-gray-500 uppercase'
                          >
                            {category.label}
                          </div>
                        ),
                        Row: (props) => <div {...props} className='flex' />,
                        Emoji: ({ emoji, ...props }) => (
                          <button
                            {...props}
                            type='button'
                            aria-label={emoji.label}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-xl transition-colors ${
                              emoji.isActive
                                ? 'bg-white/15'
                                : 'hover:bg-white/10'
                            }`}
                          >
                            {emoji.emoji}
                          </button>
                        ),
                      }}
                    />
                  </Picker.Viewport>
                </Picker.Root>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </Container>
  );
});

EmojiPicker.displayName = 'EmojiPicker';
