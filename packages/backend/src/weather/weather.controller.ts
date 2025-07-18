import { Controller, Get, Param, Post } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/:name')
  async getWeatherData(@Param('name') name: string) {
    const data = await this.weatherService.getWeatherData({
      locationName: name,
    });
    return data;
  }

  @Post('/:name/refresh')
  async updateWeatherData(@Param('name') name: string) {
    const data = await this.weatherService.updateWeatherData({
      locationName: name,
    });
    return data;
  }
}
