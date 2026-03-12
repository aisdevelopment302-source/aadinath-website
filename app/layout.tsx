'use client'

import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const isAdminPanel = pathname?.startsWith('/admin')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col bg-white text-gray-800" suppressHydrationWarning>
        <PageTracker />
        
        {/* Show Navbar/Footer only for public pages, not for admin panel */}
        {!isAdminPanel && <Navbar />}
        
        <main className="flex-1">{children}</main>
        
        {!isAdminPanel && <Footer />}
        {!isAdminPanel && <WhatsAppButton />}
      </body>
    </html>
  )
}
