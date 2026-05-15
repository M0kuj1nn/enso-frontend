'use client';

import AnimatedBackground from '@components/AnimatedBackground';
import { Form } from '@components/form/Form';
import { FormField } from '@components/form/FormField';
import FormFooter from '@components/form/FormFooter';
import { FormHeader } from '@components/form/FormHeader';
import { FormInput } from '@components/form/FormInput';
import { OAuthBlock } from '@components/form/OAuthBlock';
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

//div поменять Container. style тоже поменять
const Login = () => {
  const onSubmit = (data) => {
    console.log('login', data);
  };

  return (
    <Container
      as='main'
      className='relative size-full overflow-auto bg-[#1A1A1F]'
      variantsUi={{ flow: 'col', items: 'centered' }}
    >
      <AnimatedBackground />

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

            <FormField name='password'>
              <FormInput placeholder='Пароль'></FormInput>
            </FormField>

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
            >
              Войти
            </Button>

            <OAuthBlock title='Войти через' />
          </Form>
          <FormFooter
            text='Еще нет аккаунта?'
            linkText='Создай прямо сейчас!'
            path='/registration'
          />
        </Container>
        <Container className='pointer-events-none absolute top-1/2 -right-9 z-20 h-125 w-125 -translate-y-1/2 bg-[url(/static/svg/greyArma.svg)] bg-contain bg-center bg-no-repeat select-none' />
      </div>
    </Container>
  );
};

export default Login;
