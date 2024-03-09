import { Button, Modal, Stack, TextInput, Textarea } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import { z } from 'zod';
import { api } from '~/trpc/react';
import SyncingIcon from '../syncingIcon';
import { useRouter } from 'next/navigation';

const schema = z.object({
  name: z.string().min(1).max(16),
  shortcode: z
    .string()
    .length(3)
    .refine(value => /^[a-zA-Z]+$/.test(value), {
      message: 'Only alphabetic characters are allowed',
    }),
  description: z.string().min(1).max(255).nullable(),
});

interface Props {
  children: (props: { open: () => void }) => React.ReactElement;
  initialData: z.infer<typeof schema> & { id: number };
}

export default function Project(props: Props) {
  const { children, initialData } = props;
  const { id, ...initialValues } = initialData;
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const [validShortCode, setValidShortCode] = useState(false);
  const utils = api.useUtils();
  const checkShortcode = api.issue.checkShortcode.useMutation({
    onSuccess: res => setValidShortCode(res),
  });
  const editProject = api.issue.editProject.useMutation({
    onSuccess: () => {
      if (form.values.shortcode !== initialValues.shortcode) {
        router.push(`/dashboard/project/${form.values.shortcode}`);
      }

      void utils.issue.getProjects.invalidate();
      void utils.issue.getProjectByShortCode.invalidate({
        shortcode: initialValues.shortcode,
      });
      close();
      form.reset();
    },
  });
  const form = useForm({
    initialValues,
    validate: zodResolver(schema),
    onValuesChange(values, prev) {
      if (
        values.shortcode !== prev.shortcode &&
        values.shortcode.length === 3
      ) {
        checkShortcode.mutate({ shortcode: values.shortcode });
      }
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    editProject.mutate({ id, ...values });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit project" centered>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Name"
              placeholder="Project name"
              withAsterisk
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Shortcode"
              placeholder="Project shortcode"
              description="3 letters shortcode for project reference"
              minLength={3}
              maxLength={3}
              withAsterisk
              onInput={e => {
                if (
                  'value' in e.target &&
                  typeof e.target.value == 'string' &&
                  e.target.value.length > 0
                ) {
                  e.target.value = e.target.value.toUpperCase();
                }
              }}
              rightSection={
                <SyncingIcon
                  loading={checkShortcode.isLoading}
                  show={form.isDirty('shortcode')}
                  fail={validShortCode}
                />
              }
              {...form.getInputProps('shortcode')}
            />
            <Textarea
              label="Description"
              placeholder="Project description"
              autosize
              minRows={2}
              maxRows={4}
              withAsterisk
              {...form.getInputProps('description')}
            />

            <Button type="submit" loading={editProject.isLoading}>
              Submit
            </Button>
          </Stack>
        </form>
      </Modal>

      {children({ open })}
    </>
  );
}
