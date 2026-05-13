import { FC } from 'react';
import { Container } from '@ui/Container';
import { Text } from '@ui/typography/Text';
import { Props } from '@shared/types/index';


interface FormHeaderProps
  extends Omit<Props<typeof Container>, 'as' | 'children'> { //Не понятно. Container может быть любым элементом, а children - это текст, который мы передаем в компонент. Поэтому мы исключаем эти пропсы из типа Props<typeof Container>.
  title: string;
  children: string;
}


export const FormHeader: FC<FormHeaderProps> = ({ title, children, ...props }) => (
  <Container variantsUi={{ flow: 'col', items: 'start' }} className='p-0 gap-1 w-full' {...props}>
    <Text as='h1' variantsUi={{ font: 'dela', size: 'xl' }} className='mb-12'>
      ЕNSO
    </Text>
    <Text as='h2' variantsUi={{ size: 'xl', weight: 'semibold' }}>
      {title}
    </Text>
    <Text as='p' variantsUi={{ size: 'sm', color: 'muted' }}>
      {children}
    </Text>
  </Container>
)
