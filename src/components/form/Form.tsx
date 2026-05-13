'use client';

import { AnyFunction, Props } from '@shared/types/index';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { Container } from '@ui/Container';
import { FormContext } from '@contexts/FormContext';
import { ZodMiniObject } from 'zod/v4-mini';

interface FormProps<T extends ZodMiniObject<any>>
  extends Omit<Props<typeof Container<'form'>>, 'as' | 'onSubmit'> {
  schema?: T;
  options?: Omit<Parameters<typeof useForm>[0], 'resolver'>;
  onSubmit?: AnyFunction;
}

export const Form = <T extends ZodMiniObject<any>>({
  schema,
  options,
  onSubmit = () => {},
  ...props
}: FormProps<T>) => {
  const { handleSubmit, ...form } = useForm({
    resolver: schema ? standardSchemaResolver(schema) : undefined,
    ...options,
  });

  return (
    <FormContext.Provider value={{ ...form }}>
      <Container as='form' onSubmit={handleSubmit(onSubmit)} {...props} />
    </FormContext.Provider>
  );
};
