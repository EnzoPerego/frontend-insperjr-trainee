import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { apiFetch } from '../utils/api'
import { PedidoPronto } from '../types'

const MotoboyPedidosProntos: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('pedidos-prontos')
  const [pedidos, setPedidos] = useState<PedidoPronto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPedidosProntos()
  }, [])

  const loadPedidosProntos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiFetch<PedidoPronto[]>('/motoboy/pedidos-prontos')
      setPedidos(data)
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const aceitarPedido = async (pedidoId: string) => {
    try {
      await apiFetch('/motoboy/aceitar-pedido', {
        method: 'POST',
        body: JSON.stringify({ pedido_id: pedidoId })
      })
      
      // nnn remover o pedido da lista, pois ele continua aparecendo com status "Saiu para entrega"
      // recaregar a lista depedidos para atualizar o status
      await loadPedidosProntos()
      
      window.location.href = `/motoboy/entrega/${pedidoId}`
    } catch (err: any) {
      alert(err?.message || 'Erro ao aceitar pedido')
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Pedidos Prontos" activeSection={activeSection} onSectionChange={setActiveSection}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaiserhaus-dark-brown"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Pedidos Prontos" activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido pronto</h3>
            <p className="text-gray-600">Não há pedidos prontos para entrega no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{pedido.numero}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pedido.status === 'Pronto' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {pedido.status}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div>
                    <span className="font-medium text-gray-700">Cliente:</span>
                    <p className="text-gray-900">{pedido.cliente.nome}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Endereço:</span>
                    <p className="text-gray-900">
                      {pedido.cliente.endereco.rua}, {pedido.cliente.endereco.numero}
                    </p>
                    <p className="text-gray-900">
                      {pedido.cliente.endereco.bairro}, {pedido.cliente.endereco.cidade}
                    </p>
                    {pedido.cliente.endereco.complemento && (
                      <p className="text-gray-900">{pedido.cliente.endereco.complemento}</p>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total:</span>
                    <p className="text-gray-900 font-semibold">R$ {pedido.total.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Data:</span>
                    <p className="text-gray-900">{pedido.data}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Itens:</span>
                    <div className="mt-1">
                      {pedido.itens.map((item, index) => (
                        <p key={index} className="text-gray-900">
                          {item.quantidade}x {item.produto}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => aceitarPedido(pedido.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Aceitar Entrega
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default MotoboyPedidosProntos
