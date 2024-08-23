'use client';

import React from 'react';
import {
  ActionIconGroup,
  Box,
  Group,
  ScrollAreaAutosize,
  Title,
} from '@mantine/core';
import { RichTextEditor, RichTextEditorContent } from '@mantine/tiptap';
import useTipTapEditor from '~/hooks/useTipTapEditor';
import ShareNote from '~/app/_components/share/note';
import { type Note } from '@prisma/client';
import LoaderScreen from '~/app/_components/loader/screen';

interface Props {
  note: Note;
  userId: string;
}

export default function Note(props: Props) {
  const { note, userId } = props;

  const editor = useTipTapEditor(note.content, { editable: false }, [note]);

  if (editor == null) {
    return <LoaderScreen />;
  }

  return (
    <RichTextEditor editor={editor}>
      <Group justify="space-between" mx="md" mt="sm">
        <Box>
          <Title>{note.name}</Title>
        </Box>

        <Group>
          <ActionIconGroup>
            <ShareNote userId={userId} noteId={note.id} />
          </ActionIconGroup>
        </Group>
      </Group>

      <ScrollAreaAutosize mah="calc(100vh - calc(var(--mantine-spacing-xl) * 5))">
        <RichTextEditorContent />
      </ScrollAreaAutosize>
    </RichTextEditor>
  );
}
