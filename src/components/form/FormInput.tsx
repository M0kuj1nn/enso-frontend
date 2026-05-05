'use client';

import { FC } from 'react';
import { Props } from '@shared/types/other.types';
import { useFormContext } from '@contexts/FormContext';
import { Input } from '@ui/Input';
import { useFormFieldContext } from '@contexts/FormFieldContext';

interface FormInputProps extends Omit<Props<typeof Input>, 'as' | 'name'> {
  as?: 'input' | 'textarea' | 'option' | 'select';
}

export const FormInput: FC<FormInputProps> = ({ as = 'input', ...props }) => {
  const { name } = useFormFieldContext();
  const { register } = useFormContext();

  return <Input as={as} id={name} {...props} {...register(name)} />;
};
