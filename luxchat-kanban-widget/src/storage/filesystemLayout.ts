export const ROOT_FOLDER_NAME = "LuxChat Kanban";
export const BOARDS_FOLDER_NAME = "boards";
export const CARDS_FOLDER_NAME = "cards";
export const CALENDAR_FOLDER_NAME = "calendar";

export function boardPath(boardId: string) {
  return [ROOT_FOLDER_NAME, BOARDS_FOLDER_NAME, boardId];
}

export function boardConfigPath(boardId: string) {
  return [...boardPath(boardId), "board.json"];
}

export function cardFilePath(boardId: string, cardId: string) {
  return [...boardPath(boardId), CARDS_FOLDER_NAME, `${cardId}.json`];
}

export function eventFilePath(boardId: string, eventId: string) {
  return [...boardPath(boardId), CALENDAR_FOLDER_NAME, `${eventId}.json`];
}
