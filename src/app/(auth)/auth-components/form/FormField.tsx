'use client';

import { FC } from 'react';

import { Conditional } from '@components/Conditionals';
import { useFormContext } from '@contexts/FormContext';
import { FormFieldContext } from '@contexts/FormFieldContext';
import { Props } from '@shared/types/index';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';

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
      cn={['w-full p-0 group/field', className]}
      variantsUi={{ flow: 'col', items: 'start' }}
      {...props}
    >
      <FormFieldContext.Provider value={{ name }}>
        {children}
      </FormFieldContext.Provider>
      <Conditional condition={showError}>
        <Text
          className='bottom-[-1.2rem] self-start'
          variantsUi={{ size: 'xs', color: 'red' }}
        >
          {errors[name]?.message as string}
        </Text>
      </Conditional>
    </Container>
  );
};
