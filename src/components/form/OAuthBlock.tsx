'use client';

import { FC } from 'react';
import { Text } from '@ui/typography/Text';
import { Container } from '@ui/Container';
import { OAuthButton } from './OAuthButton';
import { Button } from '@ui/Button';  //ЗАМЕНИТЬ КНОПКИ НА OAuthButton
import YandexIcon from '@icons/yandex.svg';
import GoogleIcon from '@icons/google.svg';


export const OAuthBlock: FC = () => (
  <Container className='p-0 gap-4 mt-5' variantsUi={{ flow: 'col', items: 'centered' }}>
    {/* Divider */}
    <Container className='w-full p-0' variantsUi={{ items: 'centered' }}>
      <span className='flex-1 border-t border-[#27272D]' />
      <Text as='span' className='px-3' variantsUi={{ size: 'xs', color: 'muted' }}>
        войти через
      </Text>
      <span className='flex-1 border-t border-[#27272D]' />
    </Container>

    {/* Кнопки */}
    <Container className=' p-0 gap-5' variantsUi={{ items: 'centered' }}>
      <Button
        className='w-full'
        variantsUi={{ color: 'gray', border: 'main', size: 'sm' }}
      >
        <YandexIcon className='w-4 h-4' />
        Yandex
      </Button>
      <Button
        className='w-full'
        variantsUi={{ color: 'gray', border: 'main', size: 'sm' }}
      >
        <GoogleIcon className='w-4 h-4' />
        Google
      </Button>
    </Container>
  </Container>
);
