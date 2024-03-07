import { ActionIcon } from '@mantine/core';
import { IconLogout2 } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import React, { useState } from 'react';

export default function LogoutIcon() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  return (
    <ActionIcon
      onClick={handleLogout}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
      title="Logout"
      loading={loading}
    >
      <IconLogout2 stroke={1.5} />
    </ActionIcon>
  );
}
