import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GeoService } from './geo/geo.service';
import { GeoModule } from './geo/geo.module';
import { PrismaService } from './prisma/prisma.service';
import { WeatherService } from './weather/weather.service';
import { WeatherModule } from './weather/weather.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, GeoModule, WeatherModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, GeoService, PrismaService, WeatherService],
})
export class AppModule {}
