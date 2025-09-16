import React, { useState } from 'react'
import { cn } from '../lib/utils'

const AdminLayout = ({ 
  children, 
  title = "Área administrativa",
  onLogout = () => {},
  menuItems = [],
  activeSection = 'entradas',
  onSectionChange = () => {},
  className = ''
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Header da área administrativa */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Botão de menu mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <button 
            onClick={onLogout}
            className="px-3 py-2 sm:px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-kaiserhaus-dark-brown mb-6">
              KAISERHAUS Admin
            </h2>
            
            <nav className="space-y-4 sm:space-y-6">
              {menuItems.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-1 sm:space-y-2">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            onSectionChange(section.title.toLowerCase(), item.id)
                            // Fechar menu mobile ao clicar
                            setIsMobileMenuOpen(false)
                          }}
                          className={`w-full text-left px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                            activeSection === item.id
                              ? 'bg-kaiserhaus-dark-brown text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Overlay para mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Conteúdo principal */}
        <div className="flex-1 p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
