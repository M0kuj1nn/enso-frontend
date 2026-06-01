import { DmCall } from '@page-components/chat/chat-components/DmCall';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CallPage({ params }: Props) {
  const { id } = await params;
  return <DmCall chatId={id} />;
}
