import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(
    @Body() dto: CreateBookingDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.bookingsService.create(dto, user.userId);
  }

  @Get('my')
  async findMyBookings(@CurrentUser() user: { userId: string }) {
    return this.bookingsService.findByUser(user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Delete(':id')
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.bookingsService.cancel(id, user.userId);
  }
}
