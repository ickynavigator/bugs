import React from 'react';
import { Shell } from '~/app/_components/shell';
import useAuthed from '../hook/useAuthed.server';

export default function Layout({ children }: { children: React.ReactNode }) {
  useAuthed();

  return <Shell>{children}</Shell>;
}
