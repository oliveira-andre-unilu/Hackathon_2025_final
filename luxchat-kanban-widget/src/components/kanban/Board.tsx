import React from "react";
import { KanbanBoard, KanbanCard } from "../../types/kanban";
import Column from "./Column";
import NewCardForm from "./NewCardForm";

interface Props {
  board: KanbanBoard | null;
  onMoveCard: (cardId: string, columnId: string) => void;
  onAddCard: (columnId: string, title: string, description?: string) => void;
  onUpdateCard: (card: KanbanCard) => void;
}

const Board: React.FC<Props> = ({
  board,
  onMoveCard,
  onAddCard,
  onUpdateCard
}) => {
  if (!board) return <div>Loading board…</div>;

  return (
    <div className="kanban-board">
      {board.columns
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((column) => (
          <div key={column.id} className="kanban-column-wrapper">
            <Column
              column={column}
              cards={board.cards.filter((c) => c.columnId === column.id)}
              onMoveCard={onMoveCard}
              onUpdateCard={onUpdateCard}
            />
            <NewCardForm
              onSubmit={(title, desc) => onAddCard(column.id, title, desc)}
            />
          </div>
        ))}
    </div>
  );
};

export default Board;
