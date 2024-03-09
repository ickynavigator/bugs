'use client';

import { useState } from 'react';
import KanbanBoard from '~/app/_components/board/kanban/board';
import { Item } from '~/app/_components/board/kanbanCard';
import { Boards } from '~/app/_components/board/type';
import {
  Group,
  Text,
  Box,
  Button,
  SegmentedControl,
  Stack,
  ButtonGroup,
} from '@mantine/core';
import { reorderKanban } from '~/lib/reorder';
import { IconPlus } from '@tabler/icons-react';
import Search from './search';
import CreateColumn from '~/app/_components/create/column';
import CreateIssue from '~/app/_components/create/issue';
import Header from '~/app/_components/board/header';

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
  data: Record<Keys, T[]>;
}

const Board = (props: Props<Quote>) => {
  const { data } = props;

  const [selectedType, setSelectedType] = useState<string>(Boards.kanban);

  const [columns, setColumns] = useState(data);
  const [ordered, setOrdered] = useState(Object.keys(data));

  return (
    <Box>
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

          <ButtonGroup>
            <CreateIssue>
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
            <CreateColumn>
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
        </Group>
      </Stack>

      {selectedType === Boards.kanban && (
        <KanbanBoard
          data={columns}
          columns={ordered}
          card={Item}
          onDragEnd={reorderKanban({
            ordered,
            setOrdered,
            columns,
            setColumns,
          })}
        />
      )}

      {selectedType === Boards.table && <Text>Not Setup</Text>}
    </Box>
  );
};

export default Board;
