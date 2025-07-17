import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GeoService } from './geo/geo.service';
import { WeatherService } from './weather/weather.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly geoService: GeoService,
    private readonly weatherService: WeatherService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/geo/load')
  async loadGeoData(@Body() body: { ciso2: string; siso: string }) {
    const status = await this.geoService.getLocationData({
      ciso2: body.ciso2,
      siso: body.siso,
    });
    return status;
  }

  @Get('/location')
  getLocation() {
    return this.appService.getLocationData('Reinickendorf');
  }

  @Get('/weather')
  async getWeatherData() {
    await this.weatherService.getWeatherData({ locationName: 'Reinickendorf' });
    return 1;
  }
}
