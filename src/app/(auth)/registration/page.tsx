'use client';

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

const schema = z.object({
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
  password: z.string().check(z.minLength(8, 'Minimum length is 8 symbols')),
});

const Registration = () => {
  const { register, isLoading, error } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await register(data);
      router.push('/chat');
    } catch {}
  };

  return (
    <div className='relative flex w-300 items-center justify-center'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <Container className='absolute top-1/2 left-55 z-5 h-250 w-250 -translate-y-1/2 bg-[url(/static/svg/smallBg.svg)] bg-contain bg-center bg-no-repeat opacity-50' />
      </div>
      <Container
        className='relative z-10 w-120 shrink-0 rounded-4xl p-18'
        variantsUi={{
          flow: 'col',
          items: 'centered',
          style: 'form-whiteglass',
        }}
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

          <Password name='password' inputProps={{ placeholder: 'Пароль' }} />

          <Button
            variantsUi={{ wide: true, color: 'glamor' }}
            className='mt-4'
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Стать частью ENSO'}
          </Button>

          {error && (
            <Text
              variantsUi={{ size: 'xs', color: 'red' }}
              className='self-start'
            >
              {error}
            </Text>
          )}

          <OAuthBlock title='Зарегистрироваться через' />
        </Form>
        <FormFooter text='Уже есть аккаунт?' linkText='Войти' path='login' />
      </Container>
      <Container className='pointer-events-none absolute top-1/2 -right-9 z-20 h-125 w-125 -translate-y-1/2 bg-[url(/static/svg/greyArmaWithShade.svg)] bg-contain bg-center bg-no-repeat select-none' />
    </div>
  );
};

export default Registration;
