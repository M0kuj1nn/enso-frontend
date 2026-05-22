'use client';

import { FC, KeyboardEvent, memo, useState } from 'react';

import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Input } from '@ui/Input';
import { Paperclip, Send, Smile } from 'lucide-react';

interface ChatComposerProps {
  onSend: (content: string) => void;
}

export const ChatComposer: FC<ChatComposerProps> = memo(({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container className='shrink-0 border-t border-white/5 p-0 px-6 py-4'>
      <Container className='w-full gap-2 rounded-full bg-[#25252c] p-0 px-4 py-2'>
        <Button
          variantsUi={{ color: 'ghost', rounded: 'lg' }}
          className='shrink-0 p-1.5'
        >
          <Paperclip className='h-4 w-4' />
        </Button>

        <Input
          as='textarea'
          variantsUi={{ style: 'search' }}
          className='max-h-32 flex-1 resize-none rounded-none bg-transparent py-1 pl-0 focus:ring-0'
          placeholder='Написать сообщение...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <Button
          variantsUi={{ color: 'ghost', rounded: 'lg' }}
          className='shrink-0 p-1.5'
        >
          <Smile className='h-4 w-4' />
        </Button>

        <Button
          variantsUi={{
            color: message.trim() ? 'primary' : 'ghost',
            rounded: 'lg',
          }}
          className='shrink-0 p-1.5'
          onClick={handleSend}
          disabled={!message.trim()}
        >
          <Send className='h-4 w-4' />
        </Button>
      </Container>
    </Container>
  );
});

ChatComposer.displayName = 'ChatComposer';
