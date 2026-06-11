import { IsString, IsOptional, IsDateString } from 'class-validator';

export class SearchFlightsDto {
  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsDateString()
  departureDate?: string;
}
