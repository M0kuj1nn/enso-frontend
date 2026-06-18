'use client';

import { FC, memo, useEffect, useRef, useState } from 'react';

import { Conditional } from '@components/Conditionals';
import { useChatDetailsContext } from '@contexts/ChatDetailsContext';
import { useClickOutside } from '@shared/hooks/useClickOutside';
import { Chat, Participant } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import {
  Ban,
  BarChart3,
  Bell,
  BellOff,
  LogOut,
  MoreVertical,
  Phone,
  Search,
  Trash2,
  Users2,
} from 'lucide-react';

import { CallModal } from './CallModal';

// WheelColumn

const ITEM_H = 44;
const VISIBLE = 5;

interface WheelColumnProps {
  items: string[];
  initialIndex: number;
  suffix: string;
  onSelect: (index: number) => void;
}

const WheelColumn: FC<WheelColumnProps> = ({
  items,
  initialIndex,
  suffix,
  onSelect,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = initialIndex * ITEM_H;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
  }, []);

  const scrollToIndex = (index: number) => {
    ref.current?.scrollTo({ top: index * ITEM_H, behavior: 'smooth' });
  };

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
    onSelect(index);
    scrollToIndex(index);
  };

  const handleScroll = () => {
    if (!ref.current) return;
    const raw = Math.round(ref.current.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(raw, items.length - 1));

    setSelectedIndex(clamped);

    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      onSelect(clamped);
      ref.current?.scrollTo({ top: clamped * ITEM_H, behavior: 'smooth' });
    }, 80);
  };

  return (
    <div className='flex items-center gap-1.5'>
      <div
        ref={ref}
        className='no-scrollbar overflow-y-scroll'
        style={{
          height: ITEM_H * VISIBLE,
          WebkitOverflowScrolling: 'touch' as never,
          width: 52,
        }}
        onScroll={handleScroll}
      >
        <div style={{ paddingTop: ITEM_H * 2, paddingBottom: ITEM_H * 2 }}>
          {items.map((item, i) => {
            const dist = Math.abs(i - selectedIndex);
            const opacity =
              dist === 0 ? 1 : dist === 1 ? 0.5 : dist === 2 ? 0.25 : 0.1;
            return (
              <div
                key={i}
                role='button'
                tabIndex={0}
                style={{ height: ITEM_H, opacity }}
                className='flex cursor-pointer items-center justify-end pr-1 text-xl font-semibold text-white transition-opacity duration-150 select-none'
                onClick={() => handleItemClick(i)}
                onKeyDown={(e) => e.key === 'Enter' && handleItemClick(i)}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
      <Text className='text-sm text-gray-400'>{suffix}</Text>
    </div>
  );
};

// MuteTimePicker

const HOURS = Array.from({ length: 24 }, (_, i) => String(i));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i));

interface MuteTimePickerProps {
  onConfirm: (hours: number, minutes: number) => void;
  onCancel: () => void;
}

const MuteTimePicker: FC<MuteTimePickerProps> = ({ onConfirm, onCancel }) => {
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);

  const isValid = hours > 0 || minutes >= 10;

  return (
    <Container
      variantsUi={{ flow: 'col' }}
      className='gap-0 p-0'
      onClick={(e) => e.stopPropagation()}
    >
      <Text className='px-4 pt-3 pb-2 text-center text-sm font-medium text-gray-300'>
        Выключить уведомления
      </Text>

      {/* Колёса */}
      <div className='relative px-4 py-2'>
        {/* Полоса выделения выбранного значения */}
        <div
          className='pointer-events-none absolute inset-x-4 rounded-xl bg-white/8'
          style={{
            top: `calc(50% - ${ITEM_H / 2}px)`,
            height: ITEM_H,
          }}
        />

        <div className='flex items-center justify-center gap-4'>
          <WheelColumn
            items={HOURS}
            initialIndex={1}
            suffix='ч'
            onSelect={setHours}
          />
          <WheelColumn
            items={MINUTES}
            initialIndex={0}
            suffix='мин'
            onSelect={setMinutes}
          />
        </div>
      </div>

      {/* Кнопки */}
      <Container className='border-t border-white/10 p-0 px-3 py-2'>
        <Button
          variantsUi={{ color: 'ghost', rounded: 'xl' }}
          className='flex-1 justify-center py-2 text-sm text-gray-400 hover:bg-white/10'
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button
          variantsUi={{ color: 'ghost', rounded: 'xl' }}
          className='flex-1 justify-center py-2 text-sm text-[#A74BE9] hover:bg-[#A74BE9]/15'
          disabled={!isValid}
          onClick={() => onConfirm(hours, minutes)}
        >
          Выключить
        </Button>
      </Container>
    </Container>
  );
};

// Утилиты для mute

interface MuteInfo {
  until: number;
  label: string;
}

// ChatMenu

interface ChatMenuProps {
  isOpen: boolean;
  isDm: boolean;
  isMuted: boolean;
  muteLabel: string;
  onClose: () => void;
  onMuteClick: () => void;
  onUnmute: () => void;
}

const ChatMenu: FC<ChatMenuProps> = ({
  isOpen,
  isDm,
  isMuted,
  muteLabel,
  onClose,
  onMuteClick,
  onUnmute,
}) => {
  return (
    <Conditional condition={isOpen}>
      <Container
        variantsUi={{ flow: 'col', style: 'whiteglass' }}
        className='absolute top-full right-0 z-50 mt-1 w-64 gap-0 overflow-hidden rounded-2xl bg-[#25252c]/95 p-1'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Уведомления — всегда первый пункт */}
        <Button
          variantsUi={{ color: 'ghost', rounded: 'xl' }}
          className='w-full justify-start gap-3 px-4 py-2.5 hover:bg-white/10'
          onClick={() => {
            if (isMuted) {
              onUnmute();
            } else {
              onMuteClick();
            }
          }}
        >
          {isMuted ? (
            <Bell className='h-4 w-4 shrink-0 text-gray-400' />
          ) : (
            <BellOff className='h-4 w-4 shrink-0 text-gray-400' />
          )}
          <Text variantsUi={{ size: 'sm' }}>
            {isMuted ? 'Включить уведомления' : 'Выключить уведомления'}
          </Text>
          {isMuted && muteLabel && (
            <Text className='ml-auto text-xs text-[#A74BE9]'>{muteLabel}</Text>
          )}
        </Button>

        {/* Разделитель */}
        <Container className='my-1 h-px bg-white/10 p-0' />

        {isDm ? (
          <>
            <Button
              variantsUi={{ color: 'ghost', rounded: 'xl' }}
              className='w-full justify-start gap-3 px-4 py-2.5 hover:bg-white/10'
              onClick={onClose}
            >
              <Trash2 className='h-4 w-4 shrink-0 text-gray-400' />
              <Text variantsUi={{ size: 'sm' }}>Очистить историю</Text>
            </Button>

            <Button
              variantsUi={{ color: 'ghost', rounded: 'xl' }}
              className='group w-full justify-start gap-3 px-4 py-2.5 hover:bg-red-500/15'
              onClick={onClose}
            >
              <Ban className='h-4 w-4 shrink-0 text-red-500 group-hover:text-red-400' />
              <Text
                variantsUi={{ size: 'sm' }}
                className='text-red-500 group-hover:text-red-400'
              >
                Заблокировать
              </Text>
            </Button>
          </>
        ) : (
          <>
            <Button
              variantsUi={{ color: 'ghost', rounded: 'xl' }}
              className='w-full justify-start gap-3 px-4 py-2.5 hover:bg-white/10'
              onClick={onClose}
            >
              <Users2 className='h-4 w-4 shrink-0 text-gray-400' />
              <Text variantsUi={{ size: 'sm' }}>Управление группой</Text>
            </Button>

            <Button
              variantsUi={{ color: 'ghost', rounded: 'xl' }}
              className='w-full justify-start gap-3 px-4 py-2.5 hover:bg-white/10'
              onClick={onClose}
            >
              <BarChart3 className='h-4 w-4 shrink-0 text-gray-400' />
              <Text variantsUi={{ size: 'sm' }}>Создать опрос</Text>
            </Button>

            <Container className='my-1 h-px bg-white/10 p-0' />

            <Button
              variantsUi={{ color: 'ghost', rounded: 'xl' }}
              className='group w-full justify-start gap-3 px-4 py-2.5 hover:bg-red-500/15'
              onClick={onClose}
            >
              <LogOut className='h-4 w-4 shrink-0 text-red-500 group-hover:text-red-400' />
              <Text
                variantsUi={{ size: 'sm' }}
                className='text-red-500 group-hover:text-red-400'
              >
                Выйти из группы
              </Text>
            </Button>
          </>
        )}
      </Container>
    </Conditional>
  );
};

// ChatHeader

interface ChatHeaderProps {
  chat: Chat;
  participants: Participant[];
}

export const ChatHeader: FC<ChatHeaderProps> = memo(
  ({ chat, participants }) => {
    const { openDetails, openSearch } = useChatDetailsContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMutePickerOpen, setIsMutePickerOpen] = useState(false);
    const [isCallOpen, setIsCallOpen] = useState(false);
    const [muteInfo, setMuteInfo] = useState<MuteInfo | null>(null);

    const menuWrapperRef = useRef<HTMLDivElement>(null);
    useClickOutside(
      menuWrapperRef,
      () => {
        setIsMenuOpen(false);
        setIsMutePickerOpen(false);
      },
      isMenuOpen || isMutePickerOpen,
    );

    const isDm = chat.type === 'dm';

    // isMuted и muteLabel — чистые derivations, не state
    const isMuted = muteInfo !== null;
    const muteLabel = muteInfo?.label ?? '';

    const handleMuteClick = () => {
      setIsMenuOpen(false);
      setIsMutePickerOpen(true);
    };

    const handleMuteConfirm = (hours: number, minutes: number) => {
      const ms = (hours * 3600 + minutes * 60) * 1000;
      const label = hours > 0 ? `${hours}ч` : `${minutes}мин`;
      setMuteInfo({ until: Date.now() + ms, label });
      setIsMutePickerOpen(false);
    };

    return (
      <Container className='w-full shrink-0 p-0 px-6 py-3'>
        <Container
          as='header'
          variantsUi={{ style: 'whiteglass', rounded: 'full' }}
          className='group w-full cursor-pointer gap-3 bg-[#25252c]/80 px-4 py-2'
          onClick={openDetails}
        >
          <Avatar src={chat.avatar} alt={chat.name} size='md' shape='rounded' />

          <Container variantsUi={{ flow: 'col' }} className='flex-1 gap-0 p-0'>
            <Text
              variantsUi={{ weight: 'semibold' }}
              className='transition-colors group-hover:text-[#A74BE9]'
            >
              {chat.name}
            </Text>
            {isDm ? (
              (() => {
                const other = participants.find((p) => p.name === chat.name);
                return other?.job_title ? (
                  <Text variantsUi={{ size: 'xs', color: 'muted' }}>
                    {other.job_title}
                  </Text>
                ) : null;
              })()
            ) : (
              <Container className='gap-1.5 p-0'>
                <Users2 className='h-3 w-3 text-[#969696]' />
                <Text variantsUi={{ size: 'xs', color: 'muted' }}>
                  {participants.length} участников
                </Text>
              </Container>
            )}
          </Container>

          <Container className='gap-1 p-0'>
            {isDm && (
              <Button
                variantsUi={{ color: 'ghost', rounded: 'lg' }}
                className='p-2'
                title='Видеозвонок'
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCallOpen(true);
                }}
              >
                <Phone className='h-5 w-5' />
              </Button>
            )}

            <Button
              variantsUi={{ color: 'ghost', rounded: 'lg' }}
              className='p-2'
              onClick={(e) => {
                e.stopPropagation();
                openSearch();
              }}
            >
              <Search className='h-5 w-5' />
            </Button>

            <Container
              ref={menuWrapperRef}
              className='relative p-0'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Меню или пикер времени — в одном враппере */}
              <Conditional condition={isMenuOpen && !isMutePickerOpen}>
                <ChatMenu
                  isOpen={isMenuOpen && !isMutePickerOpen}
                  isDm={isDm}
                  isMuted={isMuted}
                  muteLabel={muteLabel}
                  onClose={() => setIsMenuOpen(false)}
                  onMuteClick={handleMuteClick}
                  onUnmute={() => {
                    setMuteInfo(null);
                    setIsMenuOpen(false);
                  }}
                />
              </Conditional>

              <Conditional condition={isMutePickerOpen}>
                <Container
                  variantsUi={{ flow: 'col', style: 'whiteglass' }}
                  className='absolute top-full right-0 z-50 mt-1 w-64 gap-0 overflow-hidden rounded-2xl bg-[#25252c]/95 p-0'
                  onClick={(e) => e.stopPropagation()}
                >
                  <MuteTimePicker
                    onConfirm={handleMuteConfirm}
                    onCancel={() => setIsMutePickerOpen(false)}
                  />
                </Container>
              </Conditional>

              <Button
                variantsUi={{ color: 'ghost', rounded: 'lg' }}
                className='p-2'
                title='Подробнее'
                onClick={() => {
                  if (isMutePickerOpen) {
                    setIsMutePickerOpen(false);
                  } else {
                    setIsMenuOpen((v) => !v);
                  }
                }}
              >
                <MoreVertical className='h-5 w-5' />
              </Button>
            </Container>
          </Container>
        </Container>

        {isCallOpen && (
          <CallModal chat={chat} onClose={() => setIsCallOpen(false)} />
        )}
      </Container>
    );
  },
);

ChatHeader.displayName = 'ChatHeader';
