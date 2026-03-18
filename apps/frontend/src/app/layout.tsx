import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Header } from '@/components/layout/Header';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LanguageProvider } from '@/lib/i18n';
import { Toaster } from 'sonner';
import './globals.css';


const NavigationProgress = dynamic(
  () => import('@/components/providers/NavigationProgress').then((m) => m.NavigationProgress),
  { ssr: false },
);


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
    <html lang="uk" suppressHydrationWarning>
      <head>
        {/* Sets lang attribute before React renders so datetime-local inputs use the correct locale */}
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: `try{var l=localStorage.getItem('lang');if(l==='en'||l==='uk')document.documentElement.lang=l;}catch(e){}` }} />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>
            <LanguageProvider>
              <NavigationProgress />
              <Header />
              <main>
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
            </LanguageProvider>
          </ThemeProvider>
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
