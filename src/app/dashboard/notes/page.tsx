'use client';

import { Stack } from '@mantine/core';
import { Suspense } from 'react';
import CreateNote from '~/app/_components/create/note';
import FullLoader from '~/app/_components/loader/full';
import Note from '~/app/_components/note/index';
import { api } from '~/trpc/react';

export default function Page() {
  const notes = api.notes.getNotes.useQuery();

  return (
    <Stack>
      <CreateNote />

      <Suspense fallback={<FullLoader />}>
        {notes.data?.map(note => <Note key={note.id} note={note} />)}
      </Suspense>
    </Stack>
  );
}
