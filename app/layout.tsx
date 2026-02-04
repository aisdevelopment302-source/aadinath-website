import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aadinath Industries - Pioneering Excellence in Every Element',
  description: 'A cornerstone in the re-rolling mills sector. MS Angles, Round Bars, Square Bars, Flat Bars, and Bright Bars crafted to perfection.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
