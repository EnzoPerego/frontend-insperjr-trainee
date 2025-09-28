import React, { useState, useEffect } from 'react'
import { formatCurrency } from '../lib/utils'
import AdminLayout from '../components/AdminLayout'
import { Produto, ProdutoStatus } from '../types'

export default function Pratos(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<string>('cardápio')
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Dados mockados para Pratos (simulando API)
  const mockPratos: Produto[] = [
    {
      id: "1",
      titulo: "Schnitzel de Frango",
      descricao_capa: "Frango empanado com batatas fritas",
      descricao_geral: "Serve 1 pessoa",
      preco: 45.00,
      status: "Ativo",
      categoria: { id: "2", nome: "Pratos" },
      acompanhamentos: [],
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
      estrelas_kaiserhaus: false
    },
    {
      id: "2",
      titulo: "Bratwurst com Chucrute",
      descricao_capa: "Salsicha alemã com chucrute tradicional",
      descricao_geral: "Serve 1 pessoa",
      preco: 38.00,
      status: "Ativo",
      categoria: { id: "2", nome: "Pratos" },
      acompanhamentos: [],
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
      estrelas_kaiserhaus: false
    },
    {
      id: "3",
      titulo: "Eisbein",
      descricao_capa: "Joelho de porco defumado tradicional",
      descricao_geral: "Serve 1 pessoa",
      preco: 55.00,
      status: "Ativo",
      categoria: { id: "2", nome: "Pratos" },
      acompanhamentos: [],
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
      estrelas_kaiserhaus: true
    },
    {
      id: "4",
      titulo: "Feijoada Completa",
      descricao_capa: "O tradicional prato brasileiro",
      descricao_geral: "Serve 2 pessoas",
      preco: 49.90,
      status: "Inativo",
      categoria: { id: "2", nome: "Pratos" },
      acompanhamentos: [],
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
      estrelas_kaiserhaus: false
    }
  ]

  // Simular carregamento de dados da API
  useEffect(() => {
    // TODO: Substituir por chamada real da API
    // GET /produtos?categoria=pratos
    const loadProdutos = async (): Promise<void> => {
      setLoading(true)
      try {
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProdutos(mockPratos)
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProdutos()
  }, [])

  // Função para alternar status do produto
  const toggleProdutoStatus = async (produtoId: string): Promise<void> => {
    // TODO: Substituir por chamada real da API
    // PUT /produtos/{id} com novo status
    setProdutos(prevProdutos => 
      prevProdutos.map(produto => 
        produto.id === produtoId 
          ? { 
              ...produto, 
              status: produto.status === 'Ativo' ? 'Inativo' : 'Ativo' as ProdutoStatus,
              updated_at: new Date().toISOString()
            }
          : produto
      )
    )
  }

  // Função para obter cor do status
  const getStatusColor = (status: ProdutoStatus): string => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800'
      case 'Inativo':
        return 'bg-red-100 text-red-800'
      case 'Indisponível':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Função para obter ícone do status
  const getStatusIcon = (status: ProdutoStatus): React.JSX.Element => {
    if (status === 'Ativo') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        </svg>
      )
    }
  }

  return (
    <AdminLayout
      title="Gerenciar Pratos"
      activeSection={activeSection}
      onSectionChange={(section: string) => setActiveSection(section)}
    >
      <div className="space-y-6">
        {/* Header da página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pratos</h1>
            <p className="text-gray-600 mt-1">Gerencie os pratos principais do cardápio</p>
          </div>
          <button className="px-4 py-2 bg-kaiserhaus-dark-brown text-white rounded-lg hover:bg-kaiserhaus-brown transition-colors font-medium">
            Adicionar Prato +
          </button>
        </div>

        {/* Lista de produtos */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaiserhaus-dark-brown"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {produtos.map((produto) => (
                    <tr key={produto.id} className={produto.status === 'Inativo' ? 'opacity-60' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm font-medium">
                                {produto.titulo.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {produto.titulo}
                            </div>
                            <div className="text-sm text-gray-500">
                              {produto.descricao_capa}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(produto.preco)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(produto.status)}`}>
                          {getStatusIcon(produto.status)}
                          <span className="ml-1">{produto.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => toggleProdutoStatus(produto.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            produto.status === 'Ativo' 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={produto.status === 'Ativo' ? 'Desativar produto' : 'Ativar produto'}
                        >
                          {getStatusIcon(produto.status)}
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
          </div>
        )}

        {/* TODO: Implementar funcionalidades de backend */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">🚧 Integração com Backend Pendente</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>• <strong>useEffect:</strong> GET /produtos?categoria=pratos</p>
            <p>• <strong>toggleProdutoStatus:</strong> PUT /produtos/{`{id}`}</p>
            <p>• <strong>Adicionar Prato:</strong> POST /produtos</p>
            <p>• <strong>Editar:</strong> PUT /produtos/{`{id}`}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
