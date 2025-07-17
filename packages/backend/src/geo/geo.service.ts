import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeoService {
  constructor(private prisma: PrismaService) {}

  async saveCities(apiData: any): Promise<void> {
    const cities = apiData?.cities?.edges ?? [];

    for (const edge of cities) {
      const city = edge.node;

      await this.prisma.city.upsert({
        where: { id: city.id },
        update: {},
        create: {
          id: city.id,
          name: city.name,
          stateCode: city.state_code,
          countryCode: city.country_code,
          latitude: city.latitude,
          longitude: city.longitude,
        },
      });
    }
  }

  async getLocationData({
    ciso2,
    siso,
  }: {
    ciso2: string;
    siso: string;
  }): Promise<{ status: number; body: string }> {
    const graphqlUrl = 'https://api.geographql.rudio.dev/graphql';
    const query = `
      {
        cities(filter: { ciso2: "${ciso2}", siso: "${siso}" }, page: { first: 100 }) {
          totalCount
          edges {
            cursor
            node {
              name
              state_code
              country_code
              latitude
              longitude
              id
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
        }
      }
    `;

    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL Error: ${response.statusText}`);
    }

    const json = await response.json();
    try {
      await this.saveCities(json.data);
      return { status: 201, body: 'Data was loaded' };
    } catch (err) {
      return { status: 500, body: err };
    }
  }
}
