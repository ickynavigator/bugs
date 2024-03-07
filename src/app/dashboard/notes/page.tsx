'use client';

import { Box, Loader, Stack } from '@mantine/core';
import CreateNote from '~/app/_components/note/createNote';
import Note from '~/app/_components/note/index';
import { api } from '~/trpc/react';

export default function Page() {
  const notes = api.notes.getNotes.useQuery();

  return (
    <Stack>
      <CreateNote />

      {notes.isLoading ? (
        <Box>
          <Loader />
        </Box>
      ) : (
        notes.data?.map(note => <Note key={note.id} note={note} />)
      )}
    </Stack>
  );
}
