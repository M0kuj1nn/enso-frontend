'use client';

import { FC, useState } from 'react';

import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Input } from '@ui/Input';
import { Modal } from '@ui/Modal';
import { Text } from '@ui/typography/Text';
import { Hash, Volume2 } from 'lucide-react';

export type ChannelType = 'text' | 'voice';

interface CreateChannelModalProps {
  isOpen: boolean;
  channelType: ChannelType;
  onClose: () => void;
  onCreated: (name: string) => void;
}

const TYPE_CONFIG: Record<
  ChannelType,
  { label: string; Icon: typeof Hash; placeholder: string }
> = {
  text: { label: 'Текстовый канал', Icon: Hash, placeholder: 'новый-канал' },
  voice: {
    label: 'Голосовой канал',
    Icon: Volume2,
    placeholder: 'Голосовой чат',
  },
};

export const CreateChannelModal: FC<CreateChannelModalProps> = ({
  isOpen,
  channelType,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const { label, Icon, placeholder } = TYPE_CONFIG[channelType];

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreated(trimmed);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Container
        variantsUi={{ flow: 'col' }}
        className='w-100 gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1f] p-0'
      >
        {/* Шапка */}
        <Container className='items-center gap-3 border-b border-white/5 px-6 pt-6 pb-4'>
          <Container
            variantsUi={{ items: 'centered' }}
            className='h-9 w-9 shrink-0 rounded-xl bg-[#A74BE9]/15 p-0'
          >
            <Icon className='h-4 w-4 text-[#A74BE9]' />
          </Container>
          <Text variantsUi={{ size: 'xl', weight: 'semibold' }}>
            Создать канал
          </Text>
        </Container>

        <Container variantsUi={{ flow: 'col' }} className='gap-4 px-6 py-5'>
          {/* Тип канала — read-only индикатор */}
          <Container variantsUi={{ flow: 'col' }} className='gap-2 p-0'>
            <Text variantsUi={{ size: 'sm', color: 'muted' }}>Тип канала</Text>
            <Container className='py- gap-3 rounded-3xl bg-[#27272D]'>
              <Icon className='h-4 w-4 shrink-0 text-[#969696]' />
              <Text variantsUi={{ size: 'sm' }}>{label}</Text>
            </Container>
          </Container>

          {/* Название */}
          <Container variantsUi={{ flow: 'col' }} className='gap-2 p-0'>
            <Text variantsUi={{ size: 'sm', color: 'muted' }}>
              Название канала
            </Text>
            <Input
              placeholder={placeholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
          </Container>
        </Container>

        {/* Кнопки */}
        <Container className='justify-end gap-2 border-t border-white/5 px-6 py-4'>
          <Button
            variantsUi={{ color: 'ghost', size: 'sm', rounded: 'xl' }}
            onClick={handleClose}
          >
            Отмена
          </Button>
          <Button
            variantsUi={{ color: 'primary', size: 'sm', rounded: 'xl' }}
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Создать
          </Button>
        </Container>
      </Container>
    </Modal>
  );
};
