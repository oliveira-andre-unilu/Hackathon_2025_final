export type ColumnId = string;
export type CardId = string;
export type EventId = string;

export interface KanbanCard {
  id: CardId;
  title: string;
  description?: string;
  columnId: ColumnId;
  labels?: string[];
  dueDate?: string; // ISO date
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: ColumnId;
  name: string;
  order: number;
}

export interface KanbanBoard {
  id: string;
  name: string;
  columns: KanbanColumn[];
  cards: KanbanCard[];
}

export interface CalendarEvent {
  id: EventId;
  title: string;
  start: string; // ISO
  end?: string;  // ISO
  cardId?: CardId; // link to task
}
