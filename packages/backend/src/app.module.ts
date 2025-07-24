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
import { CalendarService } from './calendar/calendar.service';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarModule } from './calendar/calendar.module';
import { TodoService } from './todo/todo.service';
import { TodoController } from './todo/todo.controller';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    PrismaModule,
    GeoModule,
    WeatherModule,
    ScheduleModule.forRoot(),
    CalendarModule,
    TodoModule,
  ],
  controllers: [AppController, CalendarController, TodoController],
  providers: [
    AppService,
    GeoService,
    PrismaService,
    WeatherService,
    CalendarService,
    TodoService,
  ],
})
export class AppModule {}
