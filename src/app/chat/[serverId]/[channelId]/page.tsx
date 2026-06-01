import { ChatArea } from '../../chat-components/ChatArea';

interface ChannelPageProps {
  params: Promise<{ serverId: string; channelId: string }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channelId } = await params;
  return <ChatArea chatId={channelId} />;
}
