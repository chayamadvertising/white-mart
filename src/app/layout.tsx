import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'White Mart - Premium Quality Appliances',
  description: 'Your trusted destination for quality products.',
  verification: {
    google: 'c6YCNTwDQoEKkybycER10DBuQKnW_ffHtq6ZOKS4D6g',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      </head>
      <body className={inter.className + " flex flex-col min-h-screen"}>
        <Providers>
          <Navbar />
          <main className="flex-grow flex-1" style={{ minHeight: '50vh' }}>
            <div className="container py-4 px-2 px-md-3">
              {children}
            </div>
          </main>
          <Footer />
          <Toaster position="top-right" />
          
          {/* Floating WhatsApp Button */}
          <a href="https://wa.me/918129418544" className="whatsapp-float fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform" target="_blank" title="Chat with us on WhatsApp" style={{ textDecoration: 'none' }}>
              <i className="bi bi-whatsapp text-2xl"></i>
          </a>
        </Providers>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" async></script>
      </body>
    </html>
  )
}
