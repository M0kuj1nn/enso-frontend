import { FC } from 'react';

import { FormCheckBox } from '@page-components/(auth)/auth-components/form/FormCheckBox';

export const AgreementBlock: FC = () => (
  <FormCheckBox
    className='self-start p-0 text-xs'
    intputProps={{ name: 'agreement' }}
  >
    <span>
      I agree to the
      <span className='text-indigo-400 hover:text-indigo-400/80'>
        {` Terms of Service `}
      </span>
      and
      <span className='text-indigo-400 hover:text-indigo-400/80'>
        {` Privacy Policy`}
      </span>
    </span>
  </FormCheckBox>
);
