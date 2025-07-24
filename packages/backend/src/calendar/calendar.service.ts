/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}
  // Calendar
  async createCalendar() {}
  async getCalendarsForUser(userId: number) {}
  async getCalendarByName(name: string) {}
  async updateCalendar() {}
  async deleteCalendar() {}

  // Event
  async createCalendarEvent() {}
  async getCalendarEventsForUser(userId: number) {}
  async getCalendarEventByTitle(title: string) {}
  async addTodoToCalendarEvent() {}
  async updateCalendarEvent() {}
  async deleteCalendarEvent() {}
}
