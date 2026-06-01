'use client';

import { FC, memo, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useChatContext } from '@contexts/ChatContext';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { PhoneOff, Video } from 'lucide-react';

interface DmCallProps {
  chatId: string;
}

export const DmCall: FC<DmCallProps> = memo(({ chatId }) => {
  const { chats, currentUser, activeCameraStream, startCamera, stopCamera } =
    useChatContext();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [callDuration, setCallDuration] = useState(0);

  const chat = chats.find((c) => c.id === chatId);
  const participant = chat?.participantIds.find((id) => id !== 'me');

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((v) => v + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current && activeCameraStream) {
      videoRef.current.srcObject = activeCameraStream;
    }
  }, [activeCameraStream]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleEnd = () => {
    stopCamera();
    router.push(`/chat/me/${chatId}`);
  };

  if (!chat) return null;

  return (
    <Container
      variantsUi={{ flow: 'col' }}
      className='relative h-full flex-1 items-center justify-center gap-8 overflow-hidden bg-[#141418]'
    >
      {/* Аватар собеседника */}
      <div className='relative z-10 flex flex-col items-center gap-4'>
        <div className='h-32 w-32 overflow-hidden rounded-full ring-4 ring-[#A74BE9]/50 ring-offset-4 ring-offset-[#141418]'>
          <img
            src={chat.avatar}
            alt={chat.name}
            className='h-full w-full object-cover'
          />
        </div>
        <Text variantsUi={{ size: 'xl', weight: 'semibold' }}>{chat.name}</Text>
        <Text variantsUi={{ size: 'sm', color: 'muted' }}>
          {formatDuration(callDuration)}
        </Text>
      </div>

      {/* Превью своей камеры */}
      {activeCameraStream && (
        <div className='absolute right-6 bottom-28 z-10 h-32 w-48 overflow-hidden rounded-2xl ring-2 ring-white/20'>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className='h-full w-full object-cover'
          />
        </div>
      )}

      {/* Кнопки управления */}
      <Container className='relative z-10 gap-4 p-0'>
        <Button
          variantsUi={{ color: 'ghost', rounded: 'full' }}
          className={[
            'h-14 w-14 p-0 transition-colors',
            activeCameraStream
              ? 'bg-[#A74BE9] hover:bg-[#9040d0]'
              : 'bg-white/10 hover:bg-white/20',
          ].join(' ')}
          title={activeCameraStream ? 'Выключить камеру' : 'Включить камеру'}
          onClick={activeCameraStream ? stopCamera : startCamera}
        >
          <Video className='h-6 w-6' />
        </Button>

        <Button
          variantsUi={{ color: 'danger', rounded: 'full' }}
          className='h-14 w-14 p-0'
          title='Завершить звонок'
          onClick={handleEnd}
        >
          <PhoneOff className='h-6 w-6' />
        </Button>
      </Container>
    </Container>
  );
});

DmCall.displayName = 'DmCall';
