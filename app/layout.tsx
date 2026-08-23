import { Analytics } from '@vercel/analytics/next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { QueryProvider } from '../components/query-provider'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })
import './globals.css'

export const metadata: Metadata = {
  title: 'SV Neuhof | Futebol ao vivo',
  description: 'Veja os próximos jogos e acesse a transmissão do SV Neuhof do Brasil.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`bg-background ${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased font-sans">
        <QueryProvider>{children}</QueryProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
