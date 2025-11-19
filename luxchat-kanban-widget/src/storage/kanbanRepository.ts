import { MatrixFiles, IFolder, IFile } from "matrix-files-sdk";
import { KanbanBoard, KanbanCard, KanbanColumn } from "../types/kanban";
import {
  boardConfigPath,
  cardFilePath,
  CARDS_FOLDER_NAME
} from "./filesystemLayout";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

export class KanbanRepository {
  constructor(private files: MatrixFiles, private root: IFolder) {}

  private async ensureFolder(path: string[]): Promise<IFolder> {
    const entry = await this.files.resolvePath(path);
    if (entry && entry.isFolder) return entry as IFolder;

    let current = await this.files.getRoot();
    for (const segment of path) {
      const existing = (await current.getChildren()).find(
        (e) => e.isFolder && e.name === segment
      );
      if (existing && existing.isFolder) {
        current = existing as IFolder;
      } else {
        const id = await this.files.addFolder(segment, current);
        current = (await this.files.getDescendantById(id)) as IFolder;
      }
    }
    return current;
  }

  async loadBoard(boardId: string): Promise<KanbanBoard> {
    const configEntry = await this.files.resolvePath(boardConfigPath(boardId));
    let columns: KanbanColumn[] = [];
    let name = "Board";

    if (configEntry && !configEntry.isFolder) {
      const file = (await configEntry.getFileContents()) as Uint8Array;
      const json = JSON.parse(new TextDecoder().decode(file));
      name = json.name;
      columns = json.columns ?? [];
    } else {
      // default columns
      columns = [
        { id: "todo", name: "To Do", order: 0 },
        { id: "in-progress", name: "In Progress", order: 1 },
        { id: "done", name: "Done", order: 2 }
      ];
      await this.saveBoardConfig(boardId, name, columns);
    }

    const cardsFolder = await this.ensureFolder([
      ...boardConfigPath(boardId).slice(0, -1),
      CARDS_FOLDER_NAME
    ]);

    const cards: KanbanCard[] = [];
    const children = await cardsFolder.getChildren();

    for (const entry of children) {
      if (!entry.isFolder && entry.name.endsWith(".json")) {
        const raw = await (entry as IFile).getFileContents();
        const json = JSON.parse(new TextDecoder().decode(raw));
        cards.push(json);
      }
    }

    return { id: boardId, name, columns, cards };
  }

  async saveBoardConfig(
    boardId: string,
    name: string,
    columns: KanbanColumn[]
  ) {
    const path = boardConfigPath(boardId);
    const folder = await this.ensureFolder(path.slice(0, -1));
    const payload = JSON.stringify({ name, columns }, null, 2);
    await this.files.addFile(path[path.length - 1], folder, payload);
  }

  async addCard(
    boardId: string,
    columnId: string,
    title: string,
    description?: string
  ): Promise<KanbanCard> {
    const now = dayjs().toISOString();
    const card: KanbanCard = {
      id: uuid(),
      title,
      description,
      columnId,
      createdAt: now,
      updatedAt: now
    };

    const path = cardFilePath(boardId, card.id);
    const folder = await this.ensureFolder(path.slice(0, -1));
    await this.files.addFile(
      path[path.length - 1],
      folder,
      JSON.stringify(card, null, 2)
    );

    return card;
  }

  async updateCard(boardId: string, card: KanbanCard): Promise<void> {
    card.updatedAt = dayjs().toISOString();
    const path = cardFilePath(boardId, card.id);
    const entry = await this.files.resolvePath(path);
    if (!entry || entry.isFolder) throw new Error("Card file not found");
    await (entry as IFile).setFileContents(
      new TextEncoder().encode(JSON.stringify(card, null, 2))
    );
  }
}
