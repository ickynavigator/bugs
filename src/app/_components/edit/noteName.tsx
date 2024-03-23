'use client';

import { ActionIcon, Button, Modal, TextInput, rem } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconPencil } from '@tabler/icons-react';
import type { Note } from '@prisma/client';
import { api } from '~/trpc/react';
import { useDisclosure } from '@mantine/hooks';
import { noteSchema } from '~/lib/schema';

export default function NoteName(props: Note) {
  const form = useForm({
    initialValues: { name: props.name },
    validate: zodResolver(noteSchema),
  });
  const [opened, { open, close }] = useDisclosure(false);

  const utils = api.useUtils();
  const renameNote = api.notes.renameNote.useMutation({
    onSuccess: async () => {
      await utils.notes.getNotes.invalidate();
      close();
    },
  });

  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit Modal">
        <form
          onSubmit={form.onSubmit(({ name }) => {
            renameNote.mutate({ id: props.id, name });
          })}
        >
          <TextInput
            label="Your email"
            placeholder="Your email"
            {...form.getInputProps('name')}
          />
          <Button
            fullWidth
            mt="md"
            type="submit"
            loading={renameNote.isLoading}
          >
            Change Note Name
          </Button>
        </form>
      </Modal>

      <ActionIcon
        variant="outline"
        onClick={open}
        loading={renameNote.isLoading}
      >
        <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      </ActionIcon>
    </>
  );
}
