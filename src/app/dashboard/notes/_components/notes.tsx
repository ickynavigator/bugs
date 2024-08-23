'use client';

import { Stack } from '@mantine/core';
import { api } from '~/trpc/react';
import Note from '~/app/_components/note';

interface NoteProps {
  userId: string;
}

export default function Notes(props: NoteProps) {
  const notes = api.notes.getNotes.useQuery();

  return (
    <Stack>
      {notes.data?.map(note => (
        <Note key={note.id} note={note} userId={props.userId} />
      ))}
    </Stack>
  );
}
