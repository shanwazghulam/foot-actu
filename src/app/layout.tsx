import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FootActu – Actualités des 5 grands championnats',
  description: "Toute l'actualité du foot : Ligue 1, Premier League, LaLiga, Serie A, Bundesliga",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="text-center py-6 text-sm text-gray-400 border-t mt-12">
          © {new Date().getFullYear()} FootActu – Tous droits réservés
        </footer>
      </body>
    </html>
  )
}
