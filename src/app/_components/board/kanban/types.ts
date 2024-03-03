import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '@hello-pangea/dnd';

export interface Item {
  id: string;
}

export interface CardProps<T extends Item> {
  item: T;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

export interface ColumnProps<T extends Item> {
  title: string;
  index: number;
  data: T[];
  card: (props: CardProps<T>) => JSX.Element;
}
