import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../utils/api'

interface Pedido {
  id: string
  status: string
  total: number
  metodo_pagamento?: string
  observacoes?: string
  created_at?: string
  cliente?: {
    nome: string
  }
  endereco?: {
    rua: string
    numero: string
    bairro: string
    cidade: string
  }
}

interface PedidoConfirmadoProps {
  pedidoId?: string
}

const PedidoConfirmado: React.FC<PedidoConfirmadoProps> = ({ pedidoId }) => {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        // Se não tem pedidoId, pega da URL
        const id = pedidoId || new URLSearchParams(window.location.search).get('id')
        
        if (!id) {
          setError('ID do pedido não encontrado')
          setLoading(false)
          return
        }

        const response = await apiFetch(`/pedidos/${id}`)
        setPedido(response as Pedido)
      } catch (err) {
        console.error('Erro ao buscar pedido:', err)
        setError('Erro ao carregar pedido')
      } finally {
        setLoading(false)
      }
    }

    fetchPedido()
  }, [pedidoId])


  const getProgressSteps = () => {
    const steps = [
      { label: 'Pagamento em análise', completed: true },
      { label: 'Pagamento confirmado', completed: true },
      { label: 'Preparando pedido', completed: pedido?.status === 'Em preparo' || pedido?.status === 'Pronto' || pedido?.status === 'Saiu para entrega' || pedido?.status === 'Entregue' },
      { label: 'Saiu para entrega', completed: pedido?.status === 'Saiu para entrega' || pedido?.status === 'Entregue' }
    ]
    return steps
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kaiserhaus-dark-brown mx-auto mb-4"></div>
            <p className="text-kaiserhaus-dark-brown">Carregando pedido...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !pedido) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-kaiserhaus-dark-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
            >
              Voltar ao início
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
         
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-kaiserhaus-dark-brown mb-4">
              Pedido confirmado!
            </h1>
            <p className="text-gray-600 text-lg">
              Acompanhe seu pedido em tempo real
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Acompanhamento do Pedido
                </h2>
                
                {/* Progresso */}
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-kaiserhaus-dark-brown"></div>
                  
                  <div className="space-y-6">
                    {getProgressSteps().map((step, index) => (
                      <div key={index} className="relative flex items-start">
                        <div className={`relative z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                          step.completed 
                            ? 'bg-kaiserhaus-dark-brown border-kaiserhaus-dark-brown' 
                            : 'bg-white border-gray-300'
                        }`}>
                          {step.completed && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className={`text-xs font-medium ${
                            step.completed ? 'text-kaiserhaus-dark-brown' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informações do Pedido */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Detalhes do Pedido</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Número do pedido:</span>
                      <span className="font-medium text-gray-900">#{pedido.id.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium text-kaiserhaus-dark-brown">R$ {pedido.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {pedido.metodo_pagamento && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pagamento:</span>
                        <span className="font-medium text-gray-900">
                          {pedido.metodo_pagamento === 'cash' ? 'Dinheiro' : 
                           pedido.metodo_pagamento === 'credit' ? 'Cartão de Crédito' :
                           pedido.metodo_pagamento === 'debit' ? 'Cartão de Débito' :
                           pedido.metodo_pagamento === 'pix' ? 'PIX' :
                           pedido.metodo_pagamento}
                        </span>
                      </div>
                    )}
                    {pedido.created_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(pedido.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'America/Sao_Paulo'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Suporte */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Suporte
                </h2>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    Problemas com pedido?
                  </h3>
                  <p className="text-gray-600 mb-4 text-xs">
                    Entre em contato conosco para esclarecer dúvidas ou resolver problemas com seu pedido.
                  </p>
                  
                  <a
                    href="tel:+5511987654321"
                    className="block w-full bg-kaiserhaus-dark-brown text-white text-center py-2 px-4 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors text-sm"
                  >
                    LIGAR PARA O RESTAURANTE
                  </a>
                </div>

                {/* Informações de Contato */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    Outras formas de contato
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium text-gray-700">WhatsApp:</span>
                      <a href="https://wa.me/5511987654321" className="text-kaiserhaus-dark-brown hover:underline ml-2">
                        (11) 98765-4321
                      </a>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-gray-600 ml-2">contato@kaiserhaus.com.br</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="space-y-2">
                  <button
                    onClick={() => window.location.href = '/cardapio'}
                    className="w-full border-2 border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown py-2 px-4 rounded-lg font-semibold hover:bg-kaiserhaus-dark-brown hover:text-white transition-colors text-sm"
                  >
                    FAZER NOVO PEDIDO
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm"
                  >
                    VOLTAR AO INÍCIO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PedidoConfirmado
