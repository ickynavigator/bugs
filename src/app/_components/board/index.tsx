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
import { KANBAN_TITLES } from '~/lib/constant';
import { reorderList, reorderMap } from '~/lib/reorder';

interface Props {
  project: NonNullable<RouterOutputs['issue']['getProjectByShortCode']>;
}

const Board = (props: Props) => {
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

  const [selectedType, setSelectedType] = useState<string>(Boards.kanban);

  const [isPending, startTransition] = useTransition();

  const [ordered, setOrdered] = useOptimistic(_issues.data);
  const [columns, setColumns] = useOptimistic(_issueStates.data);

  const onDragEnd = async (result: DropResult) => {
    // TODO: handle combine?
    if (result.combine) return;

    const { source: s, destination: d } = result;

    // dropped nowhere
    if (!d) return;

    // did not move anywhere - can bail early
    if (s.droppableId === d.droppableId && s.index === d.index) return;

    switch (result.type) {
      case KANBAN_TITLES.COLUMNS: {
        const column = columns[s.index];
        if (column) {
          setColumns(prev => reorderList(prev, s.index, d.index));

          await changeIssueStateOrdinal.mutateAsync({
            pid: project.id,
            sid: column.id,
            ordinal: d.index,
          });
        }

        break;
      }
      case KANBAN_TITLES.ISSUES: {
        setOrdered(prev => reorderMap(prev, s, d));
        console.log('reorder issues', reorderMap(ordered, s, d));

        break;
      }
      default: {
        console.error('Unknown type', result.type);
      }
    }
  };

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
        <KanbanBoard
          data={ordered}
          columns={columns}
          onDragEnd={res => startTransition(async () => await onDragEnd(res))}
        />
      )}
      {selectedType === Boards.table && <Box mih="100%">Not Setup</Box>}
    </Box>
  );
};

export default Board;
