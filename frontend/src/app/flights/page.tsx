"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useFlights } from "@/lib/hooks";
import { FlightCard } from "@/components/FlightCard";
import { SearchForm } from "@/components/SearchForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, SearchX } from "lucide-react";

function FlightsContent() {
  const searchParams = useSearchParams();

  const origin = searchParams.get("origin") || undefined;
  const destination = searchParams.get("destination") || undefined;
  const departureDate = searchParams.get("date") || undefined;

  const { data: flights, isLoading, error } = useFlights({
    origin,
    destination,
    departureDate,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-24" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Nie udało się pobrać lotów</p>
        </CardContent>
      </Card>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <SearchX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Brak wyników</h3>
          <p className="text-muted-foreground">
            Nie znaleziono lotów spełniających kryteria wyszukiwania
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Plane className="h-4 w-4" />
        Znaleziono {flights.length} {flights.length === 1 ? "lot" : "lotów"}
      </div>
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
}

function FlightsLoading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function FlightsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wyszukaj loty</h1>
        <p className="text-muted-foreground">
          Znajdź idealne połączenie dla siebie
        </p>
      </div>

      <div className="mb-8">
        <SearchForm />
      </div>

      <Suspense fallback={<FlightsLoading />}>
        <FlightsContent />
      </Suspense>
    </div>
  );
}
