import { FC, ReactNode } from 'react';

import { Container } from '@ui/Container';

type PositionType = 'right' | 'left';

interface FormFieldIconProps {
  children: ReactNode;
  position: PositionType;
}

const getPosition = (position: PositionType) => {
  return `${position === 'left' ? 'left-3' : 'right-3'} top-1/2 -translate-y-[50%]`;
};
export const FormFieldIcon: FC<FormFieldIconProps> = ({
  children,
  position,
}) => (
  <Container className={`absolute p-0 ${getPosition(position)}`}>
    {children}
  </Container>
);
