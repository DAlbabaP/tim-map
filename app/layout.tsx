import type { Metadata } from 'next'
import { Montserrat, Roboto } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  display: 'swap',
})

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ТимМап - Интерактивная карта университета',
  description: 'Современная интерактивная карта Тимирязевской академии с информацией о зданиях, транспорте и объектах кампуса.',
  keywords: 'карта университета, Тимирязевская академия, интерактивная карта, кампус, здания, транспорт',
  authors: [{ name: 'Команда ТимМап' }],
  creator: 'Команда ТимМап',
  robots: 'index, follow',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    title: 'Интерактивная карта университета | ТимМап',
    description: 'Быстро ищите здания, инфраструктуру и транспорт университета на интерактивной карте ТимМап.',
    siteName: 'ТимМап',
    images: [
      {
        url: '/images/icons/seo.png',
        width: 1200,
        height: 630,
        alt: 'ТимМап - Интерактивная карта университета',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Интерактивная карта университета | ТимМап',
    description: 'Быстро ищите здания, инфраструктуру и транспорт университета на интерактивной карте ТимМап.',
    images: ['/images/icons/seo.png'],
  },
  icons: {
    icon: '/images/icons/favicon.ico',
    shortcut: '/images/icons/favicon.ico',
    apple: '/images/icons/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${roboto.variable}`}>
      <body className="min-h-screen bg-university-background font-sans antialiased">
        <div id="root" className="flex h-screen flex-col overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
} 