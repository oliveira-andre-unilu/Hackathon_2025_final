import { useEffect, useState } from "react";
import { MatrixFiles, IFolder } from "matrix-files-sdk";
import { KanbanBoard, KanbanCard } from "../types/kanban";
import { KanbanRepository } from "../storage/kanbanRepository";

const DEFAULT_BOARD_ID = "default-board";

export function useKanbanBoard(files: MatrixFiles | null, root: IFolder | null) {
  const [board, setBoard] = useState<KanbanBoard | null>(null);

  useEffect(() => {
    if (!files || !root) return;
    const repo = new KanbanRepository(files, root);
    repo.loadBoard(DEFAULT_BOARD_ID).then(setBoard).catch(console.error);
  }, [files, root]);

  const moveCard = (cardId: string, columnId: string) => {
    if (!board || !files || !root) return;
    const repo = new KanbanRepository(files, root);
    const card = board.cards.find((c) => c.id === cardId);
    if (!card) return;
    const updated: KanbanCard = { ...card, columnId };
    repo.updateCard(board.id, updated).then(() => {
      setBoard({
        ...board,
        cards: board.cards.map((c) => (c.id === cardId ? updated : c))
      });
    });
  };

  const addCard = (columnId: string, title: string, description?: string) => {
    if (!board || !files || !root) return;
    const repo = new KanbanRepository(files, root);
    repo
      .addCard(board.id, columnId, title, description)
      .then((newCard) =>
        setBoard({ ...board, cards: [...board.cards, newCard] })
      );
  };

  const updateCard = (card: KanbanCard) => {
    if (!board || !files || !root) return;
    const repo = new KanbanRepository(files, root);
    repo.updateCard(board.id, card).then(() => {
      setBoard({
        ...board,
        cards: board.cards.map((c) => (c.id === card.id ? card : c))
      });
    });
  };

  return { board, moveCard, addCard, updateCard };
}
