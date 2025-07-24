/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Calendar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `TodoBoard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Calendar_name_key" ON "Calendar"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TodoBoard_title_key" ON "TodoBoard"("title");
