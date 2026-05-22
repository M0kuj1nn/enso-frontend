import { ReactNode } from 'react';

import { Container } from '@ui/Container';

import { ChatNavigation } from './chat-components/ChatNavigation';
import { ChatProvider } from './chat-components/ChatProvider';
import { Providers } from './chat-components/Providers';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <ChatProvider>
        <Container className='h-screen gap-0 overflow-hidden bg-[#141418] p-0 text-white'>
          <ChatNavigation />
          {children}
        </Container>
      </ChatProvider>
    </Providers>
  );
}
