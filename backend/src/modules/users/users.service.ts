import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { IBaseService } from '../../common/interfaces';
import { CreateUserDto, UpdateUserDto } from './dto';

/**
 * PROGRAMOWANIE OBIEKTOWE:
 * - Klasa implementuje interfejs IBaseService (polimorfizm)
 * - Dependency Injection przez konstruktor
 * - Enkapsulacja logiki biznesowej
 */
@Injectable()
export class UsersService implements IBaseService<User, CreateUserDto, UpdateUserDto> {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
