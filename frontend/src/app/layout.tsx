import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/lib/query-provider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "SkyBooker - Rezerwacja lotów",
  description: "System rezerwacji podróży samolotowych",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-card py-8">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>SkyBooker - System rezerwacji lotów</p>
                <p className="mt-1">
                  Projekt zaliczeniowy - Programowanie graficzne i obiektowe
                </p>
              </div>
            </footer>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
