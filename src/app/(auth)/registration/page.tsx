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

const schema = z
  .object({
    name: z.string().check(z.minLength(5, 'Minimum length is 5 symbols')),
    email: z.string().check(
      z.refine((value) => /@[a-zA-Z]{2,}/gi.test(value), {
        error: "Please provide an email's domain",
      }),
      z.refine(
        (value) => /\.[a-zA-Z]{2,}$/gi.test(value),
        'Please include top level domain such as .co .org',
      ),
    ),
    agreement: z.boolean(),
    password: z.string().check(z.minLength(8, 'Minimum length is 8 symbols')),
    confirmedPassword: z.string(),
  })
  .check(
    z.refine(
      ({ password, confirmedPassword }) => password === confirmedPassword,
      {
        error: 'Passwords are not same',
        path: ['confirmedPassword'],
      },
    ),
  );

const Registration = () => {
  const onSubmit = (data) => {
    console.log('register', data);
  };

  return (
    <Container
      as='main'
      className='size-full bg-[#1A1A1F]'
      variantsUi={{ flow: 'col', items: 'centered' }}
    >
      <Container
        className='w-full max-w-[480] rounded-2xl bg-[#141418] p-18'
        variantsUi={{ flow: 'col', items: 'centered' }}
      >
        <FormHeader title='Создание аккаунта'>
          Присоединяйся к пространству живого общения!
        </FormHeader>
        <Form
          schema={schema}
          onSubmit={onSubmit}
          className='mt-8 w-full gap-5 p-0'
          variantsUi={{ flow: 'col' }}
        >
          <FormField name='email'>
            <FormInput placeholder='Email' />
          </FormField>

          <FormField name='name'>
            <FormInput placeholder='Имя пользователя'></FormInput>
          </FormField>

          <FormField name='password'>
            <FormInput placeholder='Пароль'></FormInput>
          </FormField>

          {/* <FormField name='password confirm'>
              <FormInput placeholder='Подтвердите пароль'></FormInput>
            </FormField> */}

          <Button variantsUi={{ wide: true, color: 'glamor' }} className='mt-4'>
            Стать частью ENSO
          </Button>

          <OAuthBlock title='Зарегистрироваться через' />
        </Form>

        <FormFooter text='Уже есть аккаунт?' linkText='Войти' path='login' />
      </Container>
    </Container>
  );
};

export default Registration;
