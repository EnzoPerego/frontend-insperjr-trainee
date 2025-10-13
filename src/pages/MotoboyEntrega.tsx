import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { apiFetch } from '../utils/api'
import { useAuth } from '../components/AuthContext'

interface DetalhesPedido {
  id: string
  numero: string
  cliente: {
    nome: string
    endereco: {
      rua: string
      numero: string
      bairro: string
      cidade: string
      complemento?: string
    }
  }
  total: number
  metodo_pagamento: string
  observacoes?: string
  itens: Array<{
    produto: string
    quantidade: number
    preco: number
  }>
}

const MotoboyEntrega: React.FC = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<string>('entrega')
  const [pedidoId, setPedidoId] = useState<string>('')
  const [detalhes, setDetalhes] = useState<DetalhesPedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [codigoEntrega, setCodigoEntrega] = useState('')
  const [confirmando, setConfirmando] = useState(false)

  useEffect(() => {
    const pathParts = window.location.pathname.split('/')
    const id = pathParts[pathParts.length - 1]
    setPedidoId(id)
    
    if (id) {
      loadDetalhesPedido(id)
    }
  }, [])

  const loadDetalhesPedido = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiFetch<DetalhesPedido>(`/motoboy/pedido/${id}`)
      setDetalhes(data)
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar detalhes do pedido')
    } finally {
      setLoading(false)
    }
  }

  const confirmarEntrega = async () => {
    if (!codigoEntrega || codigoEntrega.length !== 4) {
      alert('Por favor, digite um código de 4 dígitos')
      return
    }

    try {
      setConfirmando(true)
      await apiFetch('/motoboy/confirmar-entrega', {
        method: 'POST',
        body: JSON.stringify({ 
          pedido_id: pedidoId,
          codigo_entrega: codigoEntrega
        })
      })
      
      alert('Entrega confirmada com sucesso!')
      window.location.href = '/motoboy/pedidos-prontos'
    } catch (err: any) {
      alert(err?.message || 'Erro ao confirmar entrega')
    } finally {
      setConfirmando(false)
    }
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }

  const formatPaymentMethod = (method: string) => {
    const methods: { [key: string]: string } = {
      'cash': 'Dinheiro',
      'credit': 'Cartão de Crédito',
      'debit': 'Cartão de Débito',
      'pix': 'PIX'
    }
    return methods[method] || method
  }

  if (loading) {
    return (
      <AdminLayout title="Detalhes da Entrega" activeSection={activeSection} onSectionChange={setActiveSection}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaiserhaus-dark-brown"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !detalhes) {
    return (
      <AdminLayout title="Detalhes da Entrega" activeSection={activeSection} onSectionChange={setActiveSection}>
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar pedido</h3>
          <p className="text-gray-600 mb-6">{error || 'Pedido não encontrado'}</p>
          <button
            onClick={() => window.location.href = '/motoboy/pedidos-prontos'}
            className="bg-kaiserhaus-dark-brown text-white px-6 py-2 rounded-lg hover:bg-kaiserhaus-light-brown transition-colors"
          >
            Voltar para Pedidos Prontos
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Detalhes da Entrega" activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Entrega - {detalhes.numero}
            </h1>
            <p className="text-gray-600 mt-1">Confirme os detalhes e finalize a entrega</p>
          </div>
          <button
            onClick={() => window.location.href = '/motoboy/pedidos-prontos'}
            className="w-full sm:w-auto text-sm text-blue-700 hover:underline px-4 py-2 border border-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Voltar
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Cliente</h2>
            
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">Nome:</span>
                <p className="text-gray-900">{detalhes.cliente.nome}</p>
              </div>
              
              
              <div>
                <span className="font-medium text-gray-700">Endereço:</span>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">
                    {detalhes.cliente.endereco.rua}, {detalhes.cliente.endereco.numero}
                  </p>
                  <p className="text-gray-900">
                    {detalhes.cliente.endereco.bairro}, {detalhes.cliente.endereco.cidade}
                  </p>
                  {detalhes.cliente.endereco.complemento && (
                    <p className="text-gray-900">{detalhes.cliente.endereco.complemento}</p>
                  )}
                </div>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pedido</h2>
            
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">Total:</span>
                <p className="text-gray-900 font-semibold text-lg">{formatCurrency(detalhes.total)}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Pagamento:</span>
                <p className="text-gray-900">{formatPaymentMethod(detalhes.metodo_pagamento)}</p>
              </div>
              
              {detalhes.observacoes && (
                <div>
                  <span className="font-medium text-gray-700">Observações:</span>
                  <p className="text-gray-900 bg-yellow-50 p-2 rounded mt-1">{detalhes.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Itens do Pedido</h2>
          
          <div className="space-y-3">
            {detalhes.itens.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.produto}</p>
                  <p className="text-sm text-gray-600">Quantidade: {item.quantidade}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(item.preco * item.quantidade)}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(item.preco)} cada</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-kaiserhaus-dark-brown">
                {formatCurrency(detalhes.total)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Entrega</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Verificação (últimos 4 dígitos do telefone):
              </label>
              <input
                type="text"
                maxLength={4}
                value={codigoEntrega}
                onChange={(e) => setCodigoEntrega(e.target.value.replace(/\D/g, ''))}
                className="w-full p-3 border border-gray-300 rounded-lg text-center text-2xl font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0000"
              />
              <p className="text-sm text-gray-600 mt-1">
                Digite os últimos 4 dígitos do telefone do cliente para confirmar a entrega
              </p>
            </div>
            
            <button
              onClick={confirmarEntrega}
              disabled={codigoEntrega.length !== 4 || confirmando}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {confirmando ? 'Confirmando...' : 'Confirmar Entrega'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default MotoboyEntrega
