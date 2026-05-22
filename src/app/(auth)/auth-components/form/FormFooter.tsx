import { FC } from 'react';

import Link from 'next/link';

import { Text } from '@ui/typography/Text';

interface FormFooterProps {
  text: string;
  linkText: string;
  path: string;
}

const FormFooter: FC<FormFooterProps> = ({ text, linkText, path }) => (
  <Text
    as='span'
    className='mt-6 gap-2'
    variantsUi={{ size: 'xs', color: 'muted' }}
  >
    {text}{' '}
    <Link
      href={path}
      className='text-[#A74BE9] transition-opacity hover:opacity-80'
    >
      {linkText}
    </Link>
  </Text>
);

export default FormFooter;
