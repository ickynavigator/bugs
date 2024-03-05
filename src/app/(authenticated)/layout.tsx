import React from 'react';
import { Shell } from '~/app/_components/shell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
