import { FC, memo } from 'react';

import { ChatMessage as ChatMessageType } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { Reply } from 'lucide-react';

interface ReplyPreview {
  sender: string;
  text: string;
}

interface ChatMessageProps {
  message: ChatMessageType;
  isFirstInGroup: boolean;
  onReply: (message: ChatMessageType) => void;
  replyPreview?: ReplyPreview;
  onJumpToReply?: (messageId: string) => void;
  isHighlighted?: boolean;
}

const ReplyButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type='button'
    onClick={onClick}
    aria-label='Ответить'
    className='flex h-7 w-7 shrink-0 items-center justify-center self-center rounded-full text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/10 hover:text-white'
  >
    <Reply className='h-4 w-4' />
  </button>
);

const ReplyQuote: FC<{ preview: ReplyPreview; onClick?: () => void }> = ({
  preview,
  onClick,
}) => (
  <Container
    variantsUi={{ flow: 'col' }}
    className='-mx-1 -mt-0.5 mb-2 cursor-pointer gap-0.5 rounded-md border-l-2 border-[#A74BE9] bg-white/10 px-2 py-1 transition-colors hover:bg-white/15'
    onClick={onClick}
  >
    <Text className='truncate text-xs font-semibold text-[#C084FC]'>
      {preview.sender}
    </Text>
    <Text className='truncate text-xs text-white/80'>{preview.text}</Text>
  </Container>
);

export const ChatMessage: FC<ChatMessageProps> = memo(
  ({
    message,
    isFirstInGroup,
    onReply,
    replyPreview,
    onJumpToReply,
    isHighlighted,
  }) => {
    const handleJumpToReply = () => {
      if (message.reply_to_id) onJumpToReply?.(message.reply_to_id);
    };

    const highlightClass = isHighlighted ? 'brightness-165' : 'brightness-100';

    // Своё сообщение
    if (message.isOwn) {
      return (
        <Container className='justify-end p-0 px-6 py-0.5'>
          <Container className='group w-fit max-w-[70%] items-start gap-[13] p-0'>
            <ReplyButton onClick={() => onReply(message)} />

            <Container
              variantsUi={{ flow: 'col' }}
              className={`min-w-0 gap-0 bg-[#7B1CFF] p-0 px-4 py-3 transition-[filter] duration-700 ${highlightClass}`}
              style={{ borderRadius: '21px 8px 21px 21px' }}
            >
              {replyPreview && (
                <ReplyQuote
                  preview={replyPreview}
                  onClick={handleJumpToReply}
                />
              )}

              <Text
                as='p'
                variantsUi={{ size: 'sm' }}
                className='wrap-break-words leading-relaxed'
              >
                {message.text}
              </Text>

              <Text className='mt-1 block text-right text-sm leading-none text-purple-200/70'>
                {message.created_at}
              </Text>
            </Container>

            {isFirstInGroup ? (
              <Avatar
                src={message.avatar}
                alt={message.sender}
                size='lg'
                shape='circle'
              />
            ) : (
              <Container className='w-10 shrink-0 p-0' />
            )}
          </Container>
        </Container>
      );
    }

    // Чужое сообщение
    return (
      <Container className='p-0 px-6 py-0.5'>
        <Container className='group w-fit max-w-[70%] items-start gap-[13] p-0'>
          {isFirstInGroup ? (
            <Avatar
              src={message.avatar}
              alt={message.sender}
              size='lg'
              shape='circle'
            />
          ) : (
            <Container className='w-10 shrink-0 p-0' />
          )}

          <Container variantsUi={{ flow: 'col' }} className='min-w-0 gap-1 p-0'>
            {isFirstInGroup && (
              <Text
                variantsUi={{ weight: 'bold' }}
                className='truncate px-1 text-[13px] leading-none text-white/80'
              >
                {message.sender}
              </Text>
            )}

            <Container
              variantsUi={{ flow: 'col' }}
              className={`min-w-0 gap-0 bg-[#25252c] p-0 px-4 py-3 transition-[filter] duration-700 ${highlightClass}`}
              style={{
                borderRadius: isFirstInGroup
                  ? '8px 21px 21px 21px'
                  : '21px 21px 21px 21px',
              }}
            >
              {replyPreview && (
                <ReplyQuote
                  preview={replyPreview}
                  onClick={handleJumpToReply}
                />
              )}

              <Text
                as='p'
                variantsUi={{ size: 'sm', color: 'muted' }}
                className='wrap-break-words leading-relaxed text-gray-200'
              >
                {message.text}
              </Text>

              <Text className='mt-1 block text-sm leading-none text-gray-500'>
                {message.created_at}
              </Text>
            </Container>
          </Container>

          <ReplyButton onClick={() => onReply(message)} />
        </Container>
      </Container>
    );
  },
);

ChatMessage.displayName = 'ChatMessage';
