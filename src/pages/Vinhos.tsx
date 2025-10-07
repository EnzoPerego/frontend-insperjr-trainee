import React, { useState, useEffect } from 'react'
import { formatCurrency, resolveImageUrl } from '../lib/utils'
import AdminLayout from '../components/AdminLayout'
import { Produto, ProdutoStatus } from '../types'
import { apiFetch } from '../utils/api'

export default function Vinhos(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<string>('cardápio')
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Carregar dados da API
  useEffect(() => {
    const loadProdutos = async (): Promise<void> => {
      setLoading(true)
      try {
        const categorias = await apiFetch<Array<{ id: string; nome: string }>>('/categorias')
        const cat = categorias.find(c => c.nome.toLowerCase() === 'vinhos')
        if (!cat) {
          setProdutos([])
        } else {
          const todos = await apiFetch<Produto[]>('/produtos')
          setProdutos(todos.filter(p => p.categoria?.id === cat.id))
        }
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
    const produtoAtual = produtos.find(p => p.id === produtoId)
    if (!produtoAtual) return
    const novoStatus: ProdutoStatus = produtoAtual.status === 'Ativo' ? 'Inativo' : 'Ativo'
    setProdutos(prev => prev.map(p => p.id === produtoId ? { ...p, status: novoStatus, updated_at: new Date().toISOString() } : p))
    try {
      await apiFetch(`/produtos/${produtoId}`, { method: 'PUT', body: JSON.stringify({ status: novoStatus }) })
    } catch (e) {
      setProdutos(prev => prev.map(p => p.id === produtoId ? { ...p, status: produtoAtual.status } : p))
      console.error('Falha ao atualizar status do produto', e)
    }
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
      title="Gerenciar Vinhos"
      activeSection={activeSection}
      onSectionChange={(section: string) => setActiveSection(section)}
    >
      <div className="space-y-6">
        {/* Header da página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vinhos</h1>
            <p className="text-gray-600 mt-1">Gerencie os vinhos do cardápio</p>
          </div>
          <a href="/admin/cardapio/vinhos/novo" className="px-4 py-2 bg-kaiserhaus-dark-brown text-white rounded-lg hover:bg-kaiserhaus-brown transition-colors font-medium">
            Adicionar Vinho +
          </a>
        </div>

        {/* Lista de produtos */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaiserhaus-dark-brown"></div>
          </div>
        ) : (
          <>
            {/* Cards Mobile (sm) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {produtos.map((produto) => (
                <div key={produto.id} className={`bg-white rounded-lg border shadow-sm p-4 ${produto.status === 'Inativo' ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm font-medium">
                          {produto.titulo.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{produto.titulo}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(produto.status)}`}>
                          {produto.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{produto.descricao_capa}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-semibold text-kaiserhaus-light-brown">{formatCurrency(produto.preco)}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleProdutoStatus(produto.id)}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                              produto.status === 'Ativo' 
                                ? 'text-red-700 bg-red-50 hover:bg-red-100' 
                                : 'text-green-700 bg-green-50 hover:bg-green-100'
                            }`}
                          >
                            {produto.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                          </button>
                          <a href={`/admin/cardapio/vinhos/editar?id=${produto.id}`} className="px-3 py-1.5 rounded-md text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                            Editar
                          </a>
                        </div>
                      </div>
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
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                                {produto.image_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={resolveImageUrl(produto.image_url)} alt={produto.titulo} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-gray-500 text-sm font-medium">
                                    {produto.titulo.charAt(0)}
                                  </span>
                                )}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
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
                          <a href={`/admin/cardapio/vinhos/editar?id=${produto.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        
      </div>
    </AdminLayout>
  )
}
