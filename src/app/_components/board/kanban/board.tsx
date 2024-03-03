import {
  DragDropContext,
  Droppable,
  type OnDragEndResponder,
} from '@hello-pangea/dnd';
import type { Item, CardProps } from '~/app/_components/board/kanban/types';
import Column from '~/app/_components/board/kanban/column';
import { Group } from '@mantine/core';

interface BoardProps<T extends Item> {
  data: Record<string, T[]>;
  card: (props: CardProps<T>) => JSX.Element;
  onDragEnd: OnDragEndResponder;
}

const KanbanBoard = <T extends Item>(props: BoardProps<T>) => {
  const { data, onDragEnd, card: Card } = props;

  const columns = Object.keys(data);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {provided => (
          <>
            <Group
              grow
              align="start"
              {...provided.droppableProps}
              ref={provided.innerRef}
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
          </>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;