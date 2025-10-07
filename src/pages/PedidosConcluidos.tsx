import React, { useState, useEffect } from 'react'
import { formatCurrency } from '../lib/utils'
import AdminLayout from '../components/AdminLayout'
import PedidoDetalheModal from '../components/PedidoDetalheModal'
import { Pedido, PedidoStatus } from '../types'
import { apiFetch } from '../utils/api'

export default function PedidosConcluidos(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<string>('pedidos')
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [detalheAberto, setDetalheAberto] = useState<boolean>(false)
  const [pedidoIdSelecionado, setPedidoIdSelecionado] = useState<string | null>(null)

  const mapFromApi = (p: any): Pedido => {
    const numero = `#${String(p?.id || '').padStart(4, '0')}`
    const cliente = p?.cliente?.email || p?.cliente?.nome || 'Cliente'
    const status = (p?.status as PedidoStatus) || 'Pendente'
    const total = Number(p?.total || 0)
    const data = p?.created_at ? new Date(p.created_at).toLocaleString('pt-BR') : ''
    const itens = Array.isArray(p?.itens) ? p.itens.map((i: any) => ({
      produto: i?.produto?.titulo || i?.produto_nome || 'Item',
      quantidade: Number(i?.quantidade || 0),
      preco: Number(i?.preco_unitario || i?.preco || 0)
    })) : []
    return { id: String(p?.id || ''), numero, cliente, status, total, data, itens }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiFetch<any[]>(`/pedidos?status_filtro=Entregue`)
        const mapped = (Array.isArray(data) ? data : []).map(mapFromApi)
        setPedidos(mapped)
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar pedidos')
        setPedidos([])
      } finally {
        setLoading(false)
      }
    }
    load()
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm">{error}</div>
            )}
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
                      <button onClick={() => { setPedidoIdSelecionado(pedido.id); setDetalheAberto(true) }} className="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium">
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
                          <button onClick={() => { setPedidoIdSelecionado(pedido.id); setDetalheAberto(true) }} className="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm">
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

        <PedidoDetalheModal open={detalheAberto} pedidoId={pedidoIdSelecionado} onClose={() => setDetalheAberto(false)} />
      </div>
    </AdminLayout>
  )
}
