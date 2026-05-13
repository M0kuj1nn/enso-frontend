'use client';

import { FormHeader } from '@components/form/FormHeader';
import { Container } from '@ui/Container';
import { Form } from '@components/form/Form';
import { FormField } from '@components/form/FormField';
import { Text } from '@ui/typography/Text';
import { FormInput } from '@components/form/FormInput';
import { Button } from '@ui/Button';


import * as z from 'zod/v4-mini';
import { OAuthBlock } from '@components/form/OAuthBlock';
import FormFooter from '@components/form/FormFooter';




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
    console.log('login', data)
  }

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
        variantsUi={{ flow: 'col', items: 'centered' }}>
        
        <div
          className='absolute pointer-events-none select-none'
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
        className='w-full max-w-[480] mr-[240] p-18 rounded-2xl bg-[#141418]'
        variantsUi={{ flow: 'col', items: 'centered' }}>
          <FormHeader title='Добро Пожаловать!'>
            Магия общения начинается прямо здесь
          </FormHeader>
          <Form
            schema={scheme}
            onSubmit={onSubmit}
            className='w-full p-0 mt-8 gap-5'
            variantsUi={{flow: 'col'}}
          >
            <FormField name='email'>
              <FormInput placeholder='Email'></FormInput>
            </FormField>

            <FormField name='password'>
              <FormInput placeholder='Пароль'></FormInput>
            </FormField>

            <Text
              as='span'
              className='self-start cursor-pointer hover:opacity-80'
              variantsUi={{ size: 'xs', color: 'accent' }}
            >
              Забыли пароль?
            </Text>

            <Button variantsUi={{ wide: true, color:'glamor' }} className='mt-4'> 
              Войти
            </Button>

            <OAuthBlock />
          </Form>
          <FormFooter
            text='Еще нет аккаунта?'
            linkText='Создай прямо сейчас!'
            path='/register'
          />
      </Container>
    </Container>
  );
};

export default Login