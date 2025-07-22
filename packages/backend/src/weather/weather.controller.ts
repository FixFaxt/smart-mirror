import { Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/:name/:type')
  async getWeatherDataForCity(
    @Param('name') name: string,
    @Param('type') type: 'daily' | 'hourly',
  ) {
    if (type !== 'daily' && type !== 'hourly') {
      throw new HttpException('Invalid type parameter', 400);
    }
    return this.weatherService.getWeatherDataForCity(name, type);
  }

  @Post('/:name/refresh')
  async updateWeatherData(@Param('name') name: string) {
    const data = await this.weatherService.updateWeatherData({
      locationName: name,
    });
    return data;
  }
}
