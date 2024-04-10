import { useEditor } from '@tiptap/react';
import type { Content, EditorOptions } from '@tiptap/react';

import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';

const useTipTapEditor = (content: Content, opts?: Partial<EditorOptions>) => {
  return useEditor({
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
    ...opts,
  });
};

export default useTipTapEditor;
