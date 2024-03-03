import { Draggable, Droppable } from '@hello-pangea/dnd';
import type { ColumnProps, Item } from '~/app/_components/board/kanban/types';
import { Box, Paper, Stack, Title } from '@mantine/core';

const Column = <T extends Item>(props: ColumnProps<T>) => {
  const { title, index, data, card: Card } = props;

  return (
    <Draggable draggableId={title} index={index}>
      {provided => (
        <Paper
          withBorder
          shadow="sm"
          p="sm"
          radius="md"
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
                  {data.map((item, index) => (
                    <Draggable
                      key={item.id}
                      index={index}
                      draggableId={item.id}
                    >
                      {(provided, snapshot) => (
                        <Card
                          item={item}
                          provided={provided}
                          snapshot={snapshot}
                        />
                      )}
                    </Draggable>
                  ))}
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
