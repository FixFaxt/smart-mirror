import { Injectable } from '@nestjs/common';
import { fetchWeatherApi } from 'openmeteo';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WeatherService {
  constructor(private readonly prisma: PrismaService) {}

  async getWeatherData({ locationName }: { locationName: string }) {
    const locations = await this.prisma.city.findMany({
      where: { name: locationName },
    });

    const params = {
      latitude: locations[0].latitude,
      longitude: locations[0].longitude,
      daily: ['sunrise', 'sunset'],
      hourly: 'temperature_2m',
      models: 'icon_seamless',
      timezone: 'auto',
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

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
      },
    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
      console.log(
        weatherData.hourly.time[i].toISOString(),
        Number(weatherData.hourly.temperature2m[i].toFixed(2)),
      );
    }
    for (let i = 0; i < weatherData.daily.time.length; i++) {
      console.log(
        weatherData.daily.time[i].toISOString(),
        weatherData.daily.sunrise[i].toISOString(),
        weatherData.daily.sunset[i].toISOString(),
        timezone,
        timezoneAbbreviation,
        longitude,
        latitude,
      );
    }
  }
}
