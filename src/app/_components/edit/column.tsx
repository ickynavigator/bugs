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
import React from 'react';
import { z } from 'zod';
import { api } from '~/trpc/react';

const schema = z.object({
  name: z.string().min(1).max(16),
  color: z.string(),
});

interface Props {
  children: (props: { open: () => void }) => React.ReactElement;
  initialData: z.infer<typeof schema> & { id: number; projectId: number };
}

export default function Column(props: Props) {
  const { children, initialData } = props;
  const { id, projectId, ...initialValues } = initialData;
  const [opened, { open, close }] = useDisclosure(false, {
    onOpen: () => {
      form.setValues(initialValues);
    },
  });

  const utils = api.useUtils();

  const editIssueState = api.issue.editIssueState.useMutation({
    onSuccess: async () => {
      await utils.issue.getIssueStates.invalidate({ projectId });

      close();
    },
  });
  const form = useForm({
    initialValues,
    validate: zodResolver(schema),
  });

  const handleSubmit = (values: typeof form.values) => {
    editIssueState.mutate({ id, projectId, ...values });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit the Column">
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

            <Button type="submit" loading={editIssueState.isLoading}>
              Submit
            </Button>
          </Stack>
        </form>
      </Modal>

      {children({ open })}
    </>
  );
}
