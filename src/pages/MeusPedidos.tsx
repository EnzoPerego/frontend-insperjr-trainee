import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../components/AuthContext'
import { apiFetch } from '../utils/api'

interface Pedido {
  id: string
  status: string
  total: number
  created_at: string
  metodo_pagamento?: string
}

const MeusPedidos: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPedidos = async () => {
      // Não fazer nada enquanto o authcontext está carregando
      if (authLoading) {
        return
      }
      
      if (!user) {
        setError('Usuário não logado')
        setLoading(false)
        return
      }

      try {
        const response = await apiFetch(`/pedidos?cliente_id=${user.id}`)
        
        // Se a resposta é um array, usar diretamente
        if (Array.isArray(response)) {
          setPedidos(response)
        } else {
          setPedidos([])
        }
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err)
        setError(`Erro ao carregar pedidos: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [user, authLoading])

  const getStatusColor = (status: string) => {
    const statusColors = {
      'Pendente': 'text-yellow-600 bg-yellow-100',
      'Em preparo': 'text-blue-600 bg-blue-100',
      'Pronto': 'text-purple-600 bg-purple-100',
      'Saiu para entrega': 'text-orange-600 bg-orange-100',
      'Entregue': 'text-green-600 bg-green-100',
      'Cancelado': 'text-red-600 bg-red-100'
    }
    return statusColors[status as keyof typeof statusColors] || 'text-gray-600 bg-gray-100'
  }

  const formatDate = (dateString: string) => {
    // Converter para horário local do Brasil 
    const date = new Date(dateString)
    
    // Ajustar para o fuso horário do Brasil
    const brazilTime = new Date(date.getTime() - (3 * 60 * 60 * 1000))
    
    return brazilTime.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    })
  }

  // Se o AuthContext ainda está carregando, mostrar loading
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kaiserhaus-dark-brown mx-auto mb-4"></div>
            <p className="text-kaiserhaus-dark-brown">
              {authLoading ? 'Verificando login...' : 'Carregando pedidos...'}
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  // Se não tem usuário após carregamento, mostrar login
  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso restrito</h1>
            <p className="text-gray-600 mb-6">Você precisa estar logado para ver seus pedidos</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-kaiserhaus-dark-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar pedidos</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-kaiserhaus-dark-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-kaiserhaus-dark-brown mb-2">
              Meus Pedidos
            </h1>
            <p className="text-gray-600">
              Acompanhe o status de todos os seus pedidos
            </p>
          </div>

          {/* lista de ppedidos */}
          {pedidos.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-600 mb-6">Você ainda não fez nenhum pedido</p>
              <button
                onClick={() => window.location.href = '/cardapio'}
                className="bg-kaiserhaus-dark-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
              >
                Ver Cardápio
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pedido #{pedido.id.slice(-8)}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                          {pedido.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Data:</span>
                          <p>{formatDate(pedido.created_at)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>
                          <p className="font-semibold text-kaiserhaus-dark-brown">
                            R$ {pedido.total.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                        {pedido.metodo_pagamento && (
                          <div>
                            <span className="font-medium">Pagamento:</span>
                            <p className="capitalize">
                              {pedido.metodo_pagamento === 'cash' ? 'Dinheiro' : 
                               pedido.metodo_pagamento === 'credit' ? 'Cartão de Crédito' :
                               pedido.metodo_pagamento === 'debit' ? 'Cartão de Débito' :
                               pedido.metodo_pagamento === 'pix' ? 'PIX' :
                               pedido.metodo_pagamento}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <button
                        onClick={() => window.location.href = `/pedido-confirmado?id=${pedido.id}`}
                        className="bg-kaiserhaus-dark-brown text-white px-4 py-2 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MeusPedidos
