import React from "react";
import dayjs from "dayjs";
import { CalendarEvent } from "../../types/kanban";
import EventForm from "./EventForm";

interface Props {
  events: CalendarEvent[];
  onCreateEvent: (event: Omit<CalendarEvent, "id">) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

const CalendarView: React.FC<Props> = ({
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const sorted = [...events].sort((a, b) =>
    a.start.localeCompare(b.start)
  );

  return (
    <div className="calendar-view">
      <h2>Calendar</h2>
      <EventForm onSubmit={onCreateEvent} />
      <ul>
        {sorted.map((ev) => (
          <li key={ev.id} className="calendar-event">
            <div className="title">{ev.title}</div>
            <div className="time">
              {dayjs(ev.start).format("YYYY-MM-DD HH:mm")}
              {ev.end ? ` → ${dayjs(ev.end).format("YYYY-MM-DD HH:mm")}` : ""}
            </div>
            <button onClick={() => onDeleteEvent(ev.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarView;
