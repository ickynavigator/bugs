'use client';

import { ActionIcon, Text, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import type { IssueState } from '@prisma/client';
import { IconTrash } from '@tabler/icons-react';
import { api } from '~/trpc/react';

interface ColumnProps {
  id: IssueState['id'];
}

export default function Column(props: ColumnProps) {
  const utils = api.useUtils();
  const deleteColumn = api.issue.deleteIssueState.useMutation({
    onSuccess: () => {
      void utils.issue.getIssueStates.invalidate();
    },
  });

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Please confirm the column deletion',
      children: (
        <Text size="sm">
          Are you sure you want to delete this column? This action is
          irreversible!
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteColumn.mutate({ id: props.id }),
    });
  };

  return (
    <ActionIcon
      variant="outline"
      color="red"
      loading={deleteColumn.isLoading}
      onClick={handleDelete}
    >
      <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );
}
