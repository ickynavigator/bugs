import React, { Suspense } from 'react';
import { Shell } from '~/app/_components/shell';
import useAuthed from '~/hooks/useAuthed.server';
import LoaderScreen from '~/app/_components/loader/screen';

export default function Layout({ children }: { children: React.ReactNode }) {
  useAuthed();

  return (
    <Suspense fallback={<LoaderScreen />}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
