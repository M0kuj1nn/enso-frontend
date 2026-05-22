import { FC } from 'react';

import { Conditional } from '@components/Conditionals';
import { cvax } from '@shared/utils/cvax';
import { tc } from '@shared/utils/tc.util';
import { ve } from '@shared/utils/ve.util';

const BadgeRoot = ve(
  tc('span'),
  cvax(
    'flex items-center justify-center font-semibold rounded-full text-white bg-[#A74BE9] flex-shrink-0',
    {
      variants: {
        size: {
          sm: 'min-w-[18px] h-[18px] px-1 text-xs',
          md: 'min-w-5 h-5 px-1.5 text-xs',
        },
      },
      defaultVariants: { size: 'sm' },
    },
  ),
);

interface BadgeProps {
  count: number;
  max?: number;
  size?: 'sm' | 'md';
}

export const Badge: FC<BadgeProps> = ({ count, max = 99, size = 'sm' }) => (
  <Conditional condition={count > 0}>
    <BadgeRoot variantsUi={{ size }}>
      {count > max ? `${max}+` : count}
    </BadgeRoot>
  </Conditional>
);
