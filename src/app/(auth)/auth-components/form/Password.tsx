'use client';

import { FC, useState } from 'react';

import EyeIcon from '@icons/eye.svg';
import { Props } from '@shared/types/index';
import { FormField } from 'src/app/(auth)/auth-components/form/FormField';
import { FormFieldIcon } from 'src/app/(auth)/auth-components/form/FormFieldIcon';
import { FormInput } from 'src/app/(auth)/auth-components/form/FormInput';

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
      <div className='relative w-full'>
        <FormInput type={passwordType} {...inputProps} />
        <FormFieldIcon position='right'>
          <EyeIcon
            className='text-[#999999] hover:text-gray-300'
            onClick={onClick}
          />
        </FormFieldIcon>
      </div>
    </FormField>
  );
};
