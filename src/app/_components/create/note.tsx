'use client';

import { Button } from '@mantine/core';
import React from 'react';
import { api } from '~/trpc/react';

export default function Note() {
  const utils = api.useUtils();
  const createNote = api.notes.createNote.useMutation({
    onSuccess: () => {
      void utils.notes.getNotes.invalidate();
    },
  });

  return (
    <Button
      fullWidth
      onClick={() => createNote.mutate()}
      loading={createNote.isLoading}
    >
      Create new note
    </Button>
  );
}
