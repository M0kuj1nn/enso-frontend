'use client';

import { FC } from 'react';
import { Container } from '@ui/Container';
import { Props } from '@shared/types/other.types';
import { useFormContext } from '@contexts/FormContext';

interface FormCheckBoxProps extends Omit<Props<typeof Container>, 'as'> {
  intputProps?: Omit<Props<'input'>, 'type'>;
}

export const FormCheckBox: FC<FormCheckBoxProps> = ({
  intputProps = {},
  children,
  ...props
}) => {
  const { register } = useFormContext();
  const { name = 'name', ...rest } = intputProps;

  return (
    <Container className='w-full' variants={{ items: 'centered' }} {...props}>
      <input type='checkbox' {...rest} {...register(name)} />
      {children}
    </Container>
  );
};
