import {
  Button,
  Modal,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { type z } from 'zod';
import { SEVERITY } from '~/lib/constant';
import { issueSchema } from '~/lib/schema';
import { api } from '~/trpc/react';

const editIssueSchema = issueSchema.omit({ projectId: true });
const severityOptions = Object.entries(SEVERITY).map(([key, value]) => ({
  label: value,
  value: key,
}));

interface Props {
  children: (props: { open: () => void }) => React.ReactElement;
  initialData: z.infer<typeof editIssueSchema> & {
    id: number;
    projectId: number;
  };
}

export default function Issue(props: Props) {
  const { children, initialData } = props;
  const { id, projectId, ...initialValues } = initialData;

  const [opened, { open, close }] = useDisclosure(false, {
    onOpen: () => {
      form.setValues({
        ...initialValues,
        severity: String(initialValues.severity),
      });
    },
  });

  const utils = api.useUtils();
  const editIssue = api.issue.editIssue.useMutation({
    onSuccess: async () => {
      await utils.issue.getGroupedIssuesByProject.invalidate({ projectId });
      close();
    },
  });

  const form = useForm({
    initialValues: {
      ...initialValues,
      severity: String(initialValues.severity),
    },
    validate: zodResolver(editIssueSchema),
  });
  const handleSubmit = (base: typeof form.values) => {
    const values = editIssueSchema.parse(base);
    editIssue.mutate({ id, projectId, ...values });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create a new Issue">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              withAsterisk
              label="Name"
              description="Column name"
              placeholder="Do the thing"
              {...form.getInputProps('name')}
            />

            <Textarea
              withAsterisk
              label="Description"
              description="Column description"
              placeholder="We need to do the thing because of reasons."
              {...form.getInputProps('description')}
            />

            <Select
              withAsterisk
              label="Severity"
              description="How severe is the issue?"
              data={severityOptions}
              {...form.getInputProps('severity')}
            />

            <Button type="submit" loading={editIssue.isLoading}>
              Submit
            </Button>
          </Stack>
        </form>
      </Modal>

      {children({ open })}
    </>
  );
}
