'use client';

import { FC, useEffect, useRef, useState } from 'react';

import { Conditional } from '@components/Conditionals';
import { useChatContext } from '@contexts/ChatContext';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';

import { ChatComposer } from './ChatComposer';
import { ChatDetailsPanel } from './ChatDetailsPanel';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';

interface ChatAreaProps {
  chatId: string;
}

export const ChatArea: FC<ChatAreaProps> = ({ chatId }) => {
  const { chats, messages, participants, sendMessage } = useChatContext();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chat = chats.find((c) => c.id === chatId);
  const chatMessages = messages[chatId] ?? [];
  const chatParts = participants[chatId] ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  if (!chat) {
    return (
      <Container
        variantsUi={{ items: 'centered' }}
        className='flex-1 bg-[#141418] p-0'
      >
        <Text variantsUi={{ color: 'muted' }}>Чат не найден</Text>
      </Container>
    );
  }

  return (
    <Container
      as='main'
      variantsUi={{ flow: 'col' }}
      className='relative min-w-0 flex-1 gap-0 bg-[#141418] p-0'
    >
      <ChatHeader
        chat={chat}
        participants={chatParts}
        onOpenDetails={() => setIsDetailsOpen(true)}
      />

      {/* Сообщения */}
      <Container
        variantsUi={{ flow: 'col' }}
        cn='flex-1 overflow-y-auto py-4 p-0 py-4 gap-0'
      >
        <Conditional condition={chatMessages.length === 0}>
          <Container variantsUi={{ items: 'centered' }} className='flex-1 p-0'>
            <Text variantsUi={{ size: 'sm', color: 'muted' }}>
              Напишите первое сообщение!
            </Text>
          </Container>
        </Conditional>

        {chatMessages.map((msg, i) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isFirstInGroup={
              !chatMessages[i - 1] ||
              chatMessages[i - 1].senderId !== msg.senderId
            }
          />
        ))}

        <Container ref={bottomRef} className='p-0' />
      </Container>

      <ChatComposer onSend={(content) => sendMessage(chatId, content)} />

      <ChatDetailsPanel
        isOpen={isDetailsOpen}
        chat={chat}
        participants={chatParts}
        onClose={() => setIsDetailsOpen(false)}
      />
    </Container>
  );
};
