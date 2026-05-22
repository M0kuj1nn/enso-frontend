import { FC } from 'react';

import { useFormFieldContext } from '@contexts/FormFieldContext';
import { Props } from '@shared/types/index';
import { Text } from '@ui/typography/Text';

export const FormLabel: FC<
  Omit<Props<typeof Text<'label'>>, 'as' | 'htmlfor'>
> = (props) => {
  const { name } = useFormFieldContext();

  return <Text as='label' htmlFor={name} {...props} />;
};
