import React, { useState, useEffect } from 'react'
import { formatCurrency } from '../lib/utils'
import AdminLayout from '../components/AdminLayout'

export default function PedidosPendentes() {
  const [activeSection, setActiveSection] = useState('pedidos')
  const [activeSubSection, setActiveSubSection] = useState('pendentes')
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  // Dados mockados baseados no design
  const mockPedidos = [
    {
      id: "#0001",
      email: "henry@gmail.com",
      dataHora: "05/09/2025, 13:47",
      pedido: ["2x Pretzel Classico", "2x Eisnben", "4x Cerveja Long Neck"],
      total: 89.90,
      status: "Ativo"
    },
    {
      id: "#0002", 
      email: "maria@outlook.com",
      dataHora: "05/09/2025, 13:45",
      pedido: ["1x Salada", "1x Salsichas"],
      total: 43.00,
      status: "À caminho"
    },
    {
      id: "#0003",
      email: "joao@hotmail.com", 
      dataHora: "05/09/2025, 13:42",
      pedido: ["3x Mini Croquete", "2x Bolinhos"],
      total: 81.00,
      status: "Ativo"
    },
    {
      id: "#0004",
      email: "ana@gmail.com",
      dataHora: "05/09/2025, 13:40", 
      pedido: ["1x Pretzel Classico", "1x Cerveja Long Neck"],
      total: 35.50,
      status: "Cancelado"
    }
  ]

  // ========================================
  // 🔗 INTEGRAÇÃO COM BACKEND - CARREGAMENTO DE PEDIDOS
  // ========================================
  useEffect(() => {
    const loadPedidos = async () => {
      setLoading(true)
      
      try {
        // TODO: Substituir por chamada real da API
        // const response = await fetch(`${API_BASE_URL}/pedidos?status=pendente`, {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}` // se necessário
        //   }
        // })
        // 
        // if (!response.ok) {
        //   throw new Error('Erro ao carregar pedidos')
        // }
        // 
        // const data = await response.json()
        // setPedidos(data.pedidos)
        
        // SIMULAÇÃO TEMPORÁRIA - REMOVER QUANDO CONECTAR COM BACKEND
        await new Promise(resolve => setTimeout(resolve, 1000))
        setPedidos(mockPedidos)
        
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error)
        // TODO: Adicionar toast/notificação de erro para o usuário
      } finally {
        setLoading(false)
      }
    }
    
    loadPedidos()
  }, [])

  // Função para lidar com mudanças de seção
  const handleSectionChange = (section, subSection) => {
    setActiveSection(section)
    setActiveSubSection(subSection)
  }

  // Função para logout
  const handleLogout = () => {
    // TODO: Implementar logout real
    console.log('Logout realizado')
    // Redirecionar para página de login
    // window.location.href = '/login'
  }

  // Função para obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregue':
        return 'bg-green-100 text-green-800'
      case 'À caminho':
        return 'bg-blue-100 text-blue-800'
      case 'Ativo':
        return 'bg-green-100 text-green-800'
      case 'Cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }


  return (
    <AdminLayout
      title="Acompanhar pedidos"
      onLogout={handleLogout}
      activeSection={activeSubSection}
      onSectionChange={handleSectionChange}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Acompanhar pedidos
          </h2>
        </div>
        
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaiserhaus-dark-brown"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">ID</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Email</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Data e hora</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Pedido</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Total</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm text-gray-900 font-medium">
                        {pedido.id}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {pedido.email}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {pedido.dataHora}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        <div className="space-y-1">
                          {pedido.pedido.map((item, idx) => (
                            <div key={idx}>{item}</div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm font-semibold text-kaiserhaus-dark-brown">
                        {formatCurrency(pedido.total)}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pedido.status)}`}>
                          {pedido.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {/* ========================================
                            🔗 INTEGRAÇÃO COM BACKEND - EDITAR PEDIDO
                            ======================================== */}
                        <button 
                          onClick={() => {
                            // TODO: Implementar modal/formulário para editar pedido
                            // TODO: Conectar com API PUT /pedidos/{id}
                            // const response = await fetch(`${API_BASE_URL}/pedidos/${pedido.id}`, {
                            //   method: 'PUT',
                            //   headers: {
                            //     'Content-Type': 'application/json',
                            //     'Authorization': `Bearer ${token}`
                            //   },
                            //   body: JSON.stringify(pedidoEditado)
                            // })
                            console.log(`Editar pedido ${pedido.id}`)
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Editar pedido"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
