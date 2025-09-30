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
          <>
            {/* Cards Mobile (sm) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{pedido.numero}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(pedido.status)}`}>
                          {pedido.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                        <span><strong>Cliente:</strong> {pedido.cliente}</span>
                        <span><strong>Data:</strong> {pedido.data}</span>
                        <span><strong>Total:</strong> {formatCurrency(pedido.total)}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 truncate">
                        <span className="font-medium text-gray-900">Itens:</span>{' '}
                        {pedido.itens.map((item) => `${item.quantidade}x ${item.produto}`).join(', ')}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <button className="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium">
                        Visualizar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabela Desktop/Tablet (md+) */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pedido.numero}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pedido.cliente}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pedido.data}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(pedido.total)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                            {pedido.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm">
                            Visualizar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
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
