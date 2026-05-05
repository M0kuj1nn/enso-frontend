'use client';

import { AuthErrors } from '@shared/constants/error.constants';
import { Props } from '@shared/types/other.types';
import { Button } from '@ui/Button';
import { OAuthProviderType } from 'next-auth/providers/oauth-types';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';
import { toast } from 'sonner';

interface OAuthButtonProps extends Omit<Props<typeof Button>, 'onClick'> {
  provider: OAuthProviderType;
  defaultCallback: string;
}

export const OAuthButton: FC<OAuthButtonProps> = ({
  provider,
  defaultCallback,
  ...props
}) => {
  const router = useRouter();
  const callbackUrl = useSearchParams().get('callback') ?? defaultCallback;

  const onClick = async () => {
    try {
      const res = await signIn(provider, {
        callbackUrl,
      });

      if (res?.ok) {
        router.push('/today');
      }
      
    } catch (error) {
      toast.error(AuthErrors.INTERNAL_ERROR, {
        dismissible: true,
      });
    }
  };

  return <Button onClick={onClick} {...props} />;
};
