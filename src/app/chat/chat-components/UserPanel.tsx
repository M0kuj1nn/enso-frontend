'use client';

import { FC, memo, useEffect, useRef, useState } from 'react';

import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import {
  Headphones,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Settings,
  Video,
  VideoOff,
  VolumeX,
} from 'lucide-react';

// ─── Типы ──────────────────────────────────────────────────────────────────

export interface VoiceChannelInfo {
  serverName: string;
  channelName: string;
}

export interface UserPanelProps {
  isPanelOpen: boolean;
  userAvatar: string;
  userName: string;
  userTag: string;
  userStatus: 'online' | 'away' | 'offline';
  voiceChannel: VoiceChannelInfo | null;
  isMicMuted: boolean;
  isDeafened: boolean;
  onToggleMic: () => void;
  onToggleDeafen: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onLeaveVoice?: () => void;
  onToggleCamera?: () => void;
  onToggleStream?: () => void;
  voiceActivity?: number;
  isStreaming?: boolean;
  isCameraOn?: boolean;
}

// Индикатор звука (три полосы)

const SoundIndicator: FC<{ active: boolean; activity?: number }> = ({
  active,
  activity = 0,
}) => {
  const bars = [0.5, 1, 0.7];
  return (
    <span className='flex items-center gap-[2]'>
      {bars.map((h, i) => (
        <span
          key={i}
          className='rounded-full transition-all duration-150'
          style={{
            width: 3,
            height: active ? `${8 + h * activity * 10}px` : '5px',
            background: active
              ? `rgba(74, 222, 128, ${0.6 + activity * 0.4})`
              : 'rgba(150,150,150,0.5)',
            minHeight: 3,
            maxHeight: 18,
          }}
        />
      ))}
    </span>
  );
};

// ─── Иконка-кнопка ─────────────────────────────────────────────────────────

const IconBtn: FC<{
  onClick?: () => void;
  active?: boolean;
  danger?: boolean;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}> = ({ onClick, active, danger, title, children, size = 'md' }) => {
  const padding = size === 'sm' ? 'p-2' : 'p-2.5';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]';
  const color =
    danger && active
      ? 'userPanelDanger'
      : !danger && active
        ? 'userPanelActive'
        : 'userPanelDefault';

  return (
    <Button
      variantsUi={{ color, rounded: 'lg' }}
      className={[padding].join(' ')}
      title={title}
      onClick={onClick}
    >
      <span className={`flex items-center justify-center ${iconSize}`}>
        {children}
      </span>
    </Button>
  );
};

// ─── Развёрнутая панель ────────────────────────────────────────────────────

const ExpandedPanel: FC<UserPanelProps> = ({
  userAvatar,
  userName,
  userTag,
  userStatus,
  voiceChannel,
  isMicMuted,
  isDeafened,
  onToggleMic,
  onToggleDeafen,
  onOpenSettings,
  onOpenProfile,
  onLeaveVoice,
  onToggleCamera,
  onToggleStream,
  isStreaming,
  isCameraOn,
}) => {
  const [tagCopied, setTagCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopyTag = () => {
    navigator.clipboard.writeText(userTag);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    setTagCopied(true);
    copyTimerRef.current = setTimeout(() => setTagCopied(false), 1500);
  };

  return (
    <Container
      variantsUi={{ flow: 'col', style: 'blackglass', rounded: '2xl' }}
      className='mx-2 mb-3 gap-0 overflow-hidden p-1'
    >
      {/* Голосовой канал */}
      {voiceChannel && (
        <Container className='items-center gap-2 border-b border-white/5 px-3 py-2.5'>
          <div className='h-8 w-1 shrink-0 rounded-full bg-emerald-400' />

          <Container
            variantsUi={{ flow: 'col' }}
            className='min-w-0 flex-1 gap-0 p-0'
          >
            <Text
              variantsUi={{ size: 'xs', color: 'muted' }}
              className='truncate tracking-wide uppercase'
            >
              {voiceChannel.serverName}
            </Text>
            <Text
              variantsUi={{ size: 'xs' }}
              className='truncate text-white/80'
            >
              {voiceChannel.channelName}
            </Text>
          </Container>

          <Container className='items-center gap-1.5 p-0'>
            <IconBtn
              onClick={onToggleCamera}
              active={isCameraOn}
              title={isCameraOn ? 'Выключить камеру' : 'Включить камеру'}
            >
              {isCameraOn ? (
                <Video className='h-[18] w-[18]' />
              ) : (
                <VideoOff className='h-[18] w-[18]' />
              )}
            </IconBtn>
            <IconBtn
              onClick={onToggleStream}
              active={isStreaming}
              title={
                isStreaming ? 'Остановить трансляцию' : 'Трансляция экрана'
              }
            >
              <Monitor className='h-[18] w-[18]' />
            </IconBtn>
            <IconBtn
              onClick={onLeaveVoice}
              active
              danger
              title='Покинуть канал'
            >
              <PhoneOff className='h-[18] w-[18]' />
            </IconBtn>
          </Container>
        </Container>
      )}

      {/* Основная строка пользователя */}
      <Container className='items-center gap-2.5 px-3 py-2.5'>
        {/* Аватар — открывает профиль */}
        <button
          type='button'
          className='shrink-0 cursor-pointer rounded-full transition-opacity hover:opacity-80'
          onClick={onOpenProfile}
          title='Открыть профиль'
        >
          <Avatar
            src={userAvatar}
            alt={userName}
            size='md'
            shape='circle'
            status={userStatus}
          />
        </button>

        {/* Имя + тег */}
        <Container
          variantsUi={{ flow: 'col' }}
          className='min-w-0 flex-1 gap-0 p-0'
        >
          {/* Ник — открывает профиль */}
          <button
            type='button'
            className='w-full cursor-pointer truncate text-left transition-opacity hover:opacity-80'
            onClick={onOpenProfile}
            title='Открыть профиль'
          >
            <Text
              variantsUi={{ size: 'sm', weight: 'semibold' }}
              className='truncate'
            >
              {userName}
            </Text>
          </button>

          {/* @username — копирует в буфер обмена */}
          <div className='relative'>
            <button
              type='button'
              className='w-full cursor-pointer truncate text-left transition-opacity hover:opacity-80'
              onClick={handleCopyTag}
              title='Скопировать @username'
            >
              <Text
                variantsUi={{ size: 'xs', color: 'muted' }}
                className='truncate'
              >
                {userTag}
              </Text>
            </button>
            <span
              className={`pointer-events-none absolute bottom-full left-0 mb-1.5 rounded-lg bg-[#A74BE9] px-2 py-0.5 text-xs font-medium whitespace-nowrap text-white shadow-lg transition-all duration-200 ${tagCopied ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
            >
              Copied!
            </span>
          </div>
        </Container>

        <Container className='items-center gap-1.5 p-0'>
          <IconBtn
            onClick={onToggleMic}
            active={isMicMuted}
            danger
            title={isMicMuted ? 'Включить микрофон' : 'Выключить микрофон'}
            size='sm'
          >
            {isMicMuted ? (
              <MicOff className='h-4 w-4' />
            ) : (
              <Mic className='h-4 w-4' />
            )}
          </IconBtn>

          <IconBtn
            onClick={onToggleDeafen}
            active={isDeafened}
            danger
            title={isDeafened ? 'Включить звук' : 'Выключить звук'}
            size='sm'
          >
            {isDeafened ? (
              <VolumeX className='h-4 w-4' />
            ) : (
              <Headphones className='h-4 w-4' />
            )}
          </IconBtn>

          <IconBtn onClick={onOpenSettings} title='Настройки' size='sm'>
            <Settings className='h-4 w-4' />
          </IconBtn>
        </Container>
      </Container>
    </Container>
  );
};

// Свёрнутая панель

const CollapsedPanel: FC<UserPanelProps> = ({
  userAvatar,
  userStatus,
  voiceChannel,
  isMicMuted,
  isDeafened,
  onToggleMic,
  onToggleDeafen,
  onOpenSettings,
  onOpenProfile,
  onLeaveVoice,
  onToggleCamera,
  onToggleStream,
  isStreaming,
  isCameraOn,
  voiceActivity = 0,
}) => {
  const [extraOpen, setExtraOpen] = useState(false);
  const isInVoice = voiceChannel !== null;

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setExtraOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <Container
      ref={ref}
      variantsUi={{ flow: 'col' }}
      className='relative mx-2 mb-4 items-center gap-2 p-0'
    >
      {/* Всплывающая панель справа */}
      {extraOpen && (
        <Container
          variantsUi={{ flow: 'col', style: 'blackglass', rounded: 'xl' }}
          className='absolute bottom-0 left-full z-50 ml-2 gap-1.5 p-2 shadow-xl'
        >
          <IconBtn
            onClick={onToggleCamera}
            active={isCameraOn}
            title={isCameraOn ? 'Выключить камеру' : 'Включить камеру'}
          >
            {isCameraOn ? (
              <Video className='h-[18] w-[18]' />
            ) : (
              <VideoOff className='h-[18] w-[18]' />
            )}
          </IconBtn>
          <IconBtn
            onClick={onToggleStream}
            active={isStreaming}
            title={isStreaming ? 'Остановить трансляцию' : 'Трансляция'}
          >
            <Monitor className='h-[18] w-[18]' />
          </IconBtn>
          <IconBtn
            onClick={onLeaveVoice}
            active={isInVoice}
            danger
            title='Покинуть канал'
          >
            <PhoneOff className='h-[18] w-[18]' />
          </IconBtn>
          <IconBtn
            onClick={onToggleDeafen}
            active={isDeafened}
            danger
            title={isDeafened ? 'Включить звук' : 'Выключить звук'}
          >
            {isDeafened ? (
              <VolumeX className='h-[18] w-[18]' />
            ) : (
              <Headphones className='h-[18] w-[18]' />
            )}
          </IconBtn>
        </Container>
      )}

      {/* Карточка: аватар + кнопки */}
      <Container
        variantsUi={{ flow: 'col', style: 'blackglass', rounded: 'xl' }}
        className='w-full items-center gap-3 px-2 py-3'
      >
        <button
          type='button'
          className='cursor-pointer rounded-full transition-opacity hover:opacity-80'
          onClick={onOpenProfile}
          title='Открыть профиль'
        >
          <Avatar
            src={userAvatar}
            alt='me'
            size='md'
            shape='circle'
            status={userStatus}
          />
        </button>

        <IconBtn
          onClick={onToggleMic}
          active={isMicMuted}
          danger
          title={isMicMuted ? 'Включить микрофон' : 'Выключить микрофон'}
        >
          {isMicMuted ? (
            <MicOff className='h-[18] w-[18]' />
          ) : (
            <Mic className='h-[18] w-[18]' />
          )}
        </IconBtn>

        <IconBtn onClick={onOpenSettings} title='Настройки'>
          <Settings className='h-[18] w-[18]' />
        </IconBtn>
      </Container>

      {/* Кнопка-таблетка */}
      <Container
        variantsUi={{ style: 'blackglass', rounded: 'full' }}
        className={[
          'w-full cursor-pointer items-center justify-center gap-[3] px-3 py-2 transition-all duration-200',
          isInVoice
            ? 'bg-emerald-500/15 hover:bg-emerald-500/25'
            : 'hover:bg-white/5',
        ].join(' ')}
        onClick={() => setExtraOpen((v) => !v)}
        title={isInVoice ? 'Голосовой канал' : 'Нет голосового соединения'}
        as='button'
      >
        @ts-expect-error Container forwards onClick fine
        <SoundIndicator active={isInVoice} activity={voiceActivity} />
      </Container>
    </Container>
  );
};

// Экспортируемый компонент

export const UserPanel: FC<UserPanelProps> = memo((props) => {
  if (props.isPanelOpen) return <ExpandedPanel {...props} />;
  return <CollapsedPanel {...props} />;
});

UserPanel.displayName = 'UserPanel';
