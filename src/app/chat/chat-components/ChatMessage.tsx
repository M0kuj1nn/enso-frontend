import { FC, memo } from 'react';

import { Conditional } from '@components/Conditionals';
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
    if (message.isOwn) {
      return (
        <Container className='justify-end p-0 px-6 py-0.5'>
          <Container
            variantsUi={{ flow: 'col' }}
            className='max-w-[65%] rounded-2xl bg-[#A74BE9] p-0 px-4 py-3'
            style={{ borderBottomRightRadius: 6 }}
          >
            <Conditional condition={isFirstInGroup}>
              <Container className='mb-1.5 justify-end gap-2 p-0'>
                <Text
                  variantsUi={{ size: 'xs', weight: 'medium' }}
                  className='text-purple-200'
                >
                  {message.sender}
                </Text>
                <Avatar
                  src={message.avatar}
                  alt={message.sender}
                  size='xs'
                  shape='circle'
                />
              </Container>
            </Conditional>
            <Text
              as='p'
              variantsUi={{ size: 'sm' }}
              className='wrap-break-words leading-relaxed'
            >
              {message.text}
            </Text>
            <Text
              variantsUi={{ size: 'xs' }}
              className='mt-1 block text-right text-purple-200/70'
            >
              {message.created_at}
            </Text>
          </Container>
        </Container>
      );
    }

    return (
      <Container className='p-0 px-6 py-0.5'>
        <Container
          variantsUi={{ flow: 'col' }}
          className='max-w-[65%] rounded-2xl bg-[#25252c] p-0 px-4 py-3'
          style={{ borderBottomLeftRadius: 6 }}
        >
          <Conditional condition={isFirstInGroup}>
            <Container className='mb-1.5 gap-2 p-0'>
              <Avatar
                src={message.avatar}
                alt={message.sender}
                size='xs'
                shape='circle'
              />
              <Text
                variantsUi={{ size: 'xs', weight: 'medium' }}
                className='text-white/80'
              >
                {message.sender}
              </Text>
            </Container>
          </Conditional>
          <Text
            as='p'
            variantsUi={{ size: 'sm', color: 'muted' }}
            className='wrap-break-words leading-relaxed text-gray-200'
          >
            {message.text}
          </Text>
          <Text
            variantsUi={{ size: 'xs', color: 'muted' }}
            className='mt-1 block'
          >
            {message.created_at}
          </Text>
        </Container>
      </Container>
    );
  },
);

ChatMessage.displayName = 'ChatMessage';
