'use client';

import {
  RichTextEditor,
  RichTextEditorControlsGroup,
  RichTextEditorContent,
} from '@mantine/tiptap';
import { ActionIconGroup, Box, Group, Title } from '@mantine/core';
import type { Note } from '@prisma/client';
import EditNoteName from '~/app/_components/edit/noteName';
import DeleteNote from '~/app/_components/delete/note';
import ShareNote from '~/app/_components/share/note';
import useNoteSync from '~/hooks/useNoteSync';
import SyncingIcon from '~/app/_components/syncingIcon';
import useTipTapEditor from '~/hooks/useTipTapEditor';
import useGetAuthedUser from '~/hooks/useGetAuthedUser';

interface Props {
  note: Note;
}

export default function Note(props: Props) {
  const { note } = props;
  const { content, name } = note;

  const userId = useGetAuthedUser()?.user?.id;

  const {
    onContentChange,
    loading: noteSyncLoading,
    dirty,
  } = useNoteSync({
    id: note.id,
    initialContent: content,
  });

  const editor = useTipTapEditor(content, {
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
          <SyncingIcon loading={noteSyncLoading} dirty={dirty} size="md" />

          <ActionIconGroup>
            <EditNoteName {...note} />
            <ShareNote userId={`${userId}`} noteId={note.id} />
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
