import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateFlightDto {
  @IsString()
  flightNumber: string;

  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsDateString()
  departureTime: string;

  @IsDateString()
  arrivalTime: string;

  @IsNumber()
  price: number;

  @IsNumber()
  totalSeats: number;

  @IsString()
  airline: string;
}
