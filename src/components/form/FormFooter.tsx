import { FC } from 'react';
import { Text } from '@ui/typography/Text';
import Link from 'next/link';

interface FormFooterProps {
  text: string;
  linkText: string;
  path: string;
}

const FormFooter: FC<FormFooterProps> = ({ text, linkText, path }) => (
  <Text as='span' className='gap-2 mt-6' variantsUi={{ size: 'xs', color: 'muted' }}>
    {text}
    {' '}
    <Link href={path} className='text-[#A74BE9] hover:opacity-80 transition-opacity'>
      {linkText}
    </Link>
  </Text>
);

export default FormFooter;
