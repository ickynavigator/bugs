import { Draggable, Droppable } from '@hello-pangea/dnd';
import {
  ActionIcon,
  ActionIconGroup,
  Box,
  Center,
  Group,
  Paper,
  Stack,
  Title,
  rem,
} from '@mantine/core';
import { memo } from 'react';
import { COLUMN_WIDTH, KANBAN_TITLES } from '~/lib/constant';
import Item from '~/app/_components/board/kanban/item';
import type { Issue, IssueState } from '@prisma/client';
import { IconGripVertical, IconPencil } from '@tabler/icons-react';
import DeleteColumn from '~/app/_components/delete/column';
import EditColumn from '~/app/_components/edit/column';

interface ListProps {
  data: Issue[];
}

const List = (props: ListProps) => {
  const { data } = props;

  return (
    <>
      {data.map((item, index) => (
        <Draggable key={item.id} index={index} draggableId={`${item.id}`}>
          {(provided, snapshot) => (
            <Item issue={item} provided={provided} snapshot={snapshot} />
          )}
        </Draggable>
      ))}
    </>
  );
};

const MemoizedList = memo(List) as typeof List;

interface ColumnProps {
  index: number;
  columnInfo: IssueState;
  data: Issue[];
}

const COLUMN_OFFSET = 50;
const Column = (props: ColumnProps) => {
  const { columnInfo, index, data } = props;

  const id = `${KANBAN_TITLES.COLUMNS}-${columnInfo.id}`;

  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <Paper
          withBorder
          shadow="sm"
          p="sm"
          radius="md"
          miw={rem(COLUMN_WIDTH - COLUMN_OFFSET)}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Droppable droppableId={id} type={KANBAN_TITLES.ISSUES}>
            {dropProvided => (
              <Box
                {...dropProvided.droppableProps}
                ref={dropProvided.innerRef}
                h="100%"
              >
                <Group pb="xs" justify="space-between">
                  <Group>
                    <Center {...provided.dragHandleProps}>
                      <IconGripVertical
                        style={{ width: rem(18), height: rem(18) }}
                        stroke={1.5}
                      />
                    </Center>
                    <Title order={3} c={columnInfo.color}>
                      {columnInfo.name}
                    </Title>
                  </Group>

                  <ActionIconGroup>
                    <EditColumn initialData={columnInfo}>
                      {({ open }) => (
                        <ActionIcon variant="outline" onClick={open}>
                          <IconPencil
                            style={{ width: rem(16), height: rem(16) }}
                            stroke={1.5}
                          />
                        </ActionIcon>
                      )}
                    </EditColumn>
                    <DeleteColumn id={columnInfo.id} />
                  </ActionIconGroup>
                </Group>

                <Stack gap="xs">
                  <MemoizedList data={data} />
                </Stack>

                {dropProvided.placeholder}
              </Box>
            )}
          </Droppable>
        </Paper>
      )}
    </Draggable>
  );
};

export default Column;
