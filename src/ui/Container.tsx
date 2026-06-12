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
        whiteglass: 'glass-white',
        blackglass: 'glass-black',
        'form-whiteglass': 'glass-white-from',
      },
    },
  }),
);
