/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getLocationData(locationName: string) {
    const locations = await this.prisma.city.findMany({
      where: { name: locationName },
    });

    return locations;
  }
}
