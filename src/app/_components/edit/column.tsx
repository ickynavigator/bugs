import { Button, ColorInput, Modal, Stack, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { type z } from 'zod';
import { COLOR_SWATCHES } from '~/lib/constant';
import { columnSchema } from '~/lib/schema';
import { api } from '~/trpc/react';

interface Props {
  children: (props: { open: () => void }) => React.ReactElement;
  initialData: z.infer<typeof columnSchema> & { id: number; projectId: number };
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
    validate: zodResolver(columnSchema),
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
              swatches={COLOR_SWATCHES}
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
