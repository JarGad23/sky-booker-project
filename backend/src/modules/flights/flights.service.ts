import { Injectable, NotFoundException } from '@nestjs/common';
import { Flight, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchFlightsDto, CreateFlightDto } from './dto';

/**
 * PROGRAMOWANIE OBIEKTOWE:
 * - Dependency Injection
 * - Enkapsulacja logiki wyszukiwania lotów
 * - Metody prywatne i publiczne
 */
@Injectable()
export class FlightsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Flight[]> {
    return this.prisma.flight.findMany({
      orderBy: { departureTime: 'asc' },
    });
  }

  async search(dto: SearchFlightsDto): Promise<Flight[]> {
    const where: Prisma.FlightWhereInput = {};

    if (dto.origin) {
      where.origin = { contains: dto.origin, mode: 'insensitive' };
    }

    if (dto.destination) {
      where.destination = { contains: dto.destination, mode: 'insensitive' };
    }

    if (dto.departureDate) {
      const date = new Date(dto.departureDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      where.departureTime = {
        gte: date,
        lt: nextDay,
      };
    }

    where.availableSeats = { gt: 0 };

    return this.prisma.flight.findMany({
      where,
      orderBy: { departureTime: 'asc' },
    });
  }

  async findOne(id: string): Promise<Flight> {
    const flight = await this.prisma.flight.findUnique({ where: { id } });

    if (!flight) {
      throw new NotFoundException('Flight not found');
    }

    return flight;
  }

  async getAvailableSeats(id: string): Promise<string[]> {
    const flight = await this.findOne(id);
    const bookings = await this.prisma.booking.findMany({
      where: { flightId: id, status: 'CONFIRMED' },
      select: { seatNumber: true },
    });

    const bookedSeats = new Set(bookings.map((b) => b.seatNumber));
    const allSeats = this.generateSeatNumbers(flight.totalSeats);

    return allSeats.filter((seat) => !bookedSeats.has(seat));
  }

  async create(dto: CreateFlightDto): Promise<Flight> {
    return this.prisma.flight.create({
      data: {
        ...dto,
        departureTime: new Date(dto.departureTime),
        arrivalTime: new Date(dto.arrivalTime),
        availableSeats: dto.totalSeats,
        price: new Prisma.Decimal(dto.price),
      },
    });
  }

  private generateSeatNumbers(totalSeats: number): string[] {
    const seats: string[] = [];
    const rows = Math.ceil(totalSeats / 6);
    const columns = ['A', 'B', 'C', 'D', 'E', 'F'];

    for (let row = 1; row <= rows; row++) {
      for (const col of columns) {
        if (seats.length < totalSeats) {
          seats.push(`${row}${col}`);
        }
      }
    }

    return seats;
  }
}
