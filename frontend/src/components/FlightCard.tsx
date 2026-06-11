'use client';

import Link from 'next/link';
import { Flight } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plane, Clock, Users } from 'lucide-react';

interface FlightCardProps {
  flight: Flight;
}

export function FlightCard({ flight }: FlightCardProps) {
  const departureDate = new Date(flight.departureTime);
  const arrivalDate = new Date(flight.arrivalTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
    });
  };

  const durationMs = arrivalDate.getTime() - departureDate.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMins = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{flight.airline}</Badge>
              <span className="text-sm text-muted-foreground">{flight.flightNumber}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{formatTime(departureDate)}</p>
                <p className="text-sm font-medium">{flight.origin}</p>
                <p className="text-xs text-muted-foreground">{formatDate(departureDate)}</p>
              </div>

              <div className="flex-1 flex flex-col items-center px-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Clock className="h-3 w-3" />
                  {durationHours}h {durationMins}min
                </div>
                <div className="w-full flex items-center">
                  <div className="h-px flex-1 bg-border"></div>
                  <Plane className="h-4 w-4 mx-2 text-primary" />
                  <div className="h-px flex-1 bg-border"></div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold">{formatTime(arrivalDate)}</p>
                <p className="text-sm font-medium">{flight.destination}</p>
                <p className="text-xs text-muted-foreground">{formatDate(arrivalDate)}</p>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden md:block h-20" />

          <div className="flex flex-col items-end gap-3 min-w-[140px]">
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{flight.price} PLN</p>
              <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                <Users className="h-3 w-3" />
                {flight.availableSeats} miejsc
              </p>
            </div>
            <Button asChild>
              <Link href={`/flights/${flight.id}`}>Wybierz</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
