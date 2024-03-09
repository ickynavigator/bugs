'use client';

import { ActionIcon, Text, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { type Note } from '@prisma/client';
import { IconTrash } from '@tabler/icons-react';
import { api } from '~/trpc/react';

export default function Note(props: Note) {
  const utils = api.useUtils();
  const deleteNote = api.notes.deleteNote.useMutation({
    onSuccess: () => {
      void utils.notes.getNotes.invalidate();
    },
  });

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Please confirm the note deletion',
      children: (
        <Text size="sm">
          Are you sure you want to delete this note? This action is
          irreversible!
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteNote.mutate({ id: props.id }),
    });
  };

  return (
    <ActionIcon
      variant="outline"
      color="red"
      loading={deleteNote.isLoading}
      onClick={handleDelete}
    >
      <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );
}
