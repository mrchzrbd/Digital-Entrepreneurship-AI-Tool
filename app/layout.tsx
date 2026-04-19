import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Copilot — AI for Entrepreneurs',
  description: 'Turn fragmented data into clear decisions',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '220px', minHeight: '100vh' }}>
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
