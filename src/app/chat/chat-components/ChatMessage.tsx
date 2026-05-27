import { FC, memo } from 'react';

import { Message } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';

interface ChatMessageProps {
  message: Message;
  isFirstInGroup: boolean;
}

export const ChatMessage: FC<ChatMessageProps> = memo(
  ({ message, isFirstInGroup }) => {
    // Своё сообщение
    if (message.isOwn) {
      return (
        <Container className='items-start justify-end gap-[13] p-0 px-6 py-0.5'>
          {/* Пузырь */}
          <Container
            variantsUi={{ flow: 'col' }}
            className='max-w-[70%] gap-0 bg-[#7B1CFF] p-0 px-4 py-3'
            style={{ borderRadius: '21px 8px 21px 21px' }}
          >
            {/* Ник + время — только у первого в группе */}
            {isFirstInGroup && (
              <Container className='mb-2 justify-between gap-3 p-0'>
                <Text
                  variantsUi={{ weight: 'bold' }}
                  className='flex-1 truncate text-[16px] leading-none text-white'
                >
                  {message.sender}
                </Text>
                {/* TODO: role icons */}
                <Text className='shrink-0 text-sm leading-none text-purple-200/70'>
                  {message.created_at}
                </Text>
              </Container>
            )}

            {/* Текст */}
            <Text
              as='p'
              variantsUi={{ size: 'sm' }}
              className='wrap-break-words leading-relaxed'
            >
              {message.text}
            </Text>

            {/* Время для не-первых в группе */}
            {!isFirstInGroup && (
              <Text className='mt-1 block text-right text-sm leading-none text-purple-200/70'>
                {message.created_at}
              </Text>
            )}
          </Container>

          {/* Аватар снаружи — выровнен по верхнему краю пузыря */}
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
      );
    }

    // Чужое сообщение
    return (
      <Container className='items-start gap-[13] p-0 px-6 py-0.5'>
        {/* Аватар снаружи слева — выровнен по верхнему краю */}
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

        {/* Пузырь */}
        <Container
          variantsUi={{ flow: 'col' }}
          className='max-w-[70%] gap-0 bg-[#25252c] p-0 px-4 py-3'
          style={{ borderRadius: '8px 21px 21px 21px' }}
        >
          {isFirstInGroup && (
            <Container className='mb-2 justify-between gap-3 p-0'>
              <Text
                variantsUi={{ weight: 'bold' }}
                className='flex-1 truncate text-[16px] leading-none text-white/90'
              >
                {message.sender}
              </Text>
              {/* TODO: role icons */}
              <Text className='shrink-0 text-sm leading-none text-gray-500'>
                {message.created_at}
              </Text>
            </Container>
          )}

          <Text
            as='p'
            variantsUi={{ size: 'sm', color: 'muted' }}
            className='wrap-break-words leading-relaxed text-gray-200'
          >
            {message.text}
          </Text>

          {!isFirstInGroup && (
            <Text className='mt-1 block text-sm leading-none text-gray-500'>
              {message.created_at}
            </Text>
          )}
        </Container>
      </Container>
    );
  },
);

ChatMessage.displayName = 'ChatMessage';
