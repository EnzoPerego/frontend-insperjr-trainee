import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className={cn('bg-kaiserhaus-dark-brown text-white', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-white hover:text-kaiserhaus-light-brown transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Left Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <a 
              href="#home" 
              className="text-white hover:text-kaiserhaus-light-brown transition-colors font-medium text-sm lg:text-base"
            >
              Home
            </a>
            <a 
              href="#menu" 
              className="text-white hover:text-kaiserhaus-light-brown transition-colors font-medium text-sm lg:text-base"
            >
              Cardápio
            </a>
          </nav>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wider">
              KAISERHAUS
            </h1>
          </div>

          {/* Right Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <a 
              href="#contact" 
              className="text-white hover:text-kaiserhaus-light-brown transition-colors font-medium text-sm lg:text-base"
            >
              Contato
            </a>
            <a 
              href="#cart" 
              className="text-white hover:text-kaiserhaus-light-brown transition-colors font-medium text-sm lg:text-base"
            >
              Carrinho
            </a>
            <a 
              href="#login" 
              className="text-white hover:text-kaiserhaus-light-brown transition-colors font-medium text-sm lg:text-base"
            >
              Login
            </a>
          </nav>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-kaiserhaus-dark-brown border-t border-kaiserhaus-light-brown shadow-lg z-50">
            <nav className="flex flex-col py-4">
              <a 
                href="#home" 
                className="px-4 py-3 text-white hover:bg-kaiserhaus-light-brown transition-colors font-medium border-b border-kaiserhaus-light-brown"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="#menu" 
                className="px-4 py-3 text-white hover:bg-kaiserhaus-light-brown transition-colors font-medium border-b border-kaiserhaus-light-brown"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cardápio
              </a>
              <a 
                href="#contact" 
                className="px-4 py-3 text-white hover:bg-kaiserhaus-light-brown transition-colors font-medium border-b border-kaiserhaus-light-brown"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contato
              </a>
              <a 
                href="#cart" 
                className="px-4 py-3 text-white hover:bg-kaiserhaus-light-brown transition-colors font-medium border-b border-kaiserhaus-light-brown"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Carrinho
              </a>
              <a 
                href="#login" 
                className="px-4 py-3 text-white hover:bg-kaiserhaus-light-brown transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
