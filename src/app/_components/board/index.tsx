'use client';

import { useState } from 'react';
import KanbanBoard from '~/app/_components/board/kanban/board';
import { Item } from '~/app/_components/board/kanbanCard';
import { Boards, type BoardTypes } from '~/app/_components/board/type';
import { ChipGroup, Group, Chip, Paper, Text, Box } from '@mantine/core';

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

  return (
    <Box p="xl">
      <Paper withBorder w="fit-content" px="xs" py="xs" mb="md">
        <ChipGroup
          multiple={false}
          value={selectedType}
          onChange={setSelectedType}
        >
          <Group justify="center">
            {(Object.keys(Boards) as BoardTypes[]).map(key => (
              <Chip key={key} value={key} tt="capitalize">
                {Boards[key]}
              </Chip>
            ))}
          </Group>
        </ChipGroup>
      </Paper>

      {selectedType === Boards.kanban && (
        <KanbanBoard
          data={data}
          card={Item}
          onDragEnd={() => {
            console.log('onDragEnd');
          }}
        />
      )}

      {selectedType === Boards.table && <Text>Not Setup</Text>}
    </Box>
  );
};

export default Board;
