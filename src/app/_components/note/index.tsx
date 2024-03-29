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
import { ActionIconGroup, Box, Group, Title } from '@mantine/core';
import { useEditor } from '@tiptap/react';
import type { Note } from '@prisma/client';
import EditNoteName from '~/app/_components/edit/noteName';
import DeleteNote from '~/app/_components/delete/note';
import useNoteSync from '~/hooks/useNoteSync';
import SyncingIcon from '~/app/_components/syncingIcon';

interface Props {
  note: Note;
}

export default function Note(props: Props) {
  const { note } = props;
  const { content, name } = note;
  const { onContentChange, loading: noteSyncLoading } = useNoteSync({
    id: note.id,
    initialContent: content,
  });

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
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  return (
    <RichTextEditor editor={editor} h="100%">
      <Group justify="space-between" mx="md" mt="sm">
        <Box>
          <Title>{name}</Title>
        </Box>

        <Group>
          <SyncingIcon loading={noteSyncLoading} />

          <ActionIconGroup>
            <EditNoteName {...note} />
            <DeleteNote {...note} />
          </ActionIconGroup>
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
