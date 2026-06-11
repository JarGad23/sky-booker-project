import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Booking } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FlightsService } from '../flights/flights.service';
import { CreateBookingDto } from './dto';

/**
 * PROGRAMOWANIE OBIEKTOWE:
 * - Dependency Injection (PrismaService, FlightsService)
 * - Kompozycja (używa FlightsService)
 * - Enkapsulacja logiki rezerwacji
 * - Transakcje bazodanowe
 */
@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly flightsService: FlightsService,
  ) {}

  async create(dto: CreateBookingDto, userId: string): Promise<Booking> {
    const flight = await this.flightsService.findOne(dto.flightId);

    if (flight.availableSeats <= 0) {
      throw new ConflictException('No available seats on this flight');
    }

    const availableSeats = await this.flightsService.getAvailableSeats(
      dto.flightId,
    );

    if (!availableSeats.includes(dto.seatNumber)) {
      throw new ConflictException('This seat is already booked');
    }

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId,
          flightId: dto.flightId,
          seatNumber: dto.seatNumber,
          status: 'CONFIRMED',
          passenger: {
            create: {
              firstName: dto.firstName,
              lastName: dto.lastName,
              email: dto.email,
              phone: dto.phone,
            },
          },
        },
        include: {
          flight: true,
          passenger: true,
        },
      });

      await tx.flight.update({
        where: { id: dto.flightId },
        data: { availableSeats: { decrement: 1 } },
      });

      return booking;
    });
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        flight: true,
        passenger: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        flight: true,
        passenger: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async cancel(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    if (booking.status === 'CANCELLED') {
      throw new ConflictException('Booking is already cancelled');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: {
          flight: true,
          passenger: true,
        },
      });

      await tx.flight.update({
        where: { id: booking.flightId },
        data: { availableSeats: { increment: 1 } },
      });

      return updated;
    });
  }
}
