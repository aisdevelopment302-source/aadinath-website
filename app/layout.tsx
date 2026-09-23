'use client'

import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import PageTracker from '../components/PageTracker'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col bg-white text-gray-800" suppressHydrationWarning>
        <PageTracker />
        
        <Navbar />
        
        <main className="flex-1">{children}</main>
        
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
