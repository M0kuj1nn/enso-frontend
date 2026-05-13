import { tc } from '@shared/utils/tc.util'
import { ve } from '@shared/utils/ve.util'
import { cvax } from '@shared/utils/cvax'

export const Input = ve(
  tc('input'),
  cvax(
    'w-full rounded-2xl bg-[#27272D] px-4 py-2.5 text-sm text-white placeholder-[#969696] outline-none transition-colors duration-150 focus:ring-2 focus:ring-[#A74BE9]/50',
    {
      variants: {
        style: {
          'form-field': 'bg-[#27272D] text-white placeholder-[#969696]',
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
)
