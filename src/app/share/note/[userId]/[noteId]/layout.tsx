import { Center } from '@mantine/core';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <Center h="100%" px="xl">
      {children}
    </Center>
  );
}
