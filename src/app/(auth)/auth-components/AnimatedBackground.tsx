'use client';

import { FC, memo } from 'react';

import StarIcon from '@icons/star.svg';
import { motion } from 'framer-motion';

// Фиксированные позиции звёздочек — без Math.random() чтобы не было проблем с гидрацией
const STARS = [
  // Разбросаны вокруг центра, не в центре
  { id: 0, size: 40, top: '20%', left: '30%', duration: 6, delay: 0 },
  { id: 1, size: 24, top: '15%', left: '60%', duration: 8, delay: 1 },
  { id: 2, size: 32, top: '70%', left: '25%', duration: 7, delay: 2 },
  { id: 3, size: 18, top: '75%', left: '65%', duration: 9, delay: 0.5 },
  { id: 4, size: 28, top: '25%', left: '75%', duration: 5, delay: 3 },
  { id: 5, size: 20, top: '80%', left: '40%', duration: 10, delay: 1.5 },
  { id: 6, size: 36, top: '30%', left: '20%', duration: 7, delay: 2.5 },
  { id: 7, size: 16, top: '65%', left: '78%', duration: 11, delay: 0.8 },
  { id: 8, size: 44, top: '10%', left: '50%', duration: 9, delay: 4 },
  { id: 9, size: 75, top: '14%', left: '37%', duration: 9, delay: 4 },
  { id: 10, size: 22, top: '85%', left: '55%', duration: 6, delay: 1.2 },
  { id: 11, size: 30, top: '55%', left: '15%', duration: 8, delay: 3.5 },
  { id: 12, size: 26, top: '12%', left: '80%', duration: 7, delay: 2 },
];

interface BackgroundProps {
  className?: string;
}

const Background: FC<BackgroundProps> = memo(({ className }) => {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden select-none ${className ?? ''}`}
    >
      <motion.img
        src='/static/svg/uroborosCircle2.svg'
        className='absolute top-[-30vh] left-[-25vw] w-[35vw]'
        initial={{ scaleX: -1, rotate: 360 }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 110, repeat: Infinity, ease: 'linear' }}
      />

      <motion.img
        src='/static/svg/uroborosCircle2.svg'
        className='absolute top-[-45vh] left-[-23vw] w-[47vw] -scale-x-100'
        initial={{ scaleX: -1, rotate: 360 }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 110, repeat: Infinity, ease: 'linear' }}
      />

      <motion.img
        src='/static/svg/uroborosCircle2.svg'
        className='absolute right-[-11vw] bottom-[-25vh] w-[20vw]'
        initial={{ scaleX: -1, rotate: 360 }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 110, repeat: Infinity, ease: 'linear' }}
      />

      <motion.img
        src='/static/svg/uroborosCircle2.svg'
        className='absolute right-[-16vw] bottom-[-30vh] w-[30vw] -scale-x-100'
        initial={{ scaleX: -1, rotate: 360 }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 110, repeat: Infinity, ease: 'linear' }}
      />

      {STARS.map((star) => (
        <motion.div
          key={star.id}
          className='absolute text-[#8B10E3]'
          style={{
            width: star.size,
            height: star.size,
            top: star.top,
            left: star.left,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.8, 0.1],
            scale: [0.9, 1.15, 0.9],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: star.delay,
          }}
        >
          <StarIcon style={{ width: '100%', height: '100%' }} />
        </motion.div>
      ))}
    </div>
  );
});

Background.displayName = 'Background';

export default Background;
