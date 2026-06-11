import { Controller, Get, Param, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  async findAll(@Query() query: SearchFlightsDto) {
    if (query.origin || query.destination || query.departureDate) {
      return this.flightsService.search(query);
    }
    return this.flightsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.flightsService.findOne(id);
  }

  @Get(':id/seats')
  async getAvailableSeats(@Param('id') id: string) {
    return this.flightsService.getAvailableSeats(id);
  }
}
