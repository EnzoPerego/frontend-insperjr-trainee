import React from 'react'
import { cn } from '../lib/utils'

const Header = ({ className = '' }) => {
  return (
    <header className={cn('bg-white shadow-sm border-b', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IJ</span>
            </div>
            <span className="text-xl font-bold text-gray-900">InsperJr</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </a>
            <a 
              href="#about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sobre
            </a>
            <a 
              href="#services" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Serviços
            </a>
            <a 
              href="#contact" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contato
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Entre em Contato
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
