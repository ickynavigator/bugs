import { ActionIcon } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import React from 'react';

const handleLogout = async () => {
  await signOut();
};

export default function LogoutIcon() {
  return (
    <ActionIcon
      onClick={handleLogout}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      <IconLogout stroke={1.5} />
    </ActionIcon>
  );
}
