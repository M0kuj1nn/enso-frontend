import { cvax } from '@shared/utils/cvax';
import { tc } from '@shared/utils/tc.util';
import { ve } from '@shared/utils/ve.util';

export const Text = ve(
  tc('span'),
  cvax('', {
    variants: {
      font: {
        dela: 'font-dela',
        unbounded: 'font-unbounded',
        //onest установлен глобально для всего приложения
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
      },
      color: {
        white: 'text-white',
        muted: 'text-[#969696]',
        accent: 'text-[#A74BE9]',
        black: 'text-black',
        red: 'text-red-500',
      },
      weight: {
        regular: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
    },
    defaultVariants: {
      size: 'base',
      color: 'white',
      weight: 'regular',
    },
  }),
);
