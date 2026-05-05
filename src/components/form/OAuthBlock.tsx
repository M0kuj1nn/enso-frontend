import { FC } from 'react';
import { Text } from '@ui/typography/Text';
import { Container } from '@ui/Container';
import { OAuthButton } from './OAuthButton';
import GoogleIcon from '@icons/Google.svg';
import GitHubIcon from '@icons/GitHub.svg';

export const OAuthBlock: FC = () => (
  <Container className='p-0 gap-4' variants={{ flow: 'col', items: 'centered' }}>
    <Container className='w-full p-0' variants={{ items: 'centered' }}>
      <span className='flex-1/4 border-1 dark:border-dark-300 border-light-300' />
      <Text as='span'>Or continue with</Text>
      <span className='flex-1/4 border-1 dark:border-dark-300 border-light-300' />
    </Container>
    <Container
      className='w-full p-0 flex-nowrap'
      variants={{ items: 'centered' }}
    >
      <OAuthButton
        className='w-full'
        type='button'
        provider='google'
        defaultCallback='/today'
        variants={{ color: 'ghost', border: 'main' }}
      >
        <GoogleIcon />
        Google
      </OAuthButton>
      <OAuthButton
        className='w-full'
        type='button'
        provider='github'
        defaultCallback='/today'
        variants={{ color: 'ghost', border: 'main' }}
      >
        <GitHubIcon />
        Github
      </OAuthButton>
    </Container>
  </Container>
);
