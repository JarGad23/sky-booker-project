'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SeatPickerProps {
  availableSeats: string[];
  selectedSeat: string | null;
  onSelect: (seat: string) => void;
  totalSeats: number;
}

export function SeatPicker({
  availableSeats,
  selectedSeat,
  onSelect,
  totalSeats,
}: SeatPickerProps) {
  const rows = Math.ceil(totalSeats / 6);
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getSeatStatus = (seat: string) => {
    if (selectedSeat === seat) return 'selected';
    if (availableSeats.includes(seat)) return 'available';
    return 'taken';
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Wybierz miejsce</CardTitle>
        <div className="flex gap-4 text-sm pt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/10 border border-primary/30"></div>
            <span className="text-muted-foreground">Dostępne</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span className="text-muted-foreground">Wybrane</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted"></div>
            <span className="text-muted-foreground">Zajęte</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex gap-1.5 mb-2">
            <div className="w-9"></div>
            {columns.map((col, idx) => (
              <div key={col} className="flex items-center">
                <div className="w-9 text-center text-xs font-medium text-muted-foreground">
                  {col}
                </div>
                {idx === 2 && <div className="w-6"></div>}
              </div>
            ))}
          </div>

          {Array.from({ length: Math.min(rows, 10) }, (_, rowIndex) => (
            <div key={rowIndex} className="flex gap-1.5">
              <div className="w-9 text-center text-xs font-medium text-muted-foreground flex items-center justify-center">
                {rowIndex + 1}
              </div>
              {columns.map((col, idx) => {
                const seat = `${rowIndex + 1}${col}`;
                const seatIndex = rowIndex * 6 + columns.indexOf(col);
                if (seatIndex >= totalSeats) return <div key={col} className="w-9" />;

                const status = getSeatStatus(seat);
                return (
                  <div key={col} className="flex items-center">
                    <button
                      type="button"
                      disabled={status === 'taken'}
                      onClick={() => status === 'available' && onSelect(seat)}
                      className={cn(
                        'w-9 h-9 rounded text-xs font-medium transition-all',
                        status === 'selected' && 'bg-primary text-primary-foreground shadow-sm',
                        status === 'available' && 'bg-primary/10 hover:bg-primary/20 border border-primary/30 cursor-pointer',
                        status === 'taken' && 'bg-muted text-muted-foreground cursor-not-allowed'
                      )}
                    >
                      {seat}
                    </button>
                    {idx === 2 && <div className="w-6"></div>}
                  </div>
                );
              })}
            </div>
          ))}

          {rows > 10 && (
            <p className="text-sm text-muted-foreground mt-3">
              Pokazano pierwsze 10 rzędów
            </p>
          )}

          {selectedSeat && (
            <Badge variant="outline" className="mt-4">
              Wybrane miejsce: {selectedSeat}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
