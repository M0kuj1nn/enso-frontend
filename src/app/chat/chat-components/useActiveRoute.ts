import { usePathname } from 'next/navigation';

import { useChatContext } from '@contexts/ChatContext';

export const useActiveRoute = () => {
  const { servers } = useChatContext();
  const pathname = usePathname();

  const activeChatId = pathname.startsWith('/chat/@me')
    ? pathname.split('/')[3]
    : '';

  const activeServerId =
    pathname.startsWith('/chat/') && !pathname.startsWith('/chat/@me')
      ? pathname.split('/')[2]
      : '';

  const activeServer = servers.find((s) => s.id === activeServerId) ?? null;

  const activeChannelId = pathname.split('/')[3] ?? '';

  return { activeChatId, activeServerId, activeServer, activeChannelId };
};
