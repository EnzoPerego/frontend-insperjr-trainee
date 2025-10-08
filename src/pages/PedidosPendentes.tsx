import React, { useState, useEffect } from 'react'
import { formatCurrency } from '../lib/utils'
import AdminLayout from '../components/AdminLayout'
import { Pedido, PedidoStatus } from '../types'
import { apiFetch } from '../utils/api'
import { useAuth } from '../components/AuthContext'
import PedidoDetalheModal from '../components/PedidoDetalheModal'

export default function PedidosPendentes(): React.JSX.Element {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<string>('pendentes')
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<PedidoStatus | 'Todos'>('Todos')
  const [detalheAberto, setDetalheAberto] = useState<boolean>(false)
  const [pedidoIdSelecionado, setPedidoIdSelecionado] = useState<string | null>(null)

  // Mapear resposta do backend para o tipo Pedido usado na UI
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

  // Carregar dados da API
  useEffect(() => {
    const loadPedidos = async (): Promise<void> => {
      setLoading(true)
      setError(null)
      try {
        // Tenta status em caixa alta e baixa, conforme backend
        let data: any = []
        if (filtroStatus !== 'Todos') {
          try {
            data = await apiFetch<any[]>(`/pedidos?status_filtro=${encodeURIComponent(filtroStatus)}`)
          } catch {
            data = await apiFetch<any[]>(`/pedidos?status_filtro=${encodeURIComponent(String(filtroStatus).toLowerCase())}`)
          }
          const mapped = (Array.isArray(data) ? data : []).map(mapFromApi)
          // garantir que "Entregue" não apareça nesta tela
          setPedidos(mapped.filter(p => p.status !== 'Entregue'))
        } else {
          // sem filtro no backend, filtra no frontend para remover Entregue
          data = await apiFetch<any[]>(`/pedidos`)
          const mapped = (Array.isArray(data) ? data : []).map(mapFromApi)
          setPedidos(mapped.filter(p => p.status !== 'Entregue'))
        }
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar pedidos')
        setPedidos([])
      } finally {
        setLoading(false)
      }
    }

    loadPedidos()
  }, [filtroStatus])

  // Função para obter cor do status
  const getStatusColor = (status: PedidoStatus): string => {
    switch (status) {
      case 'Pendente':
        return 'bg-blue-100 text-blue-800'
      case 'Em preparo':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pronto':
        return 'bg-emerald-100 text-emerald-800'
      case 'Saiu para entrega':
        return 'bg-indigo-100 text-indigo-800'
      case 'Entregue':
        return 'bg-green-100 text-green-800'
      case 'Cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // alteração de status via select controlada em alterarStatusPara()

  const alterarStatusPara = async (pedido: Pedido, novo: PedidoStatus) => {
    if (!user?.id) {
      alert('É necessário estar logado como funcionário para alterar status.')
      return
    }
    const anterior = pedido.status
    setPedidos(prev => prev.map(p => p.id === pedido.id ? { ...p, status: novo } : p))
    try {
      await apiFetch(`/pedidos/${pedido.id}/status`, { method: 'PATCH', body: JSON.stringify({ funcionario_id: user.id, novo_status: novo }) })
    } catch (e: any) {
      setPedidos(prev => prev.map(p => p.id === pedido.id ? { ...p, status: anterior } : p))
      alert(e?.message || 'Falha ao alterar status')
    }
  }

  const statusOptions: PedidoStatus[] = ['Pendente', 'Em preparo', 'Pronto', 'Saiu para entrega', 'Entregue', 'Cancelado']

  return (
    <AdminLayout
      title="Pedidos Pendentes"
      activeSection={activeSection}
      onSectionChange={(section: string) => setActiveSection(section)}
    >
      <div className="space-y-6">
        {/* Header da página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pedidos Pendentes</h1>
            <p className="text-gray-600 mt-1">Acompanhe os pedidos em andamento</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Status:</label>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as any)}
            >
              <option value="Todos">Todos</option>
              <option value="Pendente">Pendente</option>
              <option value="Em preparo">Em preparo</option>
              <option value="Pronto">Pronto</option>
              <option value="Saiu para entrega">Saiu para entrega</option>
              <option value="Cancelado">Cancelado</option>
            </select>
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
                        <select
                          className={`px-2 py-1.5 rounded-md text-sm font-medium ${getStatusColor(pedido.status)} border-0 focus:outline-none`}
                          value={pedido.status}
                          onChange={(e) => alterarStatusPara(pedido, e.target.value as PedidoStatus)}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
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
                    <div className="shrink-0 flex items-center gap-2">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            className={`px-2 py-1.5 rounded-md text-sm border-0 focus:outline-none ${getStatusColor(pedido.status)}`}
                            value={pedido.status}
                            onChange={(e) => alterarStatusPara(pedido, e.target.value as PedidoStatus)}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
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
