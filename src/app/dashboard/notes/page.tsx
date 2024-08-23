import { Stack } from '@mantine/core';
import CreateNote from '~/app/_components/create/note';
import Notes from '~/app/dashboard/notes/_components/notes';
import { auth } from '~/server/auth';

export default async function Page() {
  const userId = (await auth())?.user.id;

  return (
    <Stack>
      <CreateNote />

      <Notes userId={`${userId}`} />
    </Stack>
  );
}
