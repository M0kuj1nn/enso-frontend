import { ReactNode } from 'react';

import { Container } from '@ui/Container';

import { ChatNavigation } from './chat-components/ChatNavigation';
import { ChatProvider } from './chat-components/ChatProvider';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <Container className='h-screen gap-0 overflow-hidden bg-[#141418] p-0 text-white'>
        <ChatNavigation />
        {children}
      </Container>
    </ChatProvider>
  );
}
