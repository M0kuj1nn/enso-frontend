'use client';

import { FC } from 'react';
import { Container } from '@ui/Container';
import { Props } from '@shared/types/other.types';
import { useFormContext } from '@contexts/FormContext';
import { FormFieldContext } from '@contexts/FormFieldContext';
import { Text } from '@ui/typography/Text';
import { Conditional } from '@components/Conditional';

interface FormFieldProps extends Props<typeof Container> {
  name: string;
  showError?: boolean;
}

export const FormField: FC<FormFieldProps> = ({
  name,
  children,
  className,
  showError = true,
  ...props
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <Container
      cn={['w-full relative p-0 group/field', className]}
      variants={{ flow: 'col', items: 'start' }}
      {...props}
    >
      <FormFieldContext.Provider value={{ name }}>
        {children}
      </FormFieldContext.Provider>
      <Conditional condition={showError}>
        <Text className='self-start absolute bottom-[-1.2rem]'>
          {errors[name]?.message as string}
        </Text>
      </Conditional>
    </Container>
  );
};
