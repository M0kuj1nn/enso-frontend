'use client';

import { FC } from 'react';

import { useFormContext } from '@contexts/FormContext';
import { Props } from '@shared/types/index';
import { Container } from '@ui/Container';

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
    <Container className='w-full' variantsUi={{ items: 'centered' }} {...props}>
      <input type='checkbox' {...rest} {...register(name)} />
      {children}
    </Container>
  );
};
