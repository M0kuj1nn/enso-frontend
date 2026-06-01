import { VoiceConference } from '@page-components/chat/chat-components/VoiceConference';

interface Props {
  params: Promise<{ serverId: string; channelId: string }>;
}

export default async function VoicePage({ params }: Props) {
  const { channelId, serverId } = await params;
  return <VoiceConference channelId={channelId} serverId={serverId} />;
}
