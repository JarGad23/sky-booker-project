# SkyBooker - System Rezerwacji Lotów

Projekt zaliczeniowy demonstrujący paradygmaty:
- **Programowanie graficzne** → Frontend (Next.js + React)
- **Programowanie obiektowe** → Backend (NestJS + TypeScript)

## Stack technologiczny

| Warstwa | Technologia |
|---------|-------------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | NestJS + TypeScript + Prisma ORM |
| Baza danych | PostgreSQL (Neon) |

## Struktura projektu

```
├── frontend/          # Aplikacja Next.js
│   └── src/
│       ├── app/       # Strony (App Router)
│       ├── components/# Komponenty UI
│       └── lib/       # API client, typy, konteksty
│
└── backend/           # Aplikacja NestJS
    └── src/
        ├── modules/   # Moduły (auth, users, flights, bookings)
        ├── common/    # Współdzielone (guards, decorators)
        └── prisma/    # Schemat bazy danych
```

## Uruchomienie lokalne

### 1. Baza danych (Neon)

1. Zaloguj się do [Neon](https://neon.tech)
2. Utwórz nowy projekt
3. Skopiuj connection string

### 2. Backend

```bash
cd backend

# Skonfiguruj bazę danych
# Edytuj .env i wklej connection string z Neon:
# DATABASE_URL="postgresql://..."

# Wygeneruj klienta Prisma
npm run db:generate

# Utwórz tabele w bazie
npm run db:push

# Dodaj przykładowe loty
npm run db:seed

# Uruchom serwer deweloperski
npm run start:dev
```

Backend będzie dostępny pod `http://localhost:3001`

### 3. Frontend

```bash
cd frontend

# Uruchom serwer deweloperski
npm run dev
```

Frontend będzie dostępny pod `http://localhost:3000`

## Funkcjonalności

- Wyszukiwanie lotów (miasto, data)
- Lista dostępnych lotów
- Szczegóły lotu z wyborem miejsca
- Rejestracja i logowanie użytkowników
- Rezerwacja lotu (dla zalogowanych)
- Lista własnych rezerwacji
- Anulowanie rezerwacji

## Demonstracja OOP w backendzie

### Klasy i dziedziczenie
```typescript
// JwtStrategy dziedziczy po PassportStrategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload) { ... }
}
```

### Interfejsy
```typescript
interface IBaseService<T, CreateDto, UpdateDto> {
  create(dto: CreateDto): Promise<T>;
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T | null>;
  update(id: string, dto: UpdateDto): Promise<T>;
  remove(id: string): Promise<T>;
}
```

### Dependency Injection
```typescript
@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly flightsService: FlightsService,
  ) {}
}
```

### Dekoratory
```typescript
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  @Post()
  async create(@Body() dto: CreateBookingDto) { ... }
}
```

## Deploy

### Backend (Railway)
1. Utwórz projekt na [Railway](https://railway.app)
2. Połącz z repozytorium GitHub
3. Ustaw zmienne środowiskowe (DATABASE_URL, JWT_SECRET)
4. Deploy

### Frontend (Vercel)
1. Utwórz projekt na [Vercel](https://vercel.com)
2. Połącz z repozytorium GitHub
3. Ustaw NEXT_PUBLIC_API_URL na URL backendu
4. Deploy

## API Endpoints

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | /api/auth/register | Rejestracja |
| POST | /api/auth/login | Logowanie |
| GET | /api/flights | Lista lotów |
| GET | /api/flights/:id | Szczegóły lotu |
| GET | /api/flights/:id/seats | Dostępne miejsca |
| POST | /api/bookings | Nowa rezerwacja |
| GET | /api/bookings/my | Moje rezerwacje |
| DELETE | /api/bookings/:id | Anuluj rezerwację |
