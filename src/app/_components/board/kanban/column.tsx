import { Draggable, Droppable } from '@hello-pangea/dnd';
import type {
  ColumnProps,
  Item,
  ListProps,
} from '~/app/_components/board/kanban/types';
import { Box, Paper, Stack, Title, rem } from '@mantine/core';
import { memo } from 'react';
import { COLUMN_WIDTH } from '~/lib/constant';

const List = <T extends Item>(props: ListProps<T>) => {
  const { data, card: Card } = props;

  return (
    <>
      {data.map((item, index) => (
        <Draggable key={item.id} index={index} draggableId={item.id}>
          {(provided, snapshot) => (
            <Card item={item} provided={provided} snapshot={snapshot} />
          )}
        </Draggable>
      ))}
    </>
  );
};

const MemoizedList = memo(List) as typeof List;

const COLUMN_OFFSET = 50;
const Column = <T extends Item>(props: ColumnProps<T>) => {
  const { title, index, data, card } = props;

  return (
    <Draggable draggableId={title} index={index}>
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
          <Box pb="xs" {...provided.dragHandleProps}>
            <Title order={3}>{title}</Title>
          </Box>

          <Droppable droppableId={title} type="QUOTE">
            {dropProvided => (
              <>
                <Stack
                  {...dropProvided.droppableProps}
                  ref={dropProvided.innerRef}
                  gap="xs"
                >
                  <MemoizedList data={data} card={card} />
                </Stack>

                {dropProvided.placeholder}
              </>
            )}
          </Droppable>
        </Paper>
      )}
    </Draggable>
  );
};

export default Column;
