'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@contexts/AuthContext';
import { Form } from '@page-components/(auth)/auth-components/form/Form';
import { FormField } from '@page-components/(auth)/auth-components/form/FormField';
import FormFooter from '@page-components/(auth)/auth-components/form/FormFooter';
import { FormHeader } from '@page-components/(auth)/auth-components/form/FormHeader';
import { FormInput } from '@page-components/(auth)/auth-components/form/FormInput';
import { OAuthBlock } from '@page-components/(auth)/auth-components/form/OAuthBlock';
import { Password } from '@page-components/(auth)/auth-components/form/Password';
import { Button } from '@ui/Button';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import * as z from 'zod/v4-mini';

const scheme = z.object({
  email: z.email().check(
    z.refine((value) => /@[a-zA-Z]{2,}/gi.test(value), {
      error: "Please provide an email's domain",
    }),
    z.refine(
      (value) => /\.[a-zA-Z]{2,}$/gi.test(value),
      'Please include top level domain such as .co .org',
    ),
  ),
  password: z.string().check(z.minLength(8, 'Minimum length is 8 symbols')),
});

const Login = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: z.infer<typeof scheme>) => {
    await login(data);
    router.push('/chat');
  };

  return (
    <div className='relative flex w-300 items-center justify-center'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <Container className='absolute top-1/2 left-55 z-5 h-250 w-250 -translate-y-1/2 bg-[url(/static/svg/smallBg.svg)] bg-contain bg-center bg-no-repeat opacity-50' />
      </div>
      <Container
        className='relative z-10 w-120 shrink-0 rounded-4xl p-18'
        variantsUi={{ flow: 'col', items: 'centered', style: 'whiteglass' }}
      >
        <FormHeader title='Добро Пожаловать!'>
          Магия общения начинается прямо здесь
        </FormHeader>
        <Form
          schema={scheme}
          onSubmit={onSubmit}
          className='mt-8 w-full gap-5 p-0'
          variantsUi={{ flow: 'col' }}
        >
          <FormField name='email'>
            <FormInput placeholder='Email'></FormInput>
          </FormField>

          <Password name='password' inputProps={{ placeholder: 'Пароль' }} />

          <Text
            as='span'
            className='cursor-pointer self-start hover:opacity-80'
            variantsUi={{ size: 'xs', color: 'accent' }}
          >
            Забыли пароль?
          </Text>

          <Button
            variantsUi={{ wide: true, color: 'glamor' }}
            className='mt-4'
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>

          {error && (
            <Text
              variantsUi={{ size: 'xs', color: 'red' }}
              className='self-start'
            >
              {error}
            </Text>
          )}

          <OAuthBlock title='Войти через' />
        </Form>
        <FormFooter
          text='Еще нет аккаунта?'
          linkText='Создай прямо сейчас!'
          path='/registration'
        />
      </Container>
      <Container className='pointer-events-none absolute top-1/2 -right-9 z-20 h-125 w-125 -translate-y-1/2 bg-[url(/static/svg/greyArmaWithShade.svg)] bg-contain bg-center bg-no-repeat select-none' />
    </div>
  );
};

export default Login;
