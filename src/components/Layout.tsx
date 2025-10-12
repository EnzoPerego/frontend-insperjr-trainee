import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { cn } from '../lib/utils'

interface LayoutProps {
  children: React.ReactNode
  className?: string
  showHeader?: boolean
  showFooter?: boolean
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '',
  showHeader = true,
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showHeader && <Header />}
      
      <main className={cn('flex-1', showHeader ? 'pt-16' : '', className)}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  )
}

export default Layout
