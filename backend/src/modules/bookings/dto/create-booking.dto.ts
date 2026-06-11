import { IsString, IsEmail } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  flightId: string;

  @IsString()
  seatNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}
