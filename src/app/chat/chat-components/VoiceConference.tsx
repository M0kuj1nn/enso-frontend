'use client';

import { FC, memo, useEffect, useRef, useState } from 'react';

import { useChatContext } from '@contexts/ChatContext';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { MonitorPlay } from 'lucide-react';

import { VoiceConferenceHeader } from './VoiceConferenceHeader';

interface VoiceConferenceProps {
  channelId: string;
  serverId: string;
}

// Маленький аватар/видео поверх трансляции
const OverlayAvatar: FC<{
  src: string;
  name: string;
  isSpeaking: boolean;
  size?: 'sm' | 'md';
}> = ({ src, name, isSpeaking, size = 'sm' }) => {
  const dim = size === 'md' ? 'h-14 w-14' : 'h-10 w-10';
  return (
    <div className='flex flex-col items-center gap-1'>
      <div
        className={[
          dim,
          'overflow-hidden rounded-full transition-all duration-300',
          isSpeaking
            ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-black/50'
            : 'ring-1 ring-white/20 ring-offset-1 ring-offset-black/50',
        ].join(' ')}
      >
        <img src={src} alt={name} className='h-full w-full object-cover' />
      </div>
      <Text
        variantsUi={{ size: 'xs' }}
        className='max-w-[64px] truncate text-white/70'
      >
        {name}
      </Text>
    </div>
  );
};

// Видео-тайл — используется и для главного окна и для угловой вставки
const VideoTile: FC<{
  stream: MediaStream;
  muted?: boolean;
  className?: string;
  rounded?: string;
}> = ({ stream, muted = true, className = '', rounded = 'rounded-2xl' }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return (
    <video
      ref={ref}
      autoPlay
      muted={muted}
      playsInline
      className={['h-full w-full object-cover', rounded, className].join(' ')}
    />
  );
};

// Главное окно трансляции (экран или вебка) с угловой вставкой второго потока
const StreamView: FC<{
  mainStream: MediaStream;
  mainLabel: string;
  pipStream: MediaStream | null;
  pipLabel: string;
  streamerAvatar: string;
  streamerName: string;
  streamerIsSpeaking: boolean;
  viewers: {
    user: { id: string; avatar: string; name: string };
    isSpeaking: boolean;
  }[];
  onSwap: () => void; // клик по pip-окну — меняет главное и pip местами
  onClose: () => void;
}> = ({
  mainStream,
  pipStream,
  streamerAvatar,
  streamerName,
  streamerIsSpeaking,
  viewers,
  onSwap,
  onClose,
}) => (
  <div className='relative w-full flex-1 overflow-hidden rounded-2xl bg-black'>
    {/* Главный поток */}
    <VideoTile
      stream={mainStream}
      className='absolute inset-0'
      rounded='rounded-none'
    />

    {/* Кнопка закрыть */}
    <Button
      variantsUi={{ color: 'danger', rounded: 'lg' }}
      className='absolute top-3 right-3 z-20 p-1.5 opacity-70 hover:opacity-100'
      onClick={onClose}
    >
      <span className='px-1 text-xs font-medium'>✕</span>
    </Button>

    {/* PiP-окно (второй поток) — правый нижний угол, кликабельное */}
    {pipStream ? (
      <div
        className='absolute right-3 bottom-3 z-10 h-24 w-36 cursor-pointer overflow-hidden rounded-xl shadow-lg ring-2 ring-white/20 transition-transform hover:scale-105'
        onClick={onSwap}
        title='Переключить'
      >
        <VideoTile stream={pipStream} rounded='rounded-none' />
      </div>
    ) : (
      /* Если второго потока нет — просто аватар стримера */
      <div className='absolute right-3 bottom-3 z-10'>
        <OverlayAvatar
          src={streamerAvatar}
          name={streamerName}
          isSpeaking={streamerIsSpeaking}
          size='md'
        />
      </div>
    )}

    {/* Зрители — левый нижний угол */}
    {viewers.length > 0 && (
      <div className='absolute bottom-3 left-3 z-10 flex items-end gap-2'>
        {viewers.map(({ user, isSpeaking }) => (
          <OverlayAvatar
            key={user.id}
            src={user.avatar}
            name={user.name}
            isSpeaking={isSpeaking}
            size='sm'
          />
        ))}
      </div>
    )}
  </div>
);

export const VoiceConference: FC<VoiceConferenceProps> = memo(
  ({ channelId, serverId }) => {
    const {
      servers,
      participants,
      leaveVoiceChannel,
      currentUser,
      activeScreenStream,
      activeCameraStream,
      stopScreenShare,
    } = useChatContext();

    // true = главное окно — экран, pip — камера
    // false = главное окно — камера, pip — экран
    const [screenIsMain, setScreenIsMain] = useState(true);
    const hasScreen = activeScreenStream !== null;
    const hasCamera = activeCameraStream !== null;
    const hasAnyStream = hasScreen || hasCamera;

    const [watchingStreamRaw, setWatchingStream] = useState(false);
    const watchingStream = watchingStreamRaw && (hasScreen || hasCamera);

    const server = servers.find((s) => s.id === serverId);
    const channel = server?.voice_channels.find((c) => c.id === channelId);

    const allUsers = Object.values(participants)
      .flat()
      .filter((u, i, arr) => arr.findIndex((x) => x.id === u.id) === i);

    const voiceParticipants = (channel?.participants ?? [])
      .map((p) => ({
        user: allUsers.find((u) => u.id === p.userId),
        isSpeaking: p.isSpeaking,
      }))
      .filter((p) => p.user != null) as {
      user: (typeof allUsers)[0];
      isSpeaking: boolean;
    }[];

    if (!channel) {
      return (
        <Container className='flex-1 items-center justify-center'>
          <Text variantsUi={{ color: 'muted' }}>Канал не найден</Text>
        </Container>
      );
    }

    const N = voiceParticipants.length;

    const streamerEntry = voiceParticipants.find(
      (p) => p.user.id === currentUser.id,
    );
    const viewers = voiceParticipants.filter(
      (p) => p.user.id !== currentUser.id,
    );

    // Определяем что главное а что pip
    let mainStream: MediaStream | null = null;
    let pipStream: MediaStream | null = null;

    if (hasScreen && hasCamera) {
      mainStream = screenIsMain ? activeScreenStream : activeCameraStream;
      pipStream = screenIsMain ? activeCameraStream : activeScreenStream;
    } else if (hasScreen) {
      mainStream = activeScreenStream;
    } else if (hasCamera) {
      mainStream = activeCameraStream;
    }

    return (
      <Container
        variantsUi={{ flow: 'col' }}
        className='h-full flex-1 gap-0 p-0'
      >
        <VoiceConferenceHeader
          channelName={channel.name}
          participantCount={N}
          onLeave={leaveVoiceChannel}
        />

        <Container
          variantsUi={{ flow: 'col' }}
          className='relative flex-1 gap-4 overflow-hidden p-6'
        >
          {/* Главное окно трансляции */}
          {hasAnyStream && watchingStream && mainStream && (
            <StreamView
              mainStream={mainStream}
              mainLabel={hasScreen && screenIsMain ? 'Экран' : 'Камера'}
              pipStream={pipStream}
              pipLabel={hasScreen && screenIsMain ? 'Камера' : 'Экран'}
              streamerAvatar={currentUser.avatar}
              streamerName={currentUser.name}
              streamerIsSpeaking={streamerEntry?.isSpeaking ?? false}
              viewers={viewers}
              onSwap={() => setScreenIsMain((v) => !v)}
              onClose={() => setWatchingStream(false)}
            />
          )}

          {/* Аватарки участников */}
          {(!hasAnyStream || !watchingStream) && (
            <Container className='flex-1 items-center justify-center gap-0 p-0'>
              {N === 0 ? (
                <Text variantsUi={{ color: 'muted' }}>Никого нет в канале</Text>
              ) : (
                <div className='flex items-end justify-center gap-12'>
                  {voiceParticipants.map(({ user, isSpeaking }, i) => {
                    const center = (N - 1) / 2;
                    const offset = Math.pow(Math.abs(i - center), 1.5) * 50;
                    const isMe = user.id === currentUser.id;

                    return (
                      <div
                        key={user.id}
                        className='flex flex-col items-center gap-3 transition-transform duration-300'
                        style={{ transform: `translateY(${offset}px)` }}
                      >
                        {/* Кнопка «Смотреть трансляцию» над аватаркой стримера */}
                        {isMe && hasAnyStream && (
                          <Button
                            variantsUi={{ color: 'ghost', rounded: 'lg' }}
                            className='flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1.5 text-emerald-400 hover:bg-emerald-500/30'
                            onClick={() => setWatchingStream(true)}
                          >
                            <MonitorPlay className='h-4 w-4' />
                            <Text
                              variantsUi={{ size: 'xs' }}
                              className='text-emerald-400'
                            >
                              {hasScreen && hasCamera
                                ? 'Смотреть трансляцию'
                                : hasScreen
                                  ? 'Смотреть экран'
                                  : 'Смотреть камеру'}
                            </Text>
                          </Button>
                        )}

                        {/* Аватарка — если это я и включена камера, показываем превью камеры */}
                        {isMe && hasCamera && !watchingStream ? (
                          <div
                            className={[
                              'h-32 w-32 cursor-pointer overflow-hidden rounded-full transition-all duration-300',
                              isSpeaking
                                ? 'ring-4 ring-emerald-400 ring-offset-4 ring-offset-[#141418]'
                                : 'ring-2 ring-white/10 ring-offset-2 ring-offset-[#141418]',
                            ].join(' ')}
                            onClick={() => setWatchingStream(true)}
                            title='Открыть камеру'
                          >
                            <VideoTile
                              stream={activeCameraStream}
                              rounded='rounded-full'
                            />
                          </div>
                        ) : (
                          <div
                            className={[
                              'h-32 w-32 overflow-hidden rounded-full transition-all duration-300',
                              isSpeaking
                                ? 'ring-4 ring-emerald-400 ring-offset-4 ring-offset-[#141418]'
                                : 'ring-2 ring-white/10 ring-offset-2 ring-offset-[#141418]',
                            ].join(' ')}
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className='h-full w-full object-cover'
                            />
                          </div>
                        )}

                        <Text
                          variantsUi={{ size: 'sm' }}
                          className='text-white/80'
                        >
                          {user.name}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              )}
            </Container>
          )}
        </Container>
      </Container>
    );
  },
);

VoiceConference.displayName = 'VoiceConference';
