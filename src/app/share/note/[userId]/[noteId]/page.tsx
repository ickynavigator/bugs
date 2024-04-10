'use client';

import React from 'react';
import {
  ActionIconGroup,
  Alert,
  Box,
  Group,
  Loader,
  Title,
} from '@mantine/core';
import { RichTextEditor, RichTextEditorContent } from '@mantine/tiptap';
import useTipTapEditor from '~/hooks/useTipTapEditor';
import ShareNote from '~/app/_components/share/note';
import { api } from '~/trpc/react';
import { IconError404, IconExclamationCircle } from '@tabler/icons-react';

interface Props {
  params: {
    userId: string;
    noteId: string;
  };
}

function Page(props: Props) {
  const { params } = props;
  const { userId, noteId } = params;

  const note = api.notes.getNote.useQuery({ userId, noteId: Number(noteId) });

  const editor = useTipTapEditor(
    note.data?.content ?? '',
    { editable: false },
    [note.data],
  );

  if (note.isLoading) {
    return <Loader size="xl" />;
  }

  if (note.error) {
    return (
      <Alert
        radius="md"
        color="red"
        title="An error occurred"
        icon={<IconExclamationCircle />}
      >
        An error occurred while fetching the note. Please try again later.
      </Alert>
    );
  }

  if (note.data == undefined) {
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
    <RichTextEditor editor={editor}>
      <Group justify="space-between" mx="md" mt="sm">
        <Box>
          <Title>{note.data.name}</Title>
        </Box>

        <Group>
          <ActionIconGroup>
            <ShareNote userId={userId} noteId={noteId} />
          </ActionIconGroup>
        </Group>
      </Group>

      <RichTextEditorContent />
    </RichTextEditor>
  );
}

export default Page;
