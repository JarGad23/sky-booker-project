'use client';

import { Booking } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plane, Calendar, MapPin, User, Armchair, X } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const departureDate = new Date(booking.flight.departureTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pl-PL', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const statusConfig = {
    CONFIRMED: { label: 'Potwierdzona', variant: 'default' as const },
    PENDING: { label: 'Oczekująca', variant: 'secondary' as const },
    CANCELLED: { label: 'Anulowana', variant: 'destructive' as const },
  };

  const status = statusConfig[booking.status];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{booking.flight.airline}</Badge>
            <span className="text-sm font-medium">{booking.flight.flightNumber}</span>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{booking.flight.origin}</span>
          </div>
          <Plane className="h-4 w-4 text-primary" />
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{booking.flight.destination}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Calendar className="h-3.5 w-3.5" />
              Data i godzina
            </div>
            <p className="font-medium">{formatDate(departureDate)}</p>
            <p className="font-medium">{formatTime(departureDate)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Armchair className="h-3.5 w-3.5" />
              Miejsce
            </div>
            <p className="font-medium">{booking.seatNumber}</p>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <User className="h-3.5 w-3.5" />
              Pasażer
            </div>
            <p className="font-medium">
              {booking.passenger.firstName} {booking.passenger.lastName}
            </p>
            <p className="text-muted-foreground">{booking.passenger.email}</p>
          </div>
        </div>
      </CardContent>

      {booking.status === 'CONFIRMED' && onCancel && (
        <CardFooter className="border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCancel(booking.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-1.5" />
            Anuluj rezerwację
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
