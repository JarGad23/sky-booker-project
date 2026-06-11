import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * PROGRAMOWANIE OBIEKTOWE:
 * - Kompozycja (używa PrismaClient wewnętrznie)
 * - Implementuje interfejsy NestJS (OnModuleInit, OnModuleDestroy)
 * - Dependency Injection - @Injectable()
 * - Adapter Pattern (PrismaPg jako adapter do PostgreSQL)
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _client: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    this._client = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this._client.$connect();
  }

  async onModuleDestroy() {
    await this._client.$disconnect();
  }

  get user() {
    return this._client.user;
  }

  get flight() {
    return this._client.flight;
  }

  get booking() {
    return this._client.booking;
  }

  get passenger() {
    return this._client.passenger;
  }

  $transaction<T>(fn: (prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>): Promise<T> {
    return this._client.$transaction(fn);
  }
}
