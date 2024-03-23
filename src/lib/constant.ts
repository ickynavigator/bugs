import { DEFAULT_THEME } from '@mantine/core';

export const COLUMN_WIDTH = 300;
export const TIPTAP_DUMMY_TEXT =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';
export const SEVERITY = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Critical',
  5: 'Blocker',
};
export const KANBAN_TITLES = {
  BOARD: 'Board',
  COLUMNS: 'Columns',
  ISSUES: 'Issues',
} as const;
export const COLOR_SWATCHES = [
  ...DEFAULT_THEME.colors.red,
  ...DEFAULT_THEME.colors.green,
  ...DEFAULT_THEME.colors.blue,
  ...DEFAULT_THEME.colors.yellow,
];
