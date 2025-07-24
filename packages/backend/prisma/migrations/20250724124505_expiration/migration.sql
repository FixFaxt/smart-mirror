/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_userId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarEvent" DROP CONSTRAINT "CalendarEvent_calendarId_fkey";

-- DropForeignKey
ALTER TABLE "DailyWeather" DROP CONSTRAINT "DailyWeather_cityId_fkey";

-- DropForeignKey
ALTER TABLE "HourlyWeather" DROP CONSTRAINT "HourlyWeather_cityId_fkey";

-- DropForeignKey
ALTER TABLE "SpotifyAccount" DROP CONSTRAINT "SpotifyAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_todoBoardId_fkey";

-- DropForeignKey
ALTER TABLE "TodoBoard" DROP CONSTRAINT "TodoBoard_userId_fkey";

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiration" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Todo_title_key" ON "Todo"("title");

-- AddForeignKey
ALTER TABLE "DailyWeather" ADD CONSTRAINT "DailyWeather_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourlyWeather" ADD CONSTRAINT "HourlyWeather_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotifyAccount" ADD CONSTRAINT "SpotifyAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_todoBoardId_fkey" FOREIGN KEY ("todoBoardId") REFERENCES "TodoBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoBoard" ADD CONSTRAINT "TodoBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
