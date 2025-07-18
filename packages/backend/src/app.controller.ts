import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GeoService } from './geo/geo.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly geoService: GeoService,
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

  @Get('/location/:name')
  getLocation(@Param('name') name: string) {
    return this.appService.getLocationData(name);
  }
}
