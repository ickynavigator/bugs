'use client';

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Burger,
  Group,
  Title,
  Anchor,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';

import Sidebar from './sidebar';
import ColorSchemeToggle from '../colorSchemeToggle';
import LogoutIcon from './logout';

interface Props {
  children: React.ReactNode;
}

export function Shell(props: Props) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShellHeader>
        <Group justify="space-between" h="100%" px="md">
          <Group h="100%">
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="sm"
            />
            <Anchor component={Link} href="/" passHref underline="never">
              <Title>Bug Tracker</Title>
            </Anchor>
          </Group>

          <Group>
            <ColorSchemeToggle />
            <LogoutIcon />
          </Group>
        </Group>
      </AppShellHeader>

      <Sidebar />

      <AppShellMain>{props.children}</AppShellMain>
    </AppShell>
  );
}
