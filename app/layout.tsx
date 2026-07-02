import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Nunito } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})
const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Notion Ease : travailler sans s’épuiser',
  description:
    'Notion Ease analyse ton rythme de travail, ta charge de travail et tes pics de surcharge pour t’aider à adopter une organisation plus saine et durable.',
  icons: {
    icon: [{ url: '/notion-ease-logo.png', type: 'image/png' }],
    shortcut: [{ url: '/notion-ease-logo.png', type: 'image/png' }],
    apple: [{ url: '/notion-ease-logo.png', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f3f0e7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`light ${inter.variable} ${nunito.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
