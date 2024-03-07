import { useDebouncedState, useDidUpdate } from '@mantine/hooks';
import { type Note } from '@prisma/client';
import { api } from '~/trpc/react';

interface Opts {
  initialContent: Note['content'];
  id: Note['id'];
}

const DEFAULT_WAIT = 500;

export default function useNoteSync(opts: Opts) {
  const { initialContent = '' } = opts;

  const [value, setValue] = useDebouncedState(initialContent, DEFAULT_WAIT);

  const updateNote = api.notes.updateNoteContent.useMutation();
  const onContentChange = (content: string) => {
    setValue(content);
  };

  useDidUpdate(() => {
    updateNote.mutate({ id: opts.id, content: value });
  }, [opts.id, value]);

  return {
    onContentChange,
    loading: updateNote.isLoading,
  };
}
