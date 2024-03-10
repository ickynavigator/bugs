import {
  Button,
  ColorInput,
  DEFAULT_THEME,
  Modal,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import type { Project } from '@prisma/client';
import React from 'react';
import { z } from 'zod';
import { api } from '~/trpc/react';

const schema = z.object({
  name: z.string().min(1).max(16),
  color: z.string(),
});

interface Props {
  projectId: Project['id'];
  children: (props: { open: () => void }) => React.ReactElement;
}

export default function Column(props: Props) {
  const { children, projectId } = props;

  const [opened, { open, close }] = useDisclosure(false);
  const utils = api.useUtils();
  const createColumn = api.issue.createIssueState.useMutation({
    onSuccess: () => {
      void utils.issue.getIssueStates.invalidate({ projectId });
      close();
      form.reset();
    },
  });
  const form = useForm({
    initialValues: {
      name: '',
      color: '#ffffff',
    },
    validate: zodResolver(schema),
  });
  const handleSubmit = (values: typeof form.values) => {
    createColumn.mutate({
      name: values.name,
      color: values.color,
      projectId,
    });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create a new Column">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              withAsterisk
              label="Name"
              description="Column name"
              placeholder="Todo"
              {...form.getInputProps('name')}
            />
            <ColorInput
              withAsterisk
              label="Color"
              description="Column color"
              placeholder="#ffffff"
              swatchesPerRow={10}
              swatches={[
                ...DEFAULT_THEME.colors.red,
                ...DEFAULT_THEME.colors.green,
                ...DEFAULT_THEME.colors.blue,
                ...DEFAULT_THEME.colors.yellow,
              ]}
              {...form.getInputProps('color')}
            />

            <Button type="submit" loading={createColumn.isLoading}>
              Submit
            </Button>
          </Stack>
        </form>
      </Modal>

      {children({ open })}
    </>
  );
}
