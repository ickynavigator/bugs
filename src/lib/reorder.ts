import type { DraggableLocation, DropResult } from '@hello-pangea/dnd';

export function reorderList<TItem>(
  list: TItem[],
  startIndex: number,
  endIndex: number,
): TItem[] {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  if (removed) result.splice(endIndex, 0, removed);

  return result;
}

export function reorderMap<TItem>(
  itemMap: Record<number | string, TItem[]>,
  source: DraggableLocation,
  destination: DraggableLocation,
) {
  const current = [...(itemMap[source.droppableId] ?? [])];
  const next = [...(itemMap[destination.droppableId] ?? [])];
  const target = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorderList(current, source.index, destination.index);
    const result = {
      ...itemMap,
      [source.droppableId]: reordered,
    };
    return result;
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  if (target) next.splice(destination.index, 0, target);

  const result = {
    ...itemMap,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return result;
}

interface ReorderKanban<TItem, TKey extends string = string> {
  ordered: TKey[];
  setOrdered: (ordered: TKey[]) => void;

  columns: Record<TKey, TItem[]>;
  setColumns: (columns: Record<TKey, TItem[]>) => void;
}
export function reorderKanban<T>(args: ReorderKanban<T>) {
  return (result: DropResult) => {
    const { ordered, columns, setOrdered, setColumns } = args;

    if (result.combine) {
      if (result.type === 'COLUMN') {
        const shallow: string[] = [...ordered];
        shallow.splice(result.source.index, 1);
        setOrdered(shallow);
        return;
      }

      const column = columns[result.source.droppableId] ?? [];
      const withQuoteRemoved = [...column];
      withQuoteRemoved.splice(result.source.index, 1);
      setColumns({
        ...columns,
        [result.source.droppableId]: withQuoteRemoved,
      });
      return;
    }

    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // reordering column
    if (result.type === 'COLUMN') {
      setOrdered(reorderList(ordered, source.index, destination.index));
      return;
    }

    setColumns(reorderMap(columns, source, destination));
  };
}
