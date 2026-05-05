'use client';

import { FC, useState } from 'react';
import { FormField } from '@components/form/FormField';
import { Props } from '@shared/types/other.types';
import { FormInput } from '@components/form/FormInput';
import { FormFieldIcon } from '@components/form/FormFieldIcon';
import EyeIcon from '@icons/Eye.svg';
import LockIcon from '@icons/Lock.svg';

type PasswordType = 'text' | 'password';

interface PasswordProps extends Props<typeof FormField> {
  inputProps: Omit<Props<typeof FormInput>, 'name' | 'type'>;
}

export const Password: FC<PasswordProps> = ({
  name,
  children,
  inputProps,
  ...props
}) => {
  const [passwordType, setPasswordType] = useState<PasswordType>('password');

  const onClick = () =>
    setPasswordType(passwordType === 'password' ? 'text' : 'password');

  return (
    <FormField name={name} {...props}>
      {children}
      <FormFieldIcon position='left'>
        <LockIcon />
      </FormFieldIcon>
      <FormFieldIcon position='right'>
        <EyeIcon className='hover:text-indigo-400' onClick={onClick} />
      </FormFieldIcon>
      <FormInput
        type={passwordType}
        {...inputProps}
        variants={{ style: 'form-field' }}
      />
    </FormField>
  );
};
