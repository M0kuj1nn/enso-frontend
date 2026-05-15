import { cvax } from '@shared/utils/cvax';
import { tc } from '@shared/utils/tc.util';
import { ve } from '@shared/utils/ve.util';

export const Input = ve(
  tc('input'),
  cvax(
    'w-full rounded-3xl bg-[#27272D] px-4 py-2.5 text-sm text-white placeholder-[#969696] outline-none transition-colors duration-150 focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-0 transition-all duration-250',
    {
      variants: {
        style: {
          'form-field': 'bg-[#27272D] text-white placeholder-[#969696]',
          'white-glass-form-field':
            'bg-[#404047] text-white placeholder-[#A8A8A8] backdrop-blur-xl focus:ring-1 focus:ring-gray-400',
          search: 'bg-[#1A1A1F] text-white placeholder-[#969696] pl-10',
        },
        size: {
          sm: 'px-3 py-1.5 text-xs',
          md: 'px-4 py-2.5 text-sm',
          lg: 'px-5 py-3 text-base',
        },
      },
      defaultVariants: {
        style: 'form-field',
        size: 'md',
      },
    },
  ),
);
