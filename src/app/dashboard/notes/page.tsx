import { Stack } from '@mantine/core';
import CreateNote from '~/app/_components/create/note';
import Note from '~/app/_components/note/index';
import { auth } from '~/server/auth';
import { api } from '~/trpc/server';

export default async function Page() {
  const userId = (await auth())?.user.id;
  const notes = await api.notes.getNotes.query();

  return (
    <Stack>
      <CreateNote />

      {notes?.map(note => (
        <Note key={note.id} note={note} userId={`${userId}`} />
      ))}
    </Stack>
  );
}
