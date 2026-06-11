'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plane, User, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Plane className="h-5 w-5 text-primary" />
          <span>SkyBooker</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" asChild>
            <Link href="/flights">Wyszukaj loty</Link>
          </Button>

          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/bookings">Moje rezerwacje</Link>
              </Button>
              <Separator orientation="vertical" className="mx-2 h-6" />
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {user.firstName}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Wyloguj
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Zaloguj</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Zarejestruj</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
