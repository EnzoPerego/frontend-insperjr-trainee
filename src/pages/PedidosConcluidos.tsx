import React, { useState, useEffect } from 'react'
import { formatCurrency } from '../lib/utils'
import AdminLayout from '../components/AdminLayout'
import { Pedido, PedidoStatus } from '../types'

export default function PedidosConcluidos(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<string>('pedidos')
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Dados mockados para pedidos concluídos
  const mockPedidosConcluidos: Pedido[] = [
    {
      id: "1",
      numero: "#0001",
      cliente: "henry@gmail.com",
      status: "Concluído",
      total: 89.90,
      data: "05/09/2025, 13:47",
      itens: [
        { produto: "Pretzel Classico", quantidade: 2, preco: 29.00 },
        { produto: "Eisnben", quantidade: 2, preco: 55.00 },
        { produto: "Cerveja Long Neck", quantidade: 4, preco: 12.00 }
      ]
    },
    {
      id: "2",
      numero: "#0002",
      cliente: "maria@outlook.com",
      status: "Concluído",
      total: 43.00,
      data: "05/09/2025, 13:45",
      itens: [
        { produto: "Salada", quantidade: 1, preco: 25.00 },
        { produto: "Salsichas", quantidade: 1, preco: 18.00 }
      ]
    },
    {
      id: "3",
      numero: "#0003",
      cliente: "joao@hotmail.com",
      status: "Cancelado",
      total: 67.50,
      data: "05/09/2025, 13:30",
      itens: [
        { produto: "Schnitzel de Frango", quantidade: 1, preco: 45.00 },
        { produto: "Bratwurst", quantidade: 1, preco: 38.00 }
      ]
    },
    {
      id: "4",
      numero: "#0004",
      cliente: "ana@gmail.com",
      status: "Cancelado",
      total: 32.00,
      data: "05/09/2025, 13:15",
      itens: [
        { produto: "Mini Croquete", quantidade: 2, preco: 15.00 },
        { produto: "Pão de Alho", quantidade: 1, preco: 12.00 }
      ]
    }
  ]

  // Simular carregamento de dados da API
  useEffect(() => {
    // TODO: Substituir por chamada real da API
    // GET /pedidos?status=concluido
    const loadPedidos = async (): Promise<void> => {
      setLoading(true)
      try {
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000))
        setPedidos(mockPedidosConcluidos)
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPedidos()
  }, [])

  // Função para obter cor do status (cinza para concluídos)
  const getStatusColor = (status: PedidoStatus): string => {
    switch (status) {
      case 'Concluído':
        return 'bg-gray-100 text-gray-800'
      case 'Cancelado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout
      title="Pedidos Concluídos"
      activeSection={activeSection}
      onSectionChange={(section: string) => setActiveSection(section)}
    >
      <div className="space-y-6">
        {/* Header da página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pedidos Concluídos</h1>
            <p className="text-gray-600 mt-1">Histórico de pedidos finalizados</p>
          </div>
        </div>

        {/* Lista de pedidos */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaiserhaus-dark-brown"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-75">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Informações do pedido */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{pedido.numero}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                        {pedido.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>Cliente:</strong> {pedido.cliente}</p>
                        <p><strong>Data/Hora:</strong> {pedido.data}</p>
                      </div>
                      <div>
                        <p><strong>Total:</strong> {formatCurrency(pedido.total)}</p>
                      </div>
                    </div>

                    {/* Itens do pedido */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Itens do pedido:</h4>
                      <ul className="space-y-1">
                        {pedido.itens.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {item.quantidade}x {item.produto} - {formatCurrency(item.preco)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Visualizar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TODO: Implementar funcionalidades de backend */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">🚧 Integração com Backend Pendente</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>• <strong>useEffect:</strong> GET /pedidos?status=concluido</p>
            <p>• <strong>Visualizar:</strong> GET /pedidos/{`{id}`}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
