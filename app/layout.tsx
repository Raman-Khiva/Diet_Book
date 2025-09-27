import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/lib/context/AppContext';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DietTracker - Beautiful Nutrition Tracking',
  description: 'Track your nutrition with style. Beautiful, intuitive, and powerful diet tracking application.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AppProvider>
            <Navigation />
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}