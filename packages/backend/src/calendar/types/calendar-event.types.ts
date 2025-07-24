import { Todo } from 'src/todo/types/todo.types';

/**
 * Represents a calendar event.
 */
export interface CalendarEvent {
  /** Unique identifier for the calendar event */
  id: number;
  /** Title of the calendar event */
  title: string;
  /** Description of the calendar event (optional) */
  description?: string;
  /** Start date and time of the calendar event */
  start: Date;
  /** End date and time of the calendar event */
  end: Date;
  /** Indicates if the event lasts all day */
  allDay: boolean;
  /** Identifier of the user associated with the event */
  userId: number;
  /** Identifier of the calendar (optional) */
  calendarId?: number;
  /** List of todos associated with the calendar event */
  todos: Todo[];
}

/**
 * Parameters required to create a new calendar event.
 */
export interface CreateCalendarEventParams {
  /** Title of the new calendar event */
  title: string;
  /** Description of the new calendar event (optional) */
  description?: string;
  /** Start date and time of the new calendar event */
  start: Date;
  /** End date and time of the new calendar event */
  end: Date;
  /** Indicates if the new event lasts all day */
  allDay: boolean;
}

/**
 * Parameters required to update an existing calendar event.
 */
export interface UpdateCalendarEventParams {
  /** Current title of the calendar event */
  title: string;
  /** New title for the calendar event (optional) */
  newTitle?: string;
  /** Updated description of the calendar event (optional) */
  description?: string;
  /** Updated start date and time of the calendar event (optional) */
  start?: Date;
  /** Updated end date and time of the calendar event (optional) */
  end?: Date;
  /** Indicates if the updated event lasts all day (optional) */
  allDay?: boolean;
  /** Updated identifier of the calendar (optional) */
  calendarId?: number;
}

/**
 * Represents a calendar event along with associated todo information.
 */
export interface CalendarEventWithTodos {
  /** Title of the calendar event */
  title: string;
  /** Title of the associated todo */
  todoTitle: string;
}
