import { ActionIcon, Text, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { api } from '~/trpc/react';

interface Props {
  id: number;
}

export default function Project(props: Props) {
  const { id } = props;

  const router = useRouter();
  const deleteProject = api.issue.deleteProject.useMutation({
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Please confirm the Project deletion',
      children: (
        <Text size="sm">
          Are you sure you want to delete this project? This action is
          irreversible!
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteProject.mutate(id),
    });
  };

  return (
    <ActionIcon
      variant="outline"
      color="red"
      onClick={handleDelete}
      loading={deleteProject.isLoading}
    >
      <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );
}
