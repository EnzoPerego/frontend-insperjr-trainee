import React from 'react'
import { cn } from '../lib/utils'

interface FooterProps {
  className?: string
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={cn('bg-kaiserhaus-dark-brown text-white', className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {/* Logo */}
          <div className="flex items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wider">
              KAISERHAUS
            </h2>
          </div>

          {/* Separator */}
          <div className="hidden lg:block w-px h-16 xl:h-20 bg-white"></div>

          {/* Navigation Links */}
          <div className="flex items-center">
            <nav className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
              <a 
                href="#home" 
                className="text-white hover:text-kaiserhaus-light-brown transition-colors font-medium text-sm sm:text-base text-center"
              >
                Home
              </a>
              <a 
                href="#menu" 
                className="text-white hover:text-kaiserhaus-light-brown transition-colors font-medium text-sm sm:text-base text-center"
              >
                Cardápio
              </a>
              <a 
                href="#contact" 
                className="text-white hover:text-kaiserhaus-light-brown transition-colors font-medium text-sm sm:text-base text-center"
              >
                Contato
              </a>
              <a 
                href="/carrinho" 
                className="text-white hover:text-kaiserhaus-light-brown transition-colors font-medium text-sm sm:text-base text-center"
              >
                Carrinho
              </a>
            </nav>
          </div>

          {/* Separator */}
          <div className="hidden lg:block w-px h-16 xl:h-20 bg-white"></div>

          {/* Contact Information */}
          <div className="flex items-center">
            <div className="text-center lg:text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-white">Contato:</h3>
              <div className="space-y-1 text-white">
                <p className="text-xs sm:text-sm">+55 (11)3156-7590</p>
                <div className="w-20 sm:w-24 h-px bg-white mx-auto lg:mx-0 my-2"></div>
                <p className="text-xs sm:text-sm">kaiserhaus@gmail.com.br</p>
                <p className="text-xs sm:text-sm">Rua Arandu, 200 Brooklin</p>
                <p className="text-xs sm:text-sm">São Paulo/ SP CEP 0000-00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 text-center text-white">
          <p className="text-sm">
            © 2025 Kaiserhaus. Todos os direitos reservados • Versão 1.0
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
