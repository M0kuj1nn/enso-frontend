'use client';

import { FC, KeyboardEvent, memo, useRef, useState } from 'react';

import { Conditional } from '@components/Conditionals';
import { useClickOutside } from '@shared/hooks/useClickOutside';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Input } from '@ui/Input';
import { Text } from '@ui/typography/Text';
import {
  FileText,
  Image as ImageIcon,
  Paperclip,
  Send,
  Smile,
} from 'lucide-react';

// AttachMenu

interface AttachMenuProps {
  isOpen: boolean;
  onPhoto: () => void;
  onDocument: () => void;
  onClose: () => void;
}

const AttachMenu: FC<AttachMenuProps> = ({
  isOpen,
  onPhoto,
  onDocument,
  onClose,
}) => (
  <Conditional condition={isOpen}>
    <Container
      variantsUi={{ flow: 'col', style: 'whiteglass' }}
      className='absolute bottom-full left-0 z-50 mb-2 w-52 gap-0 overflow-hidden rounded-2xl bg-[#1e1e26]/95 p-1.5'
    >
      <Button
        variantsUi={{ color: 'ghost', rounded: 'xl' }}
        className='w-full justify-start gap-3 px-4 py-3 hover:bg-white/10'
        onClick={() => {
          onPhoto();
          onClose();
        }}
      >
        <ImageIcon className='h-5 w-5 shrink-0 text-[#A74BE9]' />
        <Text variantsUi={{ size: 'sm' }}>Фото или видео</Text>
      </Button>

      <Button
        variantsUi={{ color: 'ghost', rounded: 'xl' }}
        className='w-full justify-start gap-3 px-4 py-3 hover:bg-white/10'
        onClick={() => {
          onDocument();
          onClose();
        }}
      >
        <FileText className='h-5 w-5 shrink-0 text-[#A74BE9]' />
        <Text variantsUi={{ size: 'sm' }}>Документ</Text>
      </Button>
    </Container>
  </Conditional>
);

// ChatComposer

interface ChatComposerProps {
  onSend: (content: string) => void;
}

export const ChatComposer: FC<ChatComposerProps> = memo(({ onSend }) => {
  const [message, setMessage] = useState('');
  const [isAttachOpen, setIsAttachOpen] = useState(false);

  // Скрытые file-инпуты — клик открывает проводник
  const photoRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);

  /*
    attachWrapperRef включает ОБОИХ: кнопку скрепки И само меню.
    Клик вне враппера → меню закрывается.
    Клик на кнопку скрепки → только toggle (обрабатывается onClick кнопки).
    Нет fixed backdrop → нет проблем со stacking context.
  */
  const attachWrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(attachWrapperRef, () => setIsAttachOpen(false), isAttachOpen);

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

  // WS: здесь будет загрузка на сервер + отправка в чат
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length)
      console.log(
        'TODO upload photos:',
        files.map((f) => f.name),
      );
    e.target.value = '';
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length)
      console.log(
        'TODO upload docs:',
        files.map((f) => f.name),
      );
    e.target.value = '';
  };

  return (
    <Container className='w-full p-0 px-6 py-4'>
      {/* Скрытые инпуты — клик открывает проводник */}
      <input
        ref={photoRef}
        type='file'
        accept='image/*,video/*'
        multiple
        className='hidden'
        onChange={handlePhotoChange}
      />
      <input
        ref={docRef}
        type='file'
        accept='.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar'
        multiple
        className='hidden'
        onChange={handleDocChange}
      />

      <Container
        variantsUi={{ style: 'whiteglass', rounded: 'full' }}
        className='w-full gap-2 bg-[#25252c]/80 p-0 px-4 py-2'
      >
        <Container ref={attachWrapperRef} className='relative shrink-0 p-0'>
          <AttachMenu
            isOpen={isAttachOpen}
            onClose={() => setIsAttachOpen(false)}
            onPhoto={() => photoRef.current?.click()}
            onDocument={() => docRef.current?.click()}
          />
          <Button
            variantsUi={{ color: 'ghost', rounded: 'lg' }}
            className='p-1.5'
            onClick={() => setIsAttachOpen((v) => !v)}
          >
            <Paperclip className='h-4 w-4' />
          </Button>
        </Container>

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
