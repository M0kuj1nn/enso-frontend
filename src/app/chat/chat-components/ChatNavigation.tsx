'use client';

import { FC, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Conditional } from '@components/Conditionals';
import { useChatContext } from '@contexts/ChatContext';
import { Container } from '@ui/Container';

import { AddFriendModal } from './AddFriendModal';
import { CreateChannelModal } from './CreateChannelModal';
import { CreateServerModal } from './CreateServerModal';
import { NavPanel } from './NavPanel';
import { NavStrip } from './NavStrip';
import { NewChatModal } from './NewChatModal';
import { ServerNavPanel } from './ServerNavPanel';
import { UserPanel } from './UserPanel';
import { useActiveRoute } from './useActiveRoute';
import { useNavigationModals } from './useNavigationModals';
import { useVoiceNavigation } from './useVoiceNavigation';

// ChatNavigation
// Композиция: только состояние и роутинг, никакого JSX кроме сборки частей

export const ChatNavigation: FC = () => {
  //useActiveRoute
  const { activeChatId, activeServerId, activeServer, activeChannelId } =
    useActiveRoute();

  //useVoiceNavigation
  const {
    isMuted,
    isDeafened,
    volume,
    onToggleMic,
    onToggleDeafen,
    onLeaveVoice,
    onToggleStream,
    onToggleCamera,
    activeScreenStream,
    activeCameraStream,
    activeVoiceChannelId,
  } = useVoiceNavigation();

  //useNavigationModals
  const {
    isAddFriendOpen,
    isNewChatOpen,
    isCreateServerOpen,
    createChannelModal,
    openAddFriend,
    closeAddFriend,
    openNewChat,
    closeNewChat,
    openCreateServer,
    closeCreateServer,
    openCreateChannel,
    closeCreateChannel,
  } = useNavigationModals();

  const {
    currentUser,
    chats,
    servers,
    createServer,
    addTextChannel,
    addVoiceChannel,
    joinVoiceChannel,
  } = useChatContext();
  const router = useRouter();

  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleSelect = (id: string) => router.push(`/chat/@me/${id}`);

  const handleDmClick = () => {
    if (!isPanelOpen) setIsPanelOpen(true);
    router.push('/chat/@me');
  };

  const handleCreateServer = (name: string, topic: string, icon: string) => {
    const server = createServer(name, topic, icon);
    router.push(`/chat/${server.id}`);
  };

  return (
    <>
      <Container className='relative h-full shrink-0 gap-0 border-r border-white/5 p-0'>
        <NavStrip
          isPanelOpen={isPanelOpen}
          isMuted={isMuted}
          currentUserAvatar={currentUser.avatar}
          currentUserName={currentUser.name}
          currentUserStatus={currentUser.status}
          onTogglePanel={() => setIsPanelOpen((v) => !v)}
          onToggleMute={onToggleMic}
          onDmClick={handleDmClick}
          onAddServerClick={openCreateServer}
          servers={servers}
          activeServerId={activeServerId}
          onServerClick={(id) => router.push(`/chat/${id}`)}
        />

        <Conditional condition={isPanelOpen}>
          {activeServer ? (
            <ServerNavPanel
              server={activeServer}
              activeChannelId={activeChannelId}
              onTextChannelClick={(channelId) =>
                router.push(`/chat/${activeServer.id}/${channelId}`)
              }
              onVoiceChannelClick={(channelId) => {
                joinVoiceChannel(channelId);
                router.push(`/chat/${activeServer!.id}/${channelId}/voice`);
              }}
              onAddTextChannel={() => openCreateChannel('text')}
              onAddVoiceChannel={() => openCreateChannel('voice')}
            />
          ) : (
            <NavPanel
              chats={chats}
              activeChatId={activeChatId}
              isMuted={isMuted}
              currentUserAvatar={currentUser.avatar}
              currentUserName={currentUser.name}
              currentUserStatus={currentUser.status}
              currentUserTag={currentUser.username}
              onSelect={handleSelect}
              onToggleMute={onToggleMic}
              onNewChat={openNewChat}
            />
          )}
        </Conditional>
        <div className='absolute right-0 bottom-0 left-0 z-50'>
          <UserPanel
            isPanelOpen={isPanelOpen}
            userAvatar={currentUser.avatar}
            userName={currentUser.name}
            userTag={currentUser.username}
            userStatus={currentUser.status}
            voiceChannel={(() => {
              if (!activeVoiceChannelId) return null;
              const server = servers.find((s) =>
                s.voice_channels.some((vc) => vc.id === activeVoiceChannelId),
              );
              const channel = server?.voice_channels.find(
                (vc) => vc.id === activeVoiceChannelId,
              );
              if (!server || !channel) return null;
              return { serverName: server.name, channelName: channel.name };
            })()}
            isMicMuted={isMuted}
            isDeafened={isDeafened}
            onToggleMic={onToggleMic}
            onToggleDeafen={onToggleDeafen}
            onOpenSettings={() => {}}
            onLeaveVoice={onLeaveVoice}
            onToggleStream={onToggleStream}
            isStreaming={activeScreenStream !== null}
            onToggleCamera={onToggleCamera}
            isCameraOn={activeCameraStream !== null}
            voiceActivity={volume}
          />
        </div>
      </Container>

      <AddFriendModal isOpen={isAddFriendOpen} onClose={closeAddFriend} />
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={closeNewChat}
        onCreated={(id) => router.push(`/chat/@me/${id}`)}
      />
      <CreateServerModal
        isOpen={isCreateServerOpen}
        onClose={closeCreateServer}
        onCreated={handleCreateServer}
      />
      <CreateChannelModal
        isOpen={createChannelModal.open}
        channelType={createChannelModal.type}
        onClose={closeCreateChannel}
        onCreated={(name) => {
          if (activeServer) {
            createChannelModal.type === 'text'
              ? addTextChannel(activeServer.id, name)
              : addVoiceChannel(activeServer.id, name);
          }
        }}
      />
    </>
  );
};
