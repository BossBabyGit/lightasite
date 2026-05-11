import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Lighta - Official Website',
  description: 'Kick Gambling Streamer & Community Hub',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-950 text-white antialiased">
        <AppProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(12, 12, 18, 0.95)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(24px)',
                fontSize: '13px',
                borderRadius: '12px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              },
            }}
          />
        </AppProvider>
      </body>
    </html>
  )
}
