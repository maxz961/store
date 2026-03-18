import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { NavigationProgressClient } from '@/components/providers/NavigationProgress/NavigationProgressClient';
import { Header } from '@/components/layout/Header';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LanguageProvider } from '@/lib/i18n';
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
    <html lang="uk" suppressHydrationWarning>
      <head>
        {/* Sets lang attribute before React renders so datetime-local inputs use the correct locale */}
        <script dangerouslySetInnerHTML={{ __html: `try{var l=localStorage.getItem('lang');if(l==='en'||l==='uk')document.documentElement.lang=l;}catch(e){}` }} />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>
            <LanguageProvider>
              <NavigationProgressClient />
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
