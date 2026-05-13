'use client';

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
      className='size-full bg-[#1A1A1F]'
      style={{
        backgroundImage: 'url(/static/svg/abstractBackground.svg)',
        backgroundSize: '1000px auto',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      variantsUi={{ flow: 'col', items: 'centered' }}
    >
      <div
        className='pointer-events-none absolute select-none'
        style={{
          right: '50%',
          top: '50%',
          transform: 'translateX(calc(265px + 50%)) translateY(-50%)',
          width: '500px',
          height: '500px',
          backgroundImage: 'url(/static/svg/greyArma.svg)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <Container
        className='mr-[240] w-full max-w-[480] rounded-2xl bg-[#141418] p-18'
        variantsUi={{ flow: 'col', items: 'centered' }}
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

          <Button variantsUi={{ wide: true, color: 'glamor' }} className='mt-4'>
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
    </Container>
  );
};

export default Login;
