'use client';

import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useChatContext } from '@contexts/ChatContext';
import { ChatDetailsContext } from '@contexts/ChatDetailsContext';
import { Chat, ChatMessage as ChatMessageType } from '@shared/types/chat';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';

import { ChatComposer } from './ChatComposer';
import { ChatDetailsPanel } from './ChatDetailsPanel';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatSearch } from './ChatSearch';

// ChatDetailsProvider
const ChatDetailsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <ChatDetailsContext.Provider
      value={{
        isDetailsOpen,
        openDetails: () => setIsDetailsOpen(true),
        closeDetails: () => setIsDetailsOpen(false),
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
      }}
    >
      {children}
    </ChatDetailsContext.Provider>
  );
};

// ChatArea
interface ChatAreaProps {
  chatId: string;
}

export const ChatArea: FC<ChatAreaProps> = ({ chatId }) => {
  const { chats, messages, participants, sendMessage, servers } =
    useChatContext();

  // ref на scroll-контейнер — нужен virtualizer'у для измерений
  const scrollRef = useRef<HTMLDivElement>(null);

  const chat = chats.find((c) => c.id === chatId);

  const serverChannel = !chat
    ? servers.flatMap((s) => s.text_channels).find((tc) => tc.id === chatId)
    : null;

  const effectiveChat =
    chat ??
    (serverChannel
      ? {
          id: serverChannel.id,
          name: serverChannel.name,
          avatar:
            servers.find((s) => s.text_channels.some((tc) => tc.id === chatId))
              ?.icon ?? '',
          type: 'group' as const,
        }
      : // } as Chat
        null);

  const chatMessages = useMemo(
    () => messages[chatId] ?? [],
    [messages, chatId],
  );
  const chatParts = participants[chatId] ?? [];

  const [replyingTo, setReplyingTo] = useState<ChatMessageType | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Карта id -> сообщение, для резолва превью ответа (reply_to_id)
  const messagesById = useMemo(
    () => new Map(chatMessages.map((m) => [m.id, m])),
    [chatMessages],
  );

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(chatId, text, replyingTo?.id);
      setReplyingTo(null);
    },
    [sendMessage, chatId, replyingTo],
  );

  // Превью сообщения, на которое отвечают (резолв по reply_to_id)
  const getReplyPreview = (msg: ChatMessageType) => {
    if (!msg.reply_to_id) return undefined;
    const original = messagesById.get(msg.reply_to_id);
    return original
      ? { sender: original.sender, text: original.text }
      : undefined;
  };

  //#TODO: спиздить компонент с taskmaster
  const virtualizer = useVirtualizer({
    count: chatMessages.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 72,
    overscan: 10, // кол-во сообщений рендерить за пределами viewport
  });

  // Прокрутка вниз при новых сообщениях
  useEffect(() => {
    if (chatMessages.length > 0) {
      virtualizer.scrollToIndex(chatMessages.length - 1, { align: 'end' });
    }
  }, [chatMessages.length]);

  // Сброс ответа при переключении чата
  useEffect(() => {
    setReplyingTo(null);
  }, [chatId]);

  // Переход к сообщению, на которое отвечали — скролл + кратковременная подсветка
  const jumpToMessage = useCallback(
    (messageId: string) => {
      const index = chatMessages.findIndex((m) => m.id === messageId);
      if (index === -1) return;

      virtualizer.scrollToIndex(index, { align: 'center' });
      setHighlightedId(messageId);
      setTimeout(() => {
        setHighlightedId((current) => (current === messageId ? null : current));
      }, 1000);
    },
    [chatMessages, virtualizer],
  );

  if (!effectiveChat) {
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
    <ChatDetailsProvider>
      <Container
        as='main'
        variantsUi={{ flow: 'col' }}
        className='relative min-w-0 flex-1 gap-0 bg-[#141418] p-0'
      >
        <Container className='absolute top-0 right-0 left-0 z-10 p-0'>
          <ChatHeader chat={effectiveChat} participants={chatParts} />
        </Container>

        {/* Пустое состояние */}
        {chatMessages.length === 0 && (
          <Container
            variantsUi={{ items: 'centered' }}
            className='flex-1 p-0 pt-20 pb-20'
          >
            <Text variantsUi={{ size: 'sm', color: 'muted' }}>
              Напишите первое сообщение!
            </Text>
          </Container>
        )}

        {/* Виртуализированный список сообщений */}
        {chatMessages.length > 0 && (
          <Container
            ref={scrollRef}
            className='flex-1 overflow-y-auto p-0 pt-20 pb-20'
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const msg = chatMessages[virtualRow.index];
                const prev = chatMessages[virtualRow.index - 1];

                return (
                  /*
                    Каждый элемент абсолютно позиционирован.
                    measureElement — даёт virtualizer'у реальную высоту после рендера,
                    чтобы следующие элементы не наезжали друг на друга.
                  */
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <ChatMessage
                      message={msg}
                      isFirstInGroup={!prev || prev.sender_id !== msg.sender_id}
                      onReply={setReplyingTo}
                      replyPreview={getReplyPreview(msg)}
                      onJumpToReply={jumpToMessage}
                      isHighlighted={msg.id === highlightedId}
                    />
                  </div>
                );
              })}
            </div>
          </Container>
        )}

        <Container className='absolute right-0 bottom-0 left-0 z-10 p-0'>
          <ChatComposer
            onSend={handleSend}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
          />
        </Container>

        <ChatSearch chatId={chatId} />
        <ChatDetailsPanel chat={effectiveChat} participants={chatParts} />
      </Container>
    </ChatDetailsProvider>
  );
};
