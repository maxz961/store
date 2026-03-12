import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { NavigationProgress } from '@/components/providers/NavigationProgress';
import { Header } from '@/components/layout/Header';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Toaster } from 'sonner';
import './globals.css';


const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Store',
  description: 'Online Store',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>
            <Suspense>
              <NavigationProgress />
            </Suspense>
            <Suspense>
              <Header />
            </Suspense>
            <main>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
          </ThemeProvider>
        <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
