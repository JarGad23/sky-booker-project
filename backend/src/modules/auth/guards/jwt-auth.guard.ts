import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * PROGRAMOWANIE OBIEKTOWE:
 * - Dziedziczenie (extends AuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
