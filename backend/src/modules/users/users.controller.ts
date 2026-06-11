import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';

/**
 * PROGRAMOWANIE OBIEKTOWE:
 * - Dependency Injection (UsersService wstrzyknięty przez konstruktor)
 * - Dekoratory (@Controller, @Get, @UseGuards)
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: { userId: string }) {
    return this.usersService.findOne(user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
