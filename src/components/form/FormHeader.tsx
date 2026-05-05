import { FC } from 'react';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { Props } from '@shared/types/other.types';
import DoubleCheckIcon from '@icons/DoubleCheck.svg';

interface FormHeaderProps
  extends Omit<Props<typeof Container>, 'as' | 'children'> {
  title: string;
  children: string;
}

export const FormHeader: FC<FormHeaderProps> = ({
  title,
  children,
  ...props
}) => (
  <Container variants={{ flow: 'col', items: 'centered' }} {...props}>
    <DoubleCheckIcon className='text-white bg-indigo-500 rounded-md size-10 p-3' />
    <Text as='h1' variants={{ font: 'bold', size: 'xl', color: 'black' }}>
      {title}
    </Text>
    <Text as='h2' variants={{ font: 'light', size: 'xs', color: 'dark-200' }}>
      {children}
    </Text>
  </Container>
);
