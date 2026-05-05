import { FC, ReactNode } from 'react';
import { Container } from '@ui/Container';

type PositionType = 'right' | 'left';

interface FormFieldIconProps {
  children: ReactNode;
  position: PositionType;
}

const getPosition = (position: PositionType) => {
  return `${
    position === 'left' ? 'left-2' : 'right-2'
  } top-1/2 translate-y-[45%]`;
};

export const FormFieldIcon: FC<FormFieldIconProps> = ({
  children,
  position,
}) => (
  <Container className={`p-0 absolute ${getPosition(position)}`}>
    {children}
  </Container>
);
