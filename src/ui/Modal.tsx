'use client';

import { FC, ReactNode, useEffect } from 'react';

import { Conditional } from '@components/Conditionals';
import { Container } from '@ui/Container';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Закрытие по Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <Conditional condition={isOpen}>
      <Container
        className='fixed inset-0 z-50 bg-black/60 p-0'
        variantsUi={{ items: 'centered' }}
        onClick={onClose}
      >
        {/* Клик внутри - не закрываем */}
        <Container
          className='relative p-0'
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </Container>
      </Container>
    </Conditional>
  );
};
