import {
  DragDropContext,
  Droppable,
  type OnDragEndResponder,
} from '@hello-pangea/dnd';
import Column from '~/app/_components/board/kanban/column';
import { Group, ScrollArea, rem } from '@mantine/core';
import { COLUMN_WIDTH, KANBAN_TITLES } from '~/lib/constant';
import type { Issue, IssueState } from '@prisma/client';

interface BoardProps {
  data: Record<IssueState['id'], Issue[]>;
  columns: IssueState[];
  onDragEnd: OnDragEndResponder;
}

const KanbanBoard = (props: BoardProps) => {
  const { data, columns, onDragEnd } = props;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId={KANBAN_TITLES.BOARD}
        type={KANBAN_TITLES.COLUMNS}
        direction="horizontal"
      >
        {provided => (
          <ScrollArea offsetScrollbars scrollbars="x" h="100%">
            <Group
              {...provided.droppableProps}
              ref={provided.innerRef}
              miw={rem(COLUMN_WIDTH * columns.length)}
              gap="xs"
              grow
              align="start"
              h="100%"
            >
              {columns.map((col, index) => (
                <Column
                  key={col.id}
                  index={index}
                  columnInfo={col}
                  data={data[col.id] ?? []}
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
