'use client';

// tiptap extensions
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';

import {
  RichTextEditor,
  Link,
  RichTextEditorControlsGroup,
  RichTextEditorContent,
} from '@mantine/tiptap';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Text,
  TextInput,
  Title,
  rem,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { modals } from '@mantine/modals';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useEditor } from '@tiptap/react';
import type { Note } from '@prisma/client';
import { api } from '~/trpc/react';
import { useDisclosure } from '@mantine/hooks';
import { z } from 'zod';

interface Props {
  note: Note;
}

function EditNoteName(props: Note) {
  const form = useForm({
    initialValues: { name: props.name },
    validate: zodResolver(z.object({ name: z.string().min(1).max(64) })),
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
          <Button fullWidth mt="md" type="submit">
            Change Note Name
          </Button>
        </form>
      </Modal>

      <ActionIcon onClick={open} loading={renameNote.isLoading}>
        <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      </ActionIcon>
    </>
  );
}

function DeleteNote(props: Note) {
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
      color="red"
      loading={deleteNote.isLoading}
      onClick={handleDelete}
    >
      <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );
}

export default function Note(props: Props) {
  const { note } = props;
  const { content, name } = note;

  const updateNote = api.notes.updateNoteContent.useMutation();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    // on: ({ editor }) => {
    //   updateNote.mutate({ id: note.id, content: editor.getHTML() });
    // },
  });

  return (
    <RichTextEditor editor={editor} h="100%">
      <Group justify="space-between" mx="md" mt="sm">
        <Box>
          <Title>{name}</Title>
        </Box>

        <Group>
          <EditNoteName {...note} />
          <DeleteNote {...note} />
        </Group>
      </Group>

      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditorControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditorControlsGroup>

        <RichTextEditorControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditorControlsGroup>

        <RichTextEditorControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditorControlsGroup>

        <RichTextEditorControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditorControlsGroup>

        <RichTextEditorControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditorControlsGroup>

        <RichTextEditorControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditorControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditorContent />
    </RichTextEditor>
  );
}
