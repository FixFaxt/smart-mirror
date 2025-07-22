/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DailyWeather, HourlyWeather } from '@prisma/client';
import { fetchWeatherApi } from 'openmeteo';
import { PrismaService } from 'src/prisma/prisma.service';

interface WeatherApiParams {
  locationName: string;
}

export interface WeatherData {
  hourly: {
    time: Date[];
    temperature2m: number[];
    weatherCode: number[];
    apparentTemperature: number[];
  };
  daily: {
    time: Date[];
    sunrise: Date[];
    sunset: Date[];
    weatherCode: number[];
    temperature2mMax: number[];
    temperature2mMin: number[];
    daylightDuration: number[];
  };
  cityId: number;
}

export interface DailyWeatherData {
  time: Date[];
  sunrise: Date[];
  sunset: Date[];
  weatherCode: number[];
  temperature2mMax: number[];
  temperature2mMin: number[];
  daylightDuration: number[];
}

export interface HourlyWeatherData {
  time: Date[];
  temperature2m: number[];
  weatherCode: number[];
  apparentTemperature: number[];
}

@Injectable()
export class WeatherService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(WeatherService.name);

  async getWeatherData({ locationName }: WeatherApiParams) {
    const location = await this.prisma.city.findUnique({
      where: { name: locationName },
    });
    if (!location) {
      this.logger.error(`Location ${locationName} not found in database.`);
      throw new Error(`Location ${locationName} not found.`);
    }

    const params = {
      latitude: location.latitude,
      longitude: location.longitude,
      daily: [
        'sunrise',
        'sunset',
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'daylight_duration',
      ],
      hourly: ['temperature_2m', 'weather_code', 'apparent_temperature'],
      models: 'icon_seamless',
      timezone: 'auto',
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    // const timezone = response.timezone();
    // const timezoneAbbreviation = response.timezoneAbbreviation();
    // const latitude = response.latitude();
    // const longitude = response.longitude();

    const hourly = response.hourly()!;
    const daily = response.daily()!;

    const sunrise = daily.variables(0)!;
    const sunset = daily.variables(1)!;

    // Note: The order of weather variables in the URL query and the indices below need to match!

    const weatherData = {
      hourly: {
        time: [
          ...Array(
            (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval(),
          ),
        ].map(
          (_, i) =>
            new Date(
              (Number(hourly.time()) +
                i * hourly.interval() +
                utcOffsetSeconds) *
                1000,
            ),
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        weatherCode: hourly.variables(1)!.valuesArray()!,
        apparentTemperature: hourly.variables(2)!.valuesArray()!,
      },
      daily: {
        time: [
          ...Array(
            (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval(),
          ),
        ].map(
          (_, i) =>
            new Date(
              (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
                1000,
            ),
        ),
        sunrise: [...Array(sunrise.valuesInt64Length())].map(
          (_, i) =>
            new Date(
              (Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000,
            ),
        ),
        sunset: [...Array(sunset.valuesInt64Length())].map(
          (_, i) =>
            new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000),
        ),
        weatherCode: daily.variables(2)!.valuesArray()!,
        temperature2mMax: daily.variables(3)!.valuesArray()!,
        temperature2mMin: daily.variables(4)!.valuesArray()!,
        daylightDuration: daily.variables(5)!.valuesArray()!,
      },
    };

    return { ...weatherData, cityId: location.id } as unknown as WeatherData;
  }

  async updateDailyWeatherData(weatherData: WeatherData): Promise<void> {
    for (let i = 0; i < weatherData.daily.time.length; i++) {
      const entry: DailyWeatherData = weatherData.daily;

      await this.prisma.dailyWeather.upsert({
        where: {
          date_cityId: {
            date: new Date(entry.time[i]),
            cityId: weatherData.cityId,
          },
        },
        update: {
          maxTemperature: entry.temperature2mMax[i],
          minTemperature: entry.temperature2mMin[i],
          weatherCode: entry.weatherCode[i],
        },
        create: {
          cityId: weatherData.cityId,
          date: new Date(entry.time[i]),
          maxTemperature: entry.temperature2mMax[i],
          minTemperature: entry.temperature2mMin[i],
          weatherCode: entry.weatherCode[i],
          sunrise: new Date(entry.sunrise[i]),
          sunset: new Date(entry.sunset[i]),
          daylightDuration: entry.daylightDuration[i],
        },
      });
    }
  }

  async getWeatherDataForCity(
    name: string,
    type: 'hourly' | 'daily',
  ): Promise<DailyWeather[] | HourlyWeather[] | null> {
    switch (type) {
      case 'hourly': {
        return (await this.prisma.hourlyWeather.findMany({
          where: { city: { name } },
        })) as HourlyWeather[];
      }
      case 'daily': {
        return (await this.prisma.dailyWeather.findMany({
          where: { city: { name } },
        })) as DailyWeather[];
      }

      default:
        return null;
    }
  }

  async updateHourlyWeatherData(weatherData: WeatherData): Promise<void> {
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
      const entry: HourlyWeatherData = weatherData.hourly;

      await this.prisma.hourlyWeather.upsert({
        where: {
          date_cityId: {
            date: new Date(entry.time[i]),
            cityId: weatherData.cityId,
          },
        },
        update: {
          temperature: entry.temperature2m[i],
          apparentTemperature: entry.apparentTemperature[i],
          weatherCode: entry.weatherCode[i],
        },
        create: {
          cityId: weatherData.cityId,
          date: new Date(entry.time[i]),
          temperature: entry.temperature2m[i],
          weatherCode: entry.weatherCode[i],
          apparentTemperature: entry.apparentTemperature[i],
        },
      });
    }
  }

  async updateWeatherData({ locationName }: WeatherApiParams) {
    this.logger.log(`Updating weather data for ${locationName}`);

    // Get midnight time for the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to midnight

    // Deleting old weather data
    await this.prisma.dailyWeather.deleteMany({
      where: { date: { lt: currentDate } },
    });
    await this.prisma.hourlyWeather.deleteMany({
      where: { date: { lt: currentDate } },
    });
    this.logger.debug(
      `Deleted old weather data before ${currentDate.toISOString()}`,
    );

    // Fetching new weather data
    const weatherData = await this.getWeatherData({ locationName });

    // Updating weather data
    await this.updateDailyWeatherData(weatherData);
    await this.updateHourlyWeatherData(weatherData);

    this.logger.log(`Weather data for ${locationName} updated successfully.`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduleWeatherUpdate() {
    const cities = await this.prisma.city.findMany({
      where: { stateCode: 'BE' },
    });

    this.logger.debug(
      `Scheduling weather updates for ${cities.length} cities in state BE.`,
    );

    for (const city of cities) {
      try {
        await this.updateWeatherData({ locationName: city.name });
        this.logger.log(`Scheduled weather update for ${city.name}`);
      } catch (error) {
        this.logger.error(
          `Failed to update weather data for ${city.name}:`,
          error,
        );
      }
    }
  }
}
