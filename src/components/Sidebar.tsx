import React from 'react'
import { SidebarProps } from '../types'
import { useAuth } from './AuthContext'

interface MenuItem {
  id: string
  label: string
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection = 'entradas',
  onSectionChange = () => {},
  onMobileMenuClose = () => {}
}) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  
  // Menu items centralizados - reutilizável em todas as páginas admin
  const allMenuItems: MenuSection[] = [
    {
      title: "Cardápio",
      items: [
        { id: "entradas", label: "Entradas" },
        { id: "pratos", label: "Pratos" },
        { id: "sobremesas", label: "Sobremesas" },
        { id: "bebidas", label: "Bebidas" },
        { id: "vinhos", label: "Vinhos" }
      ]
    },
    {
      title: "Pedidos",
      items: [
        { id: "pendentes", label: "Pendentes" },
        { id: "concluidos", label: "Concluídos" }
      ]
    },
    {
      title: "Funcionários",
      items: [
        { id: "gerenciar", label: "Gerenciar" },
        { id: "adicionar", label: "Adicionar" }
      ]
    },
    {
      title: "Configuração",
      items: [
        { id: "categorias", label: "Categorias" }
      ]
    }
  ]

  // Filtrar menu baseado no role do usuário
  const menuItems = isAdmin 
    ? allMenuItems 
    : allMenuItems.filter(section => section.title === "Pedidos")

  // Função para lidar com navegação
  const handleNavigation = (section: string, subSection: string): void => {
    // Fechar menu mobile
    onMobileMenuClose()
    
    // Navegação para outras páginas
    if (section === 'pedidos' && subSection === 'pendentes') {
      window.location.href = '/admin/pedidos/pendentes'
    } else if (section === 'pedidos' && subSection === 'concluidos') {
      window.location.href = '/admin/pedidos/concluidos'
    } else if (section === 'cardápio' && subSection === 'entradas') {
      window.location.href = '/admin/cardapio/entradas'
    } else if (section === 'cardápio' && subSection === 'pratos') {
      window.location.href = '/admin/cardapio/pratos'
    } else if (section === 'cardápio' && subSection === 'sobremesas') {
      window.location.href = '/admin/cardapio/sobremesas'
    } else if (section === 'cardápio' && subSection === 'bebidas') {
      window.location.href = '/admin/cardapio/bebidas'
    } else if (section === 'cardápio' && subSection === 'vinhos') {
      window.location.href = '/admin/cardapio/vinhos'
    } else if (section === 'funcionários' && subSection === 'gerenciar') {
      window.location.href = '/admin/funcionarios'
    } else if (section === 'funcionários' && subSection === 'adicionar') {
      window.location.href = '/admin/funcionarios/novo'
    } else if (section === 'configuração' && subSection === 'categorias') {
      window.location.href = '/admin/categorias'
    }
    
    // Callback para atualizar estado local
    onSectionChange(section)
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header da sidebar */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-kaiserhaus-dark-brown">
          KAISERHAUS {isAdmin ? 'Admin' : 'Funcionário'}
        </h2>
        {user && (
          <p className="text-sm text-gray-600 mt-1">
            Olá, {user.nome}
          </p>
        )}
      </div>
      
      {/* Menu de navegação */}
      <nav className="space-y-4 sm:space-y-6">
        {menuItems.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs sm:text-sm font-semibold text-black uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(section.title.toLowerCase(), item.id)}
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
  )
}

export default Sidebar
