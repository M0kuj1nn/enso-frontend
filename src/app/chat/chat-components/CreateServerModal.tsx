'use client';

import { FC, useState } from 'react';

import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Input } from '@ui/Input';
import { Modal } from '@ui/Modal';
import { Text } from '@ui/typography/Text';

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (name: string, topic: string, icon: string) => void;
}

const PRESET_ICONS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=100&h=100&fit=crop',
];

export const CreateServerModal: FC<CreateServerModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(PRESET_ICONS[0]);

  const handleCreate = () => {
    if (!name.trim()) return;
    // createServer вызовем в NavStrip через пропс
    onCreated(name.trim(), topic.trim(), selectedIcon);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setTopic('');
    setSelectedIcon(PRESET_ICONS[0]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Container
        variantsUi={{ flow: 'col' }}
        className='w-[440] gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1f] p-0'
      >
        {/* Шапка */}
        <Container className='border-b border-white/5 px-6 pt-6 pb-4'>
          <Text variantsUi={{ size: 'xl', weight: 'semibold' }}>
            Создать сервер
          </Text>
        </Container>

        <Container variantsUi={{ flow: 'col' }} className='gap-4 px-6 py-4'>
          {/* Название */}
          <Container variantsUi={{ flow: 'col' }} className='gap-2 p-0'>
            <Text variantsUi={{ size: 'sm', color: 'muted' }}>
              Название сервера
            </Text>
            <Input
              placeholder='Мой сервер...'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </Container>

          {/* Тема */}
          <Container variantsUi={{ flow: 'col' }} className='gap-2 p-0'>
            <Text variantsUi={{ size: 'sm', color: 'muted' }}>
              Тема сервера
            </Text>
            <Input
              placeholder='О чём ваш сервер?'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </Container>

          {/* Иконка */}
          <Container variantsUi={{ flow: 'col' }} className='gap-2 p-0'>
            <Text variantsUi={{ size: 'sm', color: 'muted' }}>
              Иконка сервера
            </Text>
            <Container className='flex-wrap gap-2 p-0'>
              {PRESET_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`overflow-hidden rounded-xl border-2 transition-colors ${
                    selectedIcon === icon
                      ? 'border-[#A74BE9]'
                      : 'border-transparent'
                  }`}
                >
                  <Avatar src={icon} alt='icon' size='md' shape='rounded' />
                </button>
              ))}
            </Container>
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
