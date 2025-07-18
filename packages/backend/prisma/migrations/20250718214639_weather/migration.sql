/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `City` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "DailyWeather" (
    "cityId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "sunrise" TIMESTAMP(3) NOT NULL,
    "sunset" TIMESTAMP(3) NOT NULL,
    "weatherCode" INTEGER NOT NULL,
    "maxTemperature" DOUBLE PRECISION NOT NULL,
    "minTemperature" DOUBLE PRECISION NOT NULL,
    "daylightDuration" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DailyWeather_pkey" PRIMARY KEY ("date","cityId")
);

-- CreateTable
CREATE TABLE "HourlyWeather" (
    "cityId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "weatherCode" INTEGER NOT NULL,
    "apparentTemperature" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HourlyWeather_pkey" PRIMARY KEY ("date","cityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- AddForeignKey
ALTER TABLE "DailyWeather" ADD CONSTRAINT "DailyWeather_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourlyWeather" ADD CONSTRAINT "HourlyWeather_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
