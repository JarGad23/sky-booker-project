'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Search } from 'lucide-react';

export function SearchForm() {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin) params.set('origin', origin);
    if (destination) params.set('destination', destination);
    if (date) params.set('date', date);
    router.push(`/flights?${params.toString()}`);
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin" className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Skąd
              </Label>
              <Input
                id="origin"
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="np. Warszawa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Dokąd
              </Label>
              <Input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="np. Londyn"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Data wylotu
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button type="submit" className="w-full" size="lg">
                <Search className="h-4 w-4 mr-2" />
                Szukaj
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
