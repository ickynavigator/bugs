'use client';

import {
  RichTextEditor,
  Link,
  RichTextEditorControlsGroup,
  RichTextEditorContent,
} from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { ActionIcon, Box, Group, Title, rem } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

interface Props {
  content: string;
  name: string;
}

export default function Note(props: Props) {
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
    content: props.content,
  });

  return (
    <RichTextEditor editor={editor} h="100%">
      <Group justify="space-between" mx="sm">
        <Box>
          <Title>{props.name}</Title>
        </Box>

        <Group>
          <ActionIcon>
            <IconPencil
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon color="red">
            <IconTrash
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
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
