'use client';

import { useOptimistic, useState, useTransition } from 'react';
import KanbanBoard from '~/app/_components/board/kanban/board';
import { Boards } from '~/app/_components/board/type';
import {
  Group,
  Box,
  Button,
  SegmentedControl,
  Stack,
  ButtonGroup,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Search from './search';
import CreateColumn from '~/app/_components/create/column';
import CreateIssue from '~/app/_components/create/issue';
import Header from '~/app/_components/board/header';
import { api } from '~/trpc/react';
import type { RouterOutputs } from '~/trpc/shared';
import SyncingIcon from '../syncingIcon';
import { type DropResult } from '@hello-pangea/dnd';
import { reorderList } from '~/lib/reorder';
import { KANBAN_TITLES } from '~/lib/constant';

interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  url: string;
}

interface Quote {
  id: string;
  content: string;
  author: Author;
}

interface Props<T, Keys extends string = string> {
  project: NonNullable<RouterOutputs['issue']['getProjectByShortCode']>;
  data: Record<Keys, T[]>;
}

const Board = (props: Props<Quote>) => {
  const { project } = props;
  const utils = api.useUtils();
  const _issueStates = api.issue.getIssueStates.useQuery(
    { projectId: project.id },
    { initialData: [] },
  );
  const _issues = api.issue.getGroupedIssuesByProject.useQuery(
    { projectId: project.id },
    { initialData: {} },
  );
  const changeIssueStateOrdinal = api.issue.changeIssueStateOrdinal.useMutation(
    {
      onSuccess: () => {
        void utils.issue.getIssueStates.invalidate({ projectId: project.id });
      },
    },
  );

  const [isPending, startTransition] = useTransition();

  const [selectedType, setSelectedType] = useState<string>(Boards.kanban);
  const [ordered] = useOptimistic(_issues.data);
  const [columns, setColumns] = useOptimistic(
    _issueStates.data,
    (state, pos: Record<'source' | 'destination', number>) => {
      const reordered = reorderList(state, pos.source, pos.destination);

      return reordered;
    },
  );

  function onDragEnd(result: DropResult) {
    startTransition(async () => {
      const { source: s, destination: d } = result;

      // dropped nowhere
      if (!d) return;

      // did not move anywhere - can bail early
      if (s.droppableId === d.droppableId && s.index === d.index) return;

      // reordering column
      if (result.type === KANBAN_TITLES.COLUMNS) {
        const column = columns[s.index];
        if (column) {
          console.log('reordering column', s.index, d.index, column);

          // optimistic update
          setColumns({ source: s.index, destination: d.index });

          // server update
          // if (1 + 1 != 2)
          await changeIssueStateOrdinal.mutateAsync({
            id: column.id,
            ordinal: d.index,
          });
        }
      }
    });
  }

  return (
    <Box w="100%">
      <Stack>
        <Header />
        <Group mb="md" justify="space-between">
          <Group>
            <SegmentedControl
              data={Object.values(Boards)}
              tt="capitalize"
              value={selectedType}
              onChange={setSelectedType}
            />

            <Search />
          </Group>

          <Group>
            <ButtonGroup>
              <CreateIssue projectId={project.id}>
                {({ open }) => (
                  <Button
                    size="sm"
                    variant="outline"
                    leftSection={<IconPlus size={14} />}
                    onClick={open}
                  >
                    Create Issue
                  </Button>
                )}
              </CreateIssue>
              <CreateColumn projectId={project.id}>
                {({ open }) => (
                  <Button
                    size="sm"
                    variant="outline"
                    leftSection={<IconPlus size={14} />}
                    onClick={open}
                  >
                    Create Column
                  </Button>
                )}
              </CreateColumn>
            </ButtonGroup>

            <SyncingIcon loading={isPending} />
          </Group>
        </Group>
      </Stack>

      {selectedType === Boards.kanban && (
        <KanbanBoard data={ordered} columns={columns} onDragEnd={onDragEnd} />
      )}
      {selectedType === Boards.table && <Box mih="100%">Not Setup</Box>}
    </Box>
  );
};

export default Board;
