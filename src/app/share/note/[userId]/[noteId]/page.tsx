import React from 'react';
import { Alert } from '@mantine/core';
import { api } from '~/trpc/server';
import { IconError404 } from '@tabler/icons-react';
import Notes from '~/app/share/note/[userId]/[noteId]/_components/note';

interface Props {
  params: {
    userId: string;
    noteId: string;
  };
}

export default async function Page(props: Props) {
  const { params } = props;
  const { userId, noteId: string_noteId } = params;

  const noteId = Number(string_noteId);

  if (Number.isNaN(noteId)) {
    return (
      <Alert
        radius="md"
        color="yellow"
        title="Invalid note ID"
        icon={<IconError404 />}
      >
        Note ID is invalid. Make sure you have the correct URL.
      </Alert>
    );
  }

  const note = await api.notes.getNote.query({ userId, noteId });

  if (note == undefined) {
    return (
      <Alert
        radius="md"
        color="yellow"
        title="Note not found"
        icon={<IconError404 />}
      >
        Note not found. Make sure you have the correct URL.
      </Alert>
    );
  }

  return (
    <>
      <Notes userId={userId} note={note} />
    </>
  );
}
