import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const flights: Prisma.FlightCreateInput[] = [
  {
    flightNumber: 'LO123',
    origin: 'Warszawa',
    destination: 'Londyn',
    departureTime: new Date('2026-06-15T08:00:00'),
    arrivalTime: new Date('2026-06-15T10:30:00'),
    price: new Prisma.Decimal(450),
    totalSeats: 180,
    availableSeats: 180,
    airline: 'LOT Polish Airlines',
  },
  {
    flightNumber: 'LO456',
    origin: 'Kraków',
    destination: 'Paryż',
    departureTime: new Date('2026-06-16T14:00:00'),
    arrivalTime: new Date('2026-06-16T16:30:00'),
    price: new Prisma.Decimal(380),
    totalSeats: 150,
    availableSeats: 150,
    airline: 'LOT Polish Airlines',
  },
  {
    flightNumber: 'FR789',
    origin: 'Warszawa',
    destination: 'Barcelona',
    departureTime: new Date('2026-06-17T06:00:00'),
    arrivalTime: new Date('2026-06-17T09:00:00'),
    price: new Prisma.Decimal(220),
    totalSeats: 189,
    availableSeats: 189,
    airline: 'Ryanair',
  },
  {
    flightNumber: 'W6321',
    origin: 'Gdańsk',
    destination: 'Rzym',
    departureTime: new Date('2026-06-18T10:30:00'),
    arrivalTime: new Date('2026-06-18T13:00:00'),
    price: new Prisma.Decimal(280),
    totalSeats: 180,
    availableSeats: 180,
    airline: 'Wizz Air',
  },
  {
    flightNumber: 'LH555',
    origin: 'Warszawa',
    destination: 'Frankfurt',
    departureTime: new Date('2026-06-19T07:00:00'),
    arrivalTime: new Date('2026-06-19T08:45:00'),
    price: new Prisma.Decimal(320),
    totalSeats: 200,
    availableSeats: 200,
    airline: 'Lufthansa',
  },
  {
    flightNumber: 'LO789',
    origin: 'Wrocław',
    destination: 'Amsterdam',
    departureTime: new Date('2026-06-20T12:00:00'),
    arrivalTime: new Date('2026-06-20T14:00:00'),
    price: new Prisma.Decimal(350),
    totalSeats: 160,
    availableSeats: 160,
    airline: 'LOT Polish Airlines',
  },
  {
    flightNumber: 'FR111',
    origin: 'Poznań',
    destination: 'Madryt',
    departureTime: new Date('2026-06-21T05:30:00'),
    arrivalTime: new Date('2026-06-21T09:00:00'),
    price: new Prisma.Decimal(180),
    totalSeats: 189,
    availableSeats: 189,
    airline: 'Ryanair',
  },
  {
    flightNumber: 'LO222',
    origin: 'Warszawa',
    destination: 'Nowy Jork',
    departureTime: new Date('2026-06-22T11:00:00'),
    arrivalTime: new Date('2026-06-22T15:00:00'),
    price: new Prisma.Decimal(2500),
    totalSeats: 250,
    availableSeats: 250,
    airline: 'LOT Polish Airlines',
  },
];

async function main() {
  console.log('Seeding database...');

  for (const flight of flights) {
    await prisma.flight.upsert({
      where: { flightNumber: flight.flightNumber },
      update: {},
      create: flight,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
