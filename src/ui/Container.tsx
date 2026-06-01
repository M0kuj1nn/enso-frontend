import { tc } from '@shared/utils/tc.util';
import { ve } from '@shared/utils/ve.util';
import { cva } from 'class-variance-authority';

export const Container = ve(
  tc('div'),
  cva('flex p-2 gap-2', {
    variants: {
      flow: {
        col: 'flex-col',
      },
      items: {
        centered: 'items-centered',
        start: 'items-start-centered',
      },

      textSize: {
        md: 'text-md',
        xl: 'text-xl',
      },
      position: {
        'absolute-center': 'absolute-center',
        'absolute-bottom': 'absolute-bottom',
        'absolute-left': 'absolute top-0 left-0',
      },

      rounded: {
        md: 'rounded-md',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full',
      },

      style: {
        whiteglass:
          'bg-white/2 backdrop-blur-2xl shadow-[inset_2px_1px_0_rgba(255,255,255,0.30),inset_-1px_-0.5px_0_rgba(255,255,255,0.14),inset_1px_0_0_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.06),inset_-1px_0_0_rgba(0,0,0,0.06),inset_0_-1px_0_rgba(255,255,255,0.06)]',
        blackglass:
          'bg-[#0D0D0D]/20 backdrop-blur-md shadow-[inset_2px_1px_0_rgba(255,255,255,0.18),inset_-1px_-0.5px_0_rgba(255,255,255,0.09),inset_1px_0_0_rgba(255,255,255,0.09),inset_0_1px_0_rgba(255,255,255,0.05),inset_-1px_0_0_rgba(0,0,0,0.30),inset_0_-1px_0_rgba(0,0,0,0.20)]',
      },
    },
  }),
);
