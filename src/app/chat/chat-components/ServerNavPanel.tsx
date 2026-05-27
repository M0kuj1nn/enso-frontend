'use client';

import { FC, memo } from 'react';

import { useRouter } from 'next/navigation';

import { useChatContext } from '@contexts/ChatContext';
import { Server, TextChannel, VoiceChannel } from '@shared/types/chat';
import { User } from '@shared/types/user';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { Hash, Mic, Plus, Volume2 } from 'lucide-react';
import { MonitorPlay } from 'lucide-react';

import { VoiceChannelMember } from './VoiceChannelMember';

interface ServerNavPanelProps {
  server: Server;
  activeChannelId: string;
  onTextChannelClick: (channelId: string) => void;
  onVoiceChannelClick: (channelId: string) => void;
  onAddTextChannel: () => void;
  onAddVoiceChannel: () => void;
}

interface TextChannelItemProps {
  channel: TextChannel;
  isActive: boolean;
  onClick: (id: string) => void;
}

const TextChannelItem: FC<TextChannelItemProps> = memo(
  ({ channel, isActive, onClick }) => (
    <Button
      variantsUi={{ color: 'ghost' }}
      cn={[
        'w-full justify-start gap-2 px-3 py-2 rounded-lg relative',
        isActive && 'bg-gradient-to-r from-[#A74BE9]/20 to-[#A74BE9]/5',
      ]}
      onClick={() => onClick(channel.id)}
    >
      <Hash className='h-4 w-4 shrink-0 text-[#969696]' />
      <Text
        variantsUi={{ size: 'sm' }}
        className={isActive ? 'text-white' : 'text-gray-400'}
      >
        {channel.name}
      </Text>
    </Button>
  ),
);

TextChannelItem.displayName = 'TextChannelItem';

interface VoiceChannelItemProps {
  channel: VoiceChannel;
  isActive: boolean;
  isJoined: boolean;
  resolvedParticipants: { user: User; isSpeaking: boolean }[];
  onClick: (id: string) => void;
  onJoinConference: (channelId: string) => void;
}

const VoiceChannelItem: FC<VoiceChannelItemProps> = memo(
  ({
    channel,
    isActive,
    isJoined,
    resolvedParticipants,
    onClick,
    onJoinConference,
  }) => {
    const hasParticipants = resolvedParticipants.length > 0;

    return (
      <div className='flex flex-col'>
        <div className='group relative flex items-center'>
          <Button
            variantsUi={{ color: 'ghost' }}
            cn={[
              'w-full justify-start gap-2 px-3 py-2 rounded-lg',
              (isActive || isJoined) &&
                'bg-gradient-to-r from-[#A74BE9]/20 to-[#A74BE9]/5',
            ]}
            onClick={() => onClick(channel.id)}
          >
            <Volume2 className='h-4 w-4 shrink-0 text-[#969696]' />
            <Text
              variantsUi={{ size: 'sm' }}
              className={isActive || isJoined ? 'text-white' : 'text-gray-400'}
            >
              {channel.name}
            </Text>
            {hasParticipants && !isJoined && (
              <span className='ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400' />
            )}
          </Button>

          <Button
            variantsUi={{ color: 'ghost', rounded: 'lg' }}
            className={[
              'absolute right-1 p-1.5 transition-opacity duration-150',
              isJoined
                ? 'text-emerald-400 opacity-100'
                : 'opacity-0 group-hover:opacity-100',
            ].join(' ')}
            title='Войти в конференцию'
            onClick={(e) => {
              e.stopPropagation();
              onJoinConference(channel.id);
            }}
          >
            <MonitorPlay className='h-3.5 w-3.5' />
          </Button>
        </div>

        {hasParticipants && (
          <div className='flex flex-col pb-1 pl-6'>
            {resolvedParticipants.map(({ user, isSpeaking }) => (
              <VoiceChannelMember
                key={user.id}
                user={user}
                isSpeaking={isSpeaking}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

VoiceChannelItem.displayName = 'VoiceChannelItem';

export const ServerNavPanel: FC<ServerNavPanelProps> = memo(
  ({
    server,
    activeChannelId,
    onTextChannelClick,
    onVoiceChannelClick,
    onAddTextChannel,
    onAddVoiceChannel,
  }) => {
    const router = useRouter();
    const { activeVoiceChannelId, participants } = useChatContext();

    const allUsers = Object.values(participants)
      .flat()
      .filter((u, i, arr) => arr.findIndex((x) => x.id === u.id) === i);

    const resolveParticipants = (channel: VoiceChannel) =>
      channel.participants
        .map((p) => ({
          user: allUsers.find((u) => u.id === p.userId),
          isSpeaking: p.isSpeaking,
        }))
        .filter((p) => p.user != null) as { user: User; isSpeaking: boolean }[];

    return (
      <Container
        variantsUi={{ flow: 'col' }}
        className='h-full w-64 shrink-0 gap-0 border-r border-white/5 bg-[#141418] p-0'
      >
        {/* Шапка сервера */}
        <Container className='h-16 gap-3 border-b border-white/5 px-4'>
          <Avatar
            src={server.icon}
            alt={server.name}
            size='sm'
            shape='rounded'
          />
          <Container
            variantsUi={{ flow: 'col' }}
            className='min-w-0 flex-1 gap-0 p-0'
          >
            <Text
              variantsUi={{ size: 'sm', weight: 'semibold' }}
              className='truncate'
            >
              {server.name}
            </Text>
            <Text
              variantsUi={{ size: 'xs', color: 'muted' }}
              className='truncate'
            >
              {server.topic}
            </Text>
          </Container>
        </Container>

        {/* Каналы */}
        <Container
          variantsUi={{ flow: 'col' }}
          className='flex-1 gap-0 overflow-y-auto p-3'
        >
          {/* Текстовые каналы */}
          <Container className='mb-1 items-center justify-between p-0 px-1'>
            <Text
              variantsUi={{ size: 'xs', color: 'muted' }}
              className='font-semibold tracking-wider uppercase'
            >
              Текстовые
            </Text>
            <Button
              variantsUi={{ color: 'ghost', rounded: 'lg' }}
              className='p-1'
              title='Добавить канал'
              onClick={onAddTextChannel}
            >
              <Plus className='h-3.5 w-3.5' />
            </Button>
          </Container>

          {server.text_channels.map((channel) => (
            <TextChannelItem
              key={channel.id}
              channel={channel}
              isActive={channel.id === activeChannelId}
              onClick={onTextChannelClick}
            />
          ))}

          {/* Голосовые каналы */}
          <Container className='mt-4 mb-1 items-center justify-between p-0 px-1'>
            <Text
              variantsUi={{ size: 'xs', color: 'muted' }}
              className='font-semibold tracking-wider uppercase'
            >
              Голосовые
            </Text>
            <Button
              variantsUi={{ color: 'ghost', rounded: 'lg' }}
              className='p-1'
              title='Добавить канал'
              onClick={onAddVoiceChannel}
            >
              <Plus className='h-3.5 w-3.5' />
            </Button>
          </Container>

          {server.voice_channels.map((channel) => (
            <VoiceChannelItem
              key={channel.id}
              channel={channel}
              isActive={channel.id === activeChannelId}
              isJoined={channel.id === activeVoiceChannelId}
              resolvedParticipants={resolveParticipants(channel)}
              onClick={onVoiceChannelClick}
              onJoinConference={(channelId) => {
                router.push(`/chat/${server.id}/${channelId}/voice`);
              }}
            />
          ))}
        </Container>
      </Container>
    );
  },
);

ServerNavPanel.displayName = 'ServerNavPanel';
