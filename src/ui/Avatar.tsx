import { FC } from 'react';

import { UserStatus } from '@shared/types/chat';
import { Container } from '@ui/Container';

const statusColor: Record<UserStatus, string> = {
  online: 'bg-emerald-400',
  away: 'bg-amber-400',
  offline: 'bg-gray-600',
};

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-9 h-9',
  lg: 'w-10 h-10',
  xl: 'w-20 h-20',
};

const shapeMap = {
  circle: 'rounded-full',
  rounded: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

export interface AvatarProps {
  src: string;
  alt: string;
  size?: keyof typeof sizeMap;
  shape?: keyof typeof shapeMap;
  status?: UserStatus;
}

export const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  shape = 'rounded',
  status,
}) => (
  <Container className={`relative shrink-0 p-0 ${sizeMap[size]}`}>
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover ${shapeMap[shape]}`}
    />
    {status && (
      <Container
        className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-[#141418] p-0 ${statusColor[status]}`}
      />
    )}
  </Container>
);
