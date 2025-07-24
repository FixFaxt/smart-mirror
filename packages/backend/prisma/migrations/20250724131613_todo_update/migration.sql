/*
  Warnings:

  - You are about to drop the column `todoId` on the `CalendarEvent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CalendarEvent" DROP CONSTRAINT "CalendarEvent_todoId_fkey";

-- AlterTable
ALTER TABLE "CalendarEvent" DROP COLUMN "todoId";

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "calendarEventId" INTEGER;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_calendarEventId_fkey" FOREIGN KEY ("calendarEventId") REFERENCES "CalendarEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
