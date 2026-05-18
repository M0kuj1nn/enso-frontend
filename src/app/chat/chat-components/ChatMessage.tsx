import { FC } from 'react';

import { Conditional } from '@components/Conditionals';
import { Message } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';

interface ChatMessageProps {
  message: Message;
  isFirstInGroup: boolean;
}

export const ChatMessage: FC<ChatMessageProps> = ({
  message,
  isFirstInGroup,
}) => {
  if (message.isOwn) {
    return (
      <Container cn='px-6 py-0.5 p-0 px-6 py-0.5 justify-end'>
        <Container
          variantsUi={{ flow: 'col' }}
          cn='max-w-[65%] bg-[#A74BE9] px-4 py-3 rounded-2xl p-0 px-4 py-3'
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
            cn='leading-relaxed break-words'
          >
            {message.content}
          </Text>
          <Text
            variantsUi={{ size: 'xs' }}
            className='mt-1 block text-right text-purple-200/70'
          >
            {message.timestamp}
          </Text>
        </Container>
      </Container>
    );
  }

  return (
    <Container cn='px-6 py-0.5 p-0 px-6 py-0.5'>
      <Container
        variantsUi={{ flow: 'col' }}
        cn='max-w-[65%] bg-[#25252c] px-4 py-3 rounded-2xl p-0 px-4 py-3'
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
          cn='leading-relaxed break-words text-gray-200'
        >
          {message.content}
        </Text>
        <Text
          variantsUi={{ size: 'xs', color: 'muted' }}
          className='mt-1 block'
        >
          {message.timestamp}
        </Text>
      </Container>
    </Container>
  );
};
