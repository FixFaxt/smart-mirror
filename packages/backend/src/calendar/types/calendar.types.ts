import { CalendarEvent } from './calendar-event.types';

/**
 * Represents a calendar with its properties.
 */
export interface Calendar {
  /** Unique identifier for the calendar */
  id: number;

  /** Name of the calendar */
  name: string;

  /** Optional description of the calendar */
  description?: string;

  /** Color associated with the calendar */
  color: string;

  /** Identifier of the user who owns the calendar */
  userId: number;

  /** Optional list of events associated with the calendar */
  events?: CalendarEvent[];
}

/**
 * Parameters required to create a new calendar.
 */
export interface CreateCalendarParams {
  /** Name of the new calendar */
  name: string;

  /** Optional description for the new calendar */
  description?: string;

  /** Color for the new calendar */
  color: string;

  /** Identifier of the user creating the calendar */
  userId: number;
}

/**
 * Parameters required to update an existing calendar.
 */
export interface UpdateCalendarParams {
  /** Current name of the calendar */
  name: string;

  /** Optional new name for the calendar */
  newName?: string;

  /** Optional description for the calendar */
  description?: string;

  /** Optional new color for the calendar */
  color?: string;
}
