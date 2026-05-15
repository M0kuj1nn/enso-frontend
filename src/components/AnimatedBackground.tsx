'use client';

import { FC } from 'react';

import { motion } from 'framer-motion';

interface ReptileBackgroundProps {
  className?: string;
}

const ReptileBackground: FC<ReptileBackgroundProps> = ({ className }) => {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden select-none ${className ?? ''}`}
    >
      {/* Нижний слой — самый далёкий от угла, ближе к карточке */}
      <motion.img
        src='/static/svg/bottomskin.svg'
        className='absolute'
        style={{ width: '100vw', top: '-103vh', left: '-32vw' }}
        initial={{ x: 0, y: 0 }}
        animate={{ x: [0, -6, 5, 0], y: [0, 8, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Средний слой — чуть ближе к углу */}
      <motion.img
        src='/static/svg/midskin.svg'
        className='absolute'
        style={{ width: '100vw', top: '-103vh', left: '-32vw' }}
        initial={{ x: 0, y: 0 }}
        animate={{ x: [0, -6, 5, 0], y: [0, 8, -4, 0] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Верхний слой — в самом углу */}
      <motion.img
        src='/static/svg/topskin.svg'
        className='absolute'
        style={{ width: '90vw', top: '-100vh', left: '-40vw' }}
        initial={{ x: 0, y: 0 }}
        animate={{ x: [0, 5, -8, 0], y: [0, -4, 6, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  );
};

export default ReptileBackground;
