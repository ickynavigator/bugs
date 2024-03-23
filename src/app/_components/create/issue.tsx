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
import { type Project } from '@prisma/client';
import React from 'react';
import { SEVERITY } from '~/lib/constant';
import { issueSchema } from '~/lib/schema';
import { api } from '~/trpc/react';

interface Props {
  projectId: Project['id'];
  children: (props: { open: () => void }) => React.ReactElement;
}

export default function Issue(props: Props) {
  const { children, projectId } = props;

  const utils = api.useUtils();
  const issueStates = api.issue.getIssueStates.useQuery(
    { projectId },
    { initialData: [] },
  );
  const createIssue = api.issue.createIssue.useMutation({
    onSuccess: () => {
      void utils.issue.getIssues.invalidate({ projectId });
      void utils.issue.getIssueStates.invalidate({ projectId });

      close();
      form.reset();
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      severity: Object.keys(SEVERITY)[0],
      projectId,
    },
    validate: zodResolver(issueSchema),
  });
  const handleSubmit = (base: typeof form.values) => {
    const values = issueSchema.parse(base);
    createIssue.mutate({
      name: values.name,
      description: values.description,
      severity: values.severity,
      projectId,
      stateId: values.stateId,
    });
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
              data={Object.entries(SEVERITY).map(([key, value]) => ({
                label: value,
                value: key,
              }))}
              {...form.getInputProps('severity')}
            />

            <Select
              withAsterisk
              label="State"
              description="What state is the issue in?"
              data={issueStates.data.map(state => ({
                label: state.name,
                value: `${state.id}`,
              }))}
              {...form.getInputProps('stateId')}
            />

            <Button type="submit" loading={createIssue.isLoading}>
              Submit
            </Button>
          </Stack>
        </form>
      </Modal>

      {children({ open })}
    </>
  );
}
