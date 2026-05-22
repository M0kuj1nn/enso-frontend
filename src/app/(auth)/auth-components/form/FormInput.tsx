'use client';

import { FC } from 'react';

import { useFormContext } from '@contexts/FormContext';
import { useFormFieldContext } from '@contexts/FormFieldContext';
import { Props } from '@shared/types/index';
import { Input } from '@ui/Input';

interface FormInputProps extends Omit<Props<typeof Input>, 'as' | 'name'> {
  as?: 'input' | 'textarea' | 'option' | 'select';
}

export const FormInput: FC<FormInputProps> = ({ as = 'input', ...props }) => {
  const { name } = useFormFieldContext();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const hasError = !!errors[name]?.message;

  return (
    <Input
      as={as}
      id={name}
      variantsUi={{
        style: hasError
          ? 'white-glass-form-field-error'
          : 'white-glass-form-field',
      }}
      {...props}
      {...register(name)}
    />
  );
};
