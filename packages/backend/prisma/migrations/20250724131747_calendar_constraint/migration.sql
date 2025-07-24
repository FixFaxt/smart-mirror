/*
  Warnings:

  - You are about to drop the column `calendarEventId` on the `Todo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `CalendarEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_calendarEventId_fkey";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "calendarEventId",
ADD COLUMN     "calendarEventTitle" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CalendarEvent_title_key" ON "CalendarEvent"("title");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_calendarEventTitle_fkey" FOREIGN KEY ("calendarEventTitle") REFERENCES "CalendarEvent"("title") ON DELETE CASCADE ON UPDATE CASCADE;
