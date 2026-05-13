'use client';

import { FC } from 'react';

import GoogleIcon from '@icons/google.svg';
//ЗАМЕНИТЬ КНОПКИ НА OAuthButton
import YandexIcon from '@icons/yandex.svg';
import { Props } from '@shared/types/index';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';

import { OAuthButton } from './OAuthButton';

interface OAuthBlockProps extends Omit<
  Props<typeof Container>,
  'as' | 'children'
> {
  title: string;
}

export const OAuthBlock: FC<OAuthBlockProps> = ({ title, ...props }) => (
  <Container
    className='mt-5 gap-4 p-0'
    variantsUi={{ flow: 'col', items: 'centered' }}
  >
    {/* Divider */}
    <Container className='w-full p-0' variantsUi={{ items: 'centered' }}>
      <span className='flex-1 border-t border-[#27272D]' />
      <Text
        as='span'
        className='px-3'
        variantsUi={{ size: 'xs', color: 'muted' }}
      >
        {title}
      </Text>
      <span className='flex-1 border-t border-[#27272D]' />
    </Container>

    {/* Кнопки */}
    <Container className='gap-5 p-0' variantsUi={{ items: 'centered' }}>
      <Button
        className='w-full'
        variantsUi={{ color: 'gray', border: 'main', size: 'sm' }}
      >
        <YandexIcon className='h-4 w-4' />
        Yandex
      </Button>
      <Button
        className='w-full'
        variantsUi={{ color: 'gray', border: 'main', size: 'sm' }}
      >
        <GoogleIcon className='h-4 w-4' />
        Google
      </Button>
    </Container>
  </Container>
);
