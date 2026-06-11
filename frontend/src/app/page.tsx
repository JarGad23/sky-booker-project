import { SearchForm } from '@/components/SearchForm';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Shield, CreditCard } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Zarezerwuj lot w kilka sekund
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Wyszukaj najlepsze połączenia lotnicze do popularnych destynacji w Europie i na świecie
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Dlaczego SkyBooker?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Oferujemy szybką i wygodną rezerwację lotów z gwarancją najlepszej obsługi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Szeroki wybór lotów</h3>
                <p className="text-sm text-muted-foreground">
                  Dostęp do setek połączeń od najlepszych linii lotniczych
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Konkurencyjne ceny</h3>
                <p className="text-sm text-muted-foreground">
                  Gwarancja atrakcyjnych cen na wszystkie rezerwacje
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Bezpieczna rezerwacja</h3>
                <p className="text-sm text-muted-foreground">
                  Twoje dane są chronione nowoczesnym szyfrowaniem
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
