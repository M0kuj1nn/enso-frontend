import { tc } from '@shared/utils/tc.util';
import { ve } from '@shared/utils/ve.util';
import { cva } from 'class-variance-authority';

export const Button = ve(
  tc('button'),
  cva(
    'flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    {
      variants: {
        color: {
          primary: 'bg-[#A74BE9] text-white hover:bg-[#9635e0]',
          ghost: 'bg-transparent text-gray-300 hover:bg-[#27272D]',
          gray: 'bg-[#35353B] text-gray-300 hover:bg-[#3f3f46]',
          danger: 'bg-red-600 text-white hover:bg-red-700',
          glamor:
            'bg-linear-to-r from-[#DC52FF] to-[#8B10E3] text-white hover:from-[#E066FF] hover:to-[#9C1AF5]',
          userPanelDefault: 'bg-[#232325] text-[#AEAEB8] hover:bg-[#46464F]',
          userPanelDanger: 'bg-red-500/25 text-red-400 hover:bg-red-500/35',
          userPanelActive:
            'bg-[#A74BE9]/25 text-[#C97EFF] hover:bg-[#A74BE9]/35',
        },
        size: {
          sm: 'px-3 py-1.5 text-xs',
          md: 'px-4 py-2 text-sm',
          lg: 'px-6 py-3 text-base',
          xl: 'px-8 py-4 text-lg',
        },
        border: {
          main: 'border border-[#27272D]',
          none: 'border-0',
        },
        wide: {
          true: 'w-full',
        },
        rounded: {
          lg: 'rounded-lg',
          xl: 'rounded-xl',
          '2xl': 'rounded-2xl',
          '3xl': 'rounded-3xl',
          full: 'rounded-full',
        },
      },
      defaultVariants: {
        color: 'primary',
        size: 'md',
        border: 'none',
      },
    },
  ),
);
