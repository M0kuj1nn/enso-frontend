'use client';

import { FC, memo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { User, UserConnections } from '@shared/types/user';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AtSign,
  Briefcase,
  Code,
  ExternalLink,
  Globe,
  Palette,
  Settings,
  X,
} from 'lucide-react';

// Иконки для соцсетей (brand icons отсутствуют в текущей версии lucide-react)
const CONNECTION_ITEMS: {
  key: keyof UserConnections;
  icon: typeof Globe;
  label: string;
}[] = [
  { key: 'twitter', icon: AtSign, label: 'Twitter / X' },
  { key: 'github', icon: Code, label: 'GitHub' },
  { key: 'dribbble', icon: Palette, label: 'Dribbble' },
  { key: 'linkedin', icon: ExternalLink, label: 'LinkedIn' },
  { key: 'website', icon: Globe, label: 'Сайт' },
];

interface UserProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const UserProfileModal: FC<UserProfileModalProps> = memo(
  ({ user, isOpen, onClose, onOpenSettings }) => {
    const hasConnections =
      user.connections && Object.values(user.connections).some(Boolean);

    const [tagCopied, setTagCopied] = useState(false);
    const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleCopyTag = () => {
      navigator.clipboard.writeText(user.username);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      setTagCopied(true);
      copyTimerRef.current = setTimeout(() => setTagCopied(false), 1500);
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className='fixed inset-0 z-200 bg-black/40 backdrop-blur-[3px]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={onClose}
            />

            {/* Центрирующий слой */}
            <div className='pointer-events-none fixed inset-0 z-201 flex items-center justify-center p-4'>
              <motion.div
                className='pointer-events-auto w-[440] max-w-full overflow-hidden rounded-3xl bg-[#1e1e26] shadow-2xl'
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Баннер */}
                <div className='relative h-[120] shrink-0 bg-linear-to-br from-[#7B2FBE] via-[#5B4BE9] to-[#3464E8]'>
                  <Container className='absolute top-4 right-4 gap-2 p-0'>
                    <Button
                      variantsUi={{ color: 'ghost', rounded: 'lg' }}
                      className='bg-black/25 p-2 text-white backdrop-blur-sm hover:bg-black/40'
                      onClick={onOpenSettings}
                      title='Настройки профиля'
                    >
                      <Settings className='h-4 w-4' />
                    </Button>
                    <Button
                      variantsUi={{ color: 'ghost', rounded: 'lg' }}
                      className='bg-black/25 p-2 text-white backdrop-blur-sm hover:bg-black/40'
                      onClick={onClose}
                      title='Закрыть'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </Container>
                </div>

                {/* Контент */}
                <Container
                  variantsUi={{ flow: 'col' }}
                  className='gap-5 px-6 pb-7'
                >
                  {/* Аватарка + Имя */}
                  <Container className='items-start gap-4 p-0'>
                    {/* Аватар со смещением вверх — перекрывает баннер */}
                    <div className='-mt-10 shrink-0 rounded-full ring-4 ring-[#1e1e26]'>
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        size='xl'
                        shape='circle'
                        status={user.status}
                      />
                    </div>
                    {/* Текст строго ниже баннера */}
                    <Container
                      variantsUi={{ flow: 'col' }}
                      className='min-w-0 gap-1 p-0 pt-3'
                    >
                      <Text
                        variantsUi={{ weight: 'bold' }}
                        className='truncate text-[22px] leading-tight'
                      >
                        {user.name}
                      </Text>
                      <div className='relative'>
                        <button
                          type='button'
                          className='cursor-pointer text-left transition-opacity hover:opacity-70'
                          onClick={handleCopyTag}
                          title='Скопировать @username'
                        >
                          <Text
                            variantsUi={{ size: 'sm', color: 'muted' }}
                            className='truncate'
                          >
                            {user.username}
                          </Text>
                        </button>
                        <span
                          className={`pointer-events-none absolute bottom-full left-0 mb-1.5 rounded-lg bg-[#A74BE9] px-2 py-0.5 text-xs font-medium whitespace-nowrap text-white shadow-lg transition-all duration-200 ${tagCopied ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
                        >
                          Copied!
                        </span>
                      </div>
                    </Container>
                  </Container>

                  {/* Род деятельности */}
                  {user.job_title && (
                    <Container className='gap-2.5 p-0'>
                      <Briefcase className='h-4 w-4 shrink-0 text-gray-400' />
                      <Text
                        variantsUi={{ size: 'sm', weight: 'semibold' }}
                        className='text-gray-200'
                      >
                        {user.job_title}
                      </Text>
                    </Container>
                  )}

                  {/* Разделитель */}
                  <div className='h-px bg-white/10' />

                  {/* О себе */}
                  {user.bio && (
                    <Container
                      variantsUi={{ flow: 'col' }}
                      className='gap-2.5 p-0'
                    >
                      <Text
                        variantsUi={{ size: 'xs', color: 'muted' }}
                        className='font-semibold tracking-wider uppercase'
                      >
                        О себе
                      </Text>
                      <div className='rounded-xl bg-white/5 px-4 py-3'>
                        <Text
                          as='p'
                          variantsUi={{ size: 'sm' }}
                          className='leading-relaxed text-gray-300'
                        >
                          {user.bio}
                        </Text>
                      </div>
                    </Container>
                  )}

                  {/* Связи */}
                  {hasConnections && (
                    <>
                      <div className='h-px bg-white/10' />
                      <Container
                        variantsUi={{ flow: 'col' }}
                        className='gap-3 p-0'
                      >
                        <Text
                          variantsUi={{ size: 'xs', color: 'muted' }}
                          className='font-semibold tracking-wider uppercase'
                        >
                          Связи
                        </Text>
                        <Container className='gap-2 p-0'>
                          {CONNECTION_ITEMS.map(({ key, icon: Icon, label }) =>
                            user.connections?.[key] ? (
                              <a
                                key={key}
                                href={user.connections![key]}
                                target='_blank'
                                rel='noopener noreferrer'
                                title={label}
                                className='flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white'
                              >
                                <Icon className='h-5 w-5' />
                              </a>
                            ) : null,
                          )}
                        </Container>
                      </Container>
                    </>
                  )}
                </Container>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>,
      document.body,
    );
  },
);

UserProfileModal.displayName = 'UserProfileModal';
