import {
  DragDropContext,
  Droppable,
  type OnDragEndResponder,
} from '@hello-pangea/dnd';
import type { Item, CardProps } from '~/app/_components/board/kanban/types';
import Column from '~/app/_components/board/kanban/column';
import { Group, ScrollArea, rem } from '@mantine/core';
import { COLUMN_WIDTH } from '~/lib/constant';

interface BoardProps<T extends Item> {
  data: Record<string, T[]>;
  columns: string[];
  card: (props: CardProps<T>) => JSX.Element;
  onDragEnd: OnDragEndResponder;
}

const KanbanBoard = <T extends Item>(props: BoardProps<T>) => {
  const { data, columns, onDragEnd, card: Card } = props;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {provided => (
          <ScrollArea offsetScrollbars scrollbars="x">
            <Group
              {...provided.droppableProps}
              ref={provided.innerRef}
              miw={rem(COLUMN_WIDTH * columns.length)}
              gap="xs"
              grow
              align="start"
            >
              {columns.map((key, index) => (
                <Column
                  key={key}
                  index={index}
                  title={key}
                  data={data[key] ?? []}
                  card={Card}
                />
              ))}
            </Group>

            {provided.placeholder}
          </ScrollArea>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;
