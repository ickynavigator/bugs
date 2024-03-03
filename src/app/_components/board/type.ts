export const Boards = {
  kanban: 'kanban',
  table: 'table',
} as const;

export type BoardType = typeof Boards;
export type BoardTypes = (typeof Boards)[keyof typeof Boards];
