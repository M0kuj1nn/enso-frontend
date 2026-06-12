import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useChatContext } from '@contexts/ChatContext';
import { useMicrophone } from '@shared/hooks/useMicrophone';

export const useVoiceNavigation = () => {
  const {
    servers,
    activeVoiceChannelId,
    leaveVoiceChannel,
    startScreenShare,
    activeScreenStream,
    stopScreenShare,
    startCamera,
    stopCamera,
    activeCameraStream,
    setMySpeaking,
  } = useChatContext();

  const router = useRouter();

  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [volume, setVolume] = useState(0);

  const handleLeaveVoice = () => {
    const server = servers.find((s) =>
      s.voice_channels.some((vc) => vc.id === activeVoiceChannelId),
    );
    leaveVoiceChannel();
    if (server) {
      const firstText = server.text_channels[0];
      router.push(
        firstText ? `/chat/${server.id}/${firstText.id}` : `/chat/${server.id}`,
      );
    }
  };

  useMicrophone(!!activeVoiceChannelId && !isMuted, {
    onVolume: (vol, speaking) => {
      setVolume(vol);
      setMySpeaking(speaking);
    },
  });

  return {
    isMuted,
    isDeafened,
    volume,
    activeVoiceChannelId,
    activeScreenStream,
    activeCameraStream,
    onToggleMic: () => setIsMuted((v) => !v),
    onToggleDeafen: () => setIsDeafened((v) => !v),
    onLeaveVoice: handleLeaveVoice,
    onToggleStream: activeScreenStream ? stopScreenShare : startScreenShare,
    onToggleCamera: activeCameraStream ? stopCamera : startCamera,
  };
};
