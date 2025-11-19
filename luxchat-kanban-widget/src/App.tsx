import React from "react";
import { useMatrixFiles } from "./hooks/useMatrixFiles";
import { useKanbanBoard } from "./hooks/useKanbanBoard";
import { useCalendar } from "./hooks/useCalendar";
import TopBar from "./components/layout/TopBar";
import SplitPane from "./components/layout/SplitPane";
import FolderTree from "./components/filesystem/FolderTree";
import Board from "./components/kanban/Board";
import CalendarView from "./components/calendar/CalendarView";
import Loader from "./components/common/Loader";
import ErrorBanner from "./components/common/ErrorBanner";

const App: React.FC = () => {
  const { filesClient, rootFolder, loading, error } = useMatrixFiles();
  const kanban = useKanbanBoard(filesClient, rootFolder);
  const calendar = useCalendar(filesClient, rootFolder);

  if (loading) return <Loader />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="app-root">
      <TopBar />
      <SplitPane
        left={<FolderTree rootFolder={rootFolder} />}
        center={
          <Board
            board={kanban.board}
            onMoveCard={kanban.moveCard}
            onAddCard={kanban.addCard}
            onUpdateCard={kanban.updateCard}
          />
        }
        right={
          <CalendarView
            events={calendar.events}
            onCreateEvent={calendar.createEvent}
            onUpdateEvent={calendar.updateEvent}
            onDeleteEvent={calendar.deleteEvent}
          />
        }
      />
    </div>
  );
};

export default App;
