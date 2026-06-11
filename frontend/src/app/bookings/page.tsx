"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMyBookings, useCancelBooking } from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";
import { BookingCard } from "@/components/BookingCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Ticket, Plane } from "lucide-react";

export default function BookingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: bookings, isLoading } = useMyBookings();
  const cancelBooking = useCancelBooking();

  const [cancelId, setCancelId] = useState<string | null>(null);

  if (!authLoading && !user) {
    router.push("/login");
    return null;
  }

  const handleCancel = async () => {
    if (!cancelId) return;

    try {
      await cancelBooking.mutateAsync(cancelId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Nie udało się anulować rezerwacji");
      }
    } finally {
      setCancelId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Ticket className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Moje rezerwacje</h1>
          <p className="text-sm text-muted-foreground">
            Zarządzaj swoimi rezerwacjami lotów
          </p>
        </div>
      </div>

      {!bookings || bookings.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Brak rezerwacji</h3>
            <p className="text-muted-foreground mb-6">
              Nie masz jeszcze żadnych rezerwacji lotów
            </p>
            <Button asChild>
              <Link href="/flights">Przeglądaj loty</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={(id) => setCancelId(id)}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anulować rezerwację?</AlertDialogTitle>
            <AlertDialogDescription>
              Tej operacji nie można cofnąć. Twoja rezerwacja zostanie
              anulowana.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Nie, zachowaj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Tak, anuluj
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
