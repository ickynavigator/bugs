'use client';

import type { ButtonProps } from '@mantine/core';
import { Button } from '@mantine/core';
import { signIn } from '~/server/auth/react';
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandGoogle,
} from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

type State = 'error' | 'idle' | 'pending' | 'success';
type EnhancedButtonProps = ButtonProps &
  React.ComponentPropsWithoutRef<'button'>;

interface BaseButtonProps extends EnhancedButtonProps {
  icon: React.ReactNode;
  provider: Parameters<typeof signIn>[0];
  children: React.ReactNode;
}

export function Base(props: BaseButtonProps) {
  const { icon, provider, children, ...rest } = props;

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const [state, setState] = useState<State>('idle');

  const handleSignIn = async () => {
    try {
      setState('pending');
      await signIn(provider, { callbackUrl: redirectTo ?? '/dashboard' });
    } catch (error) {
      setState('error');
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={state === 'pending'}
      leftSection={icon}
      variant="default"
      radius="xl"
      {...rest}
    >
      {children}
    </Button>
  );
}

export function GoogleButton(props: EnhancedButtonProps) {
  return (
    <Base icon={<IconBrandGoogle />} provider="google" disabled {...props}>
      Continue with Google
    </Base>
  );
}

export function FacebookButton(props: EnhancedButtonProps) {
  return (
    <Base icon={<IconBrandFacebook />} provider="facebook" disabled {...props}>
      Continue with Facebook
    </Base>
  );
}

export function GithubButton(props: EnhancedButtonProps) {
  return (
    <Base icon={<IconBrandGithub />} provider="github" {...props}>
      Continue with Github
    </Base>
  );
}
