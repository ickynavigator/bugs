import { Button, Modal, Stack } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { z } from 'zod';

const schema = z.object({});

interface Props {
  children: (props: { open: () => void }) => React.ReactElement;
}

export default function Column(props: Props) {
  const { children } = props;

  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {},
    validate: zodResolver(schema),
  });
  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create a new Column">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </Modal>

      {children({ open })}
    </>
  );
}
