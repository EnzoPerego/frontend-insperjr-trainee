import React, { useState } from 'react'
import { cn } from '../lib/utils'
import { useAuth } from './AuthContext'
import { useCart } from '../contexts/CartContext'
import ContactModal from './ContatoModal'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { user, logout } = useAuth()
  const { getTotalItems, isInitialized } = useCart()
  const cartItemsCount = getTotalItems()

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchTerm.trim())}`
    }
  }

    return (
      <header className={cn('bg-kaiserhaus-dark-brown text-white', className)}>
        <div className="container mx-auto px-4">
          {/* Primeira linha,   sempre visível */}
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
              className="text-white hover:text-white/80 transition-colors font-montserrat text-sm lg:text-base"
            >
              Home
            </a>
            <a 
              href="/cardapio" 
              className="text-white hover:text-white/80 transition-colors font-montserrat text-sm lg:text-base"
            >
              Cardápio
            </a>
            {user && (
              <a 
                href="/meus-pedidos" 
                className="text-white hover:text-white/80 transition-colors font-montserrat text-sm lg:text-base"
              >
                Meus Pedidos
              </a>
            )}
          </nav>

          {/* logo centralizada */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a href="/" className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wider hover:text-white/80 transition-colors">
              KAISERHAUS
            </a>
          </div>

          {/* barra de busca na direita */}
          <div className="hidden lg:flex ml-auto mr-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="w-64 px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Right Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <button 
              onClick={() => setIsContactOpen(true)}
              className="text-white hover:text-white/80 transition-colors font-montserrat text-sm lg:text-base"
            >
              Contato
            </button>
            <a 
              href="/carrinho" 
              className="text-white hover:text-white/80 transition-colors font-montserrat text-sm lg:text-base flex items-center space-x-2"
            >
              <span>Carrinho</span>
              {isInitialized && cartItemsCount > 0 && (
                <span className="bg-white text-kaiserhaus-dark-brown rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemsCount}
                </span>
              )}
            </a>
            {user ? (
              <button 
                onClick={logout}
                className="text-white hover:text-white/80 transition-colors font-montserrat text-sm lg:text-base"
              >
                Logout
              </button>
            ) : (
              <a 
                href="/login" 
                className="text-white hover:text-white/80 transition-colors font-montserrat text-sm lg:text-base"
              >
                Login
              </a>
            )}
          </nav>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-kaiserhaus-dark-brown border-t border-kaiserhaus-light-brown shadow-lg z-50">
            {/* pesquisa para mobile */}
            <div className="p-4 border-b border-kaiserhaus-light-brown">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar produtos..."
                    className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
            
            <nav className="flex flex-col py-4">
              <a 
                href="#home" 
                className="px-4 py-3 text-white hover:text-white/80 transition-colors font-montserrat border-b border-kaiserhaus-light-brown"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/cardapio" 
                className="px-4 py-3 text-white hover:text-white/80 transition-colors font-montserrat border-b border-kaiserhaus-light-brown"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cardápio
              </a>
              {user && (
                <a 
                  href="/meus-pedidos" 
                  className="px-4 py-3 text-white hover:text-white/80 transition-colors font-montserrat border-b border-kaiserhaus-light-brown"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Meus Pedidos
                </a>
              )}
              <button 
                className="px-4 py-3 text-left w-full text-white hover:text-white/80 transition-colors font-montserrat border-b border-kaiserhaus-light-brown"
                onClick={() => { setIsContactOpen(true); setIsMobileMenuOpen(false) }}
              >
                Contato
              </button>
              <a 
                href="/carrinho" 
                className="px-4 py-3 text-white hover:text-white/80 transition-colors font-montserrat border-b border-kaiserhaus-light-brown flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Carrinho</span>
                {isInitialized && cartItemsCount > 0 && (
                  <span className="bg-white text-kaiserhaus-dark-brown rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </a>
              {user ? (
                <button 
                  className="px-4 py-3 text-left w-full text-white hover:text-white/80 transition-colors font-montserrat"
                  onClick={() => { logout(); setIsMobileMenuOpen(false) }}
                >
                  Logout
                </button>
              ) : (
                <a 
                  href="/login" 
                  className="px-4 py-3 text-white hover:text-white/80 transition-colors font-montserrat"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </a>
              )}
            </nav>
          </div>
        )}
      <ContactModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </header>
  )
}

export default Header
