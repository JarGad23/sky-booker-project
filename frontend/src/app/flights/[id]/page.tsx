"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useFlight, useAvailableSeats, useCreateBooking } from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";
import { SeatPicker } from "@/components/SeatPicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Plane, Calendar, Clock, AlertCircle, ArrowLeft } from "lucide-react";

export default function FlightDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const flightId = params.id as string;

  const { data: flight, isLoading: flightLoading } = useFlight(flightId);
  const { data: availableSeats = [] } = useAvailableSeats(flightId);
  const createBooking = useCreateBooking();

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!selectedSeat) {
      setError("Wybierz miejsce");
      return;
    }

    setError("");

    try {
      await createBooking.mutateAsync({
        flightId,
        seatNumber: selectedSeat,
        ...formData,
      });
      router.push("/bookings");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Nie udało się utworzyć rezerwacji");
      }
    }
  };

  if (flightLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive">Lot nie został znaleziony</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const departureDate = new Date(flight.departureTime);
  const arrivalDate = new Date(flight.arrivalTime);
  const durationMs = arrivalDate.getTime() - departureDate.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMins = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/flights">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Wróć do wyników
        </Link>
      </Button>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary">{flight.airline}</Badge>
                <span className="text-sm text-muted-foreground">
                  {flight.flightNumber}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {departureDate.toLocaleDateString("pl-PL", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                {flight.price} PLN
              </p>
              <p className="text-sm text-muted-foreground">za osobę</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {departureDate.toLocaleTimeString("pl-PL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-lg font-medium">{flight.origin}</p>
            </div>

            <div className="flex-1 mx-8 flex flex-col items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                {durationHours}h {durationMins}min
              </div>
              <div className="w-full flex items-center">
                <div className="h-px flex-1 bg-border"></div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-3">
                  <Plane className="h-5 w-5 text-primary" />
                </div>
                <div className="h-px flex-1 bg-border"></div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold">
                {arrivalDate.toLocaleTimeString("pl-PL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-lg font-medium">{flight.destination}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!user && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <p className="text-amber-800">
                Aby zarezerwować lot,{" "}
                <Link href="/login" className="font-medium underline">
                  zaloguj się
                </Link>{" "}
                lub{" "}
                <Link href="/register" className="font-medium underline">
                  utwórz konto
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <SeatPicker
          availableSeats={availableSeats}
          selectedSeat={selectedSeat}
          onSelect={setSelectedSeat}
          totalSeats={flight.totalSeats}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dane pasażera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Imię</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nazwisko</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="py-3">
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Łączna cena</p>
            <p className="text-2xl font-bold">{flight.price} PLN</p>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={createBooking.isPending || !user}
          >
            {createBooking.isPending ? "Rezerwacja..." : "Zarezerwuj lot"}
          </Button>
        </div>
      </form>
    </div>
  );
}
