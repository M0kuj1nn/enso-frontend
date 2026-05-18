'use client';

import { FC, useState } from 'react';

import { Conditional } from '@components/Conditionals';
import { useChatContext } from '@contexts/ChatContext';
import { Friend } from '@shared/types/chat';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Input } from '@ui/Input';
import { Modal } from '@ui/Modal';
import { Text } from '@ui/typography/Text';
import { Check, MessageSquare, Users } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (chatId: string) => void;
}

type Tab = 'dm' | 'group';

export const NewChatModal: FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { friends, createDm, createGroup } = useChatContext();
  const [tab, setTab] = useState<Tab>('dm');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState('');

  const toggleSelect = (id: string) => {
    if (tab === 'dm') {
      // В DM — выбираем одного, сразу открываем
      const chat = createDm(id);
      handleClose();
      onCreated(chat.id);
      return;
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedIds.size === 0) return;
    const chat = createGroup(groupName.trim(), [...selectedIds]);
    handleClose();
    onCreated(chat.id);
  };

  const handleClose = () => {
    setTab('dm');
    setSelectedIds(new Set());
    setGroupName('');
    onClose();
  };

  const canCreate =
    tab === 'group' && groupName.trim().length > 0 && selectedIds.size > 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Container
        variantsUi={{ flow: 'col' }}
        className='w-[440px] gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1f] p-0'
      >
        {/* Шапка */}
        <Container className='gap-4 border-b border-white/5 p-0 px-6 pt-6 pb-4'>
          <Text variantsUi={{ size: 'xl', weight: 'semibold' }}>Новый чат</Text>
        </Container>

        {/* Табы */}
        <Container className='gap-2 border-b border-white/5 p-0 px-6 py-3'>
          <Button
            variantsUi={{
              color: tab === 'dm' ? 'primary' : 'ghost',
              size: 'sm',
              rounded: 'xl',
            }}
            onClick={() => {
              setTab('dm');
              setSelectedIds(new Set());
            }}
          >
            <MessageSquare className='h-4 w-4' />
            Личный чат
          </Button>
          <Button
            variantsUi={{
              color: tab === 'group' ? 'primary' : 'ghost',
              size: 'sm',
              rounded: 'xl',
            }}
            onClick={() => setTab('group')}
          >
            <Users className='h-4 w-4' />
            Группа
          </Button>
        </Container>

        {/* Поле имени группы */}
        <Conditional condition={tab === 'group'}>
          <Container className='border-b border-white/5 p-0 px-6 py-3'>
            <Input
              placeholder='Название группы...'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              autoFocus
            />
          </Container>
        </Conditional>

        {/* Список друзей */}
        <Container
          variantsUi={{ flow: 'col' }}
          className='max-h-72 gap-1 overflow-y-auto p-0 px-4 py-3'
        >
          {friends.length === 0 && (
            <Container variantsUi={{ items: 'centered' }} className='p-0 py-8'>
              <Text variantsUi={{ size: 'sm', color: 'muted' }}>
                Нет друзей. Добавь кого-нибудь!
              </Text>
            </Container>
          )}

          {friends.map((friend: Friend) => {
            const isSelected = selectedIds.has(friend.id);
            return (
              <Button
                key={friend.id}
                variantsUi={{ color: 'ghost', rounded: 'xl' }}
                cn={[
                  'w-full justify-start gap-3 px-2 py-2',
                  isSelected && 'bg-[#A74BE9]/10',
                ]}
                onClick={() => toggleSelect(friend.id)}
              >
                <Avatar
                  src={friend.avatar}
                  alt={friend.name}
                  size='md'
                  shape='rounded'
                  status={friend.status}
                />
                <Container
                  variantsUi={{ flow: 'col' }}
                  className='flex-1 gap-0 p-0 text-left'
                >
                  <Text variantsUi={{ size: 'sm', weight: 'medium' }}>
                    {friend.name}
                  </Text>
                  <Text variantsUi={{ size: 'xs', color: 'muted' }}>
                    {friend.username}
                  </Text>
                </Container>
                <Conditional condition={isSelected && tab === 'group'}>
                  <Container
                    className='h-5 w-5 flex-shrink-0 rounded-full bg-[#A74BE9] p-0'
                    variantsUi={{ items: 'centered' }}
                  >
                    <Check className='h-3 w-3 text-white' />
                  </Container>
                </Conditional>
              </Button>
            );
          })}
        </Container>

        {/* Нижние кнопки */}
        <Container className='justify-end gap-2 border-t border-white/5 p-0 px-6 py-4'>
          <Button
            variantsUi={{ color: 'ghost', size: 'sm', rounded: 'xl' }}
            onClick={handleClose}
          >
            Отмена
          </Button>
          <Conditional condition={tab === 'group'}>
            <Button
              variantsUi={{ color: 'primary', size: 'sm', rounded: 'xl' }}
              onClick={handleCreateGroup}
              disabled={!canCreate}
            >
              Создать группу
            </Button>
          </Conditional>
        </Container>
      </Container>
    </Modal>
  );
};
