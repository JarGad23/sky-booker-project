import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { FlightsModule } from '../flights/flights.module';

@Module({
  imports: [FlightsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
