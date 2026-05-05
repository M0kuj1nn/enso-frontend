import { FC } from 'react';
import { Text } from '@ui/typography/Text';
import Link from 'next/link';

interface FormFooterProps {
  text: string;
  linkText: string;
  path: string;
}

const FormFooter: FC<FormFooterProps> = ({ text, linkText, path }) => (
  <Text as='span' className='gap-2' variants={{ size: 'xs' }}>
    {text}
    <Link href={path} className='text-indigo-400 hover:text-indigo-400/80'>
      {linkText}
    </Link>
  </Text>
);

export default FormFooter;
