import React, { useState, useEffect } from 'react'
import { formatCurrency } from '../lib/utils'
import AdminLayout from '../components/AdminLayout'

export default function Vinhos() {
  const [activeSection, setActiveSection] = useState('cardápio')
  const [activeSubSection, setActiveSubSection] = useState('vinhos')
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  // Dados mockados para Vinhos (simulando API)
  const mockVinhos = [
    {
      id: "1",
      titulo: "Riesling Trocken",
      descricao_capa: "Vinho branco alemão seco e elegante",
      descricao_geral: "750ml",
      preco: 85.00,
      status: "Ativo",
      categoria: { nome: "Vinhos" }
    },
    {
      id: "2",
      titulo: "Pinot Noir",
      descricao_capa: "Vinho tinto suave e frutado",
      descricao_geral: "750ml",
      preco: 95.00,
      status: "Ativo",
      categoria: { nome: "Vinhos" }
    },
    {
      id: "3",
      titulo: "Gewürztraminer",
      descricao_capa: "Vinho branco aromático e exótico",
      descricao_geral: "750ml",
      preco: 78.00,
      status: "Inativo",
      categoria: { nome: "Vinhos" }
    },
    {
      id: "4",
      titulo: "Dornfelder",
      descricao_capa: "Vinho tinto alemão encorpado",
      descricao_geral: "750ml",
      preco: 65.00,
      status: "Ativo",
      categoria: { nome: "Vinhos" }
    },
    {
      id: "5",
      titulo: "Sekt Brut",
      descricao_capa: "Espumante alemão tradicional",
      descricao_geral: "750ml",
      preco: 120.00,
      status: "Ativo",
      categoria: { nome: "Vinhos" }
    }
  ]

  // ========================================
  // 🔗 INTEGRAÇÃO COM BACKEND - CARREGAMENTO DE DADOS
  // ========================================
  useEffect(() => {
    const loadProdutos = async () => {
      setLoading(true)
      
      try {
        // TODO: Substituir por chamada real da API
        // const response = await fetch(`${API_BASE_URL}/produtos?categoria=vinhos`, {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}` // se necessário
        //   }
        // })
        // 
        // if (!response.ok) {
        //   throw new Error('Erro ao carregar produtos')
        // }
        // 
        // const data = await response.json()
        // setProdutos(data.produtos)
        
        // SIMULAÇÃO TEMPORÁRIA - REMOVER QUANDO CONECTAR COM BACKEND
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProdutos(mockVinhos)
        
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        // TODO: Adicionar toast/notificação de erro para o usuário
      } finally {
        setLoading(false)
      }
    }
    
    loadProdutos()
  }, [])

  // ========================================
  // 🔗 INTEGRAÇÃO COM BACKEND - ALTERAR STATUS DO PRODUTO
  // ========================================
  const toggleProdutoStatus = async (produtoId) => {
    try {
      const produto = produtos.find(p => p.id === produtoId)
      const novoStatus = produto.status === "Ativo" ? "Inativo" : "Ativo"
      
      // TODO: Substituir por chamada real da API
      // const response = await fetch(`${API_BASE_URL}/produtos/${produtoId}`, {
      //   method: 'PUT',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}` // se necessário
      //   },
      //   body: JSON.stringify({ status: novoStatus })
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('Erro ao atualizar produto')
      // }
      // 
      // const produtoAtualizado = await response.json()
      // console.log('Produto atualizado:', produtoAtualizado)
      
      // SIMULAÇÃO TEMPORÁRIA - REMOVER QUANDO CONECTAR COM BACKEND
      console.log(`Alterando produto ${produtoId} para status: ${novoStatus}`)
      
      // Atualizar estado local (manter após conectar com API)
      setProdutos(prev => 
        prev.map(p => 
          p.id === produtoId 
            ? { ...p, status: novoStatus }
            : p
        )
      )
      
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error)
      // TODO: Adicionar toast/notificação de erro para o usuário
    }
  }

  // Função para lidar com mudanças de seção
  const handleSectionChange = (section, subSection) => {
    setActiveSection(section)
    setActiveSubSection(subSection)
  }

  // Função para logout
  const handleLogout = () => {
    console.log('Logout realizado')
  }

  const pedidos = [
    { id: "#0000", email: "henry@gmail.com" },
    { id: "#0001", email: "maria@outlook.com" },
    { id: "#0002", email: "joao@hotmail.com" }
  ]

  return (
    <AdminLayout
      title="Gerenciar Vinhos"
      onLogout={handleLogout}
      activeSection={activeSubSection}
      onSectionChange={handleSectionChange}
    >
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
        {/* Seção de gerenciamento de produtos */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Gerenciar Produtos
                </h2>
                {/* ========================================
                    🔗 INTEGRAÇÃO COM BACKEND - ADICIONAR PRODUTO
                    ======================================== */}
                <button 
                  onClick={() => {
                    // TODO: Implementar modal/formulário para adicionar produto
                    // TODO: Conectar com API POST /produtos
                    // const response = await fetch(`${API_BASE_URL}/produtos`, {
                    //   method: 'POST',
                    //   headers: {
                    //     'Content-Type': 'application/json',
                    //     'Authorization': `Bearer ${token}`
                    //   },
                    //   body: JSON.stringify(novoProduto)
                    // })
                    console.log('Abrir modal para adicionar vinho')
                  }}
                  className="px-3 py-2 sm:px-4 bg-kaiserhaus-dark-brown text-white rounded-lg hover:bg-kaiserhaus-light-brown transition-colors text-sm sm:text-base"
                >
                  Adicionar Vinho +
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                VINHOS
              </h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaiserhaus-dark-brown"></div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {produtos.map((produto) => (
                    <div 
                      key={produto.id} 
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all ${
                        produto.status === "Inativo" ? "opacity-50" : ""
                      }`}
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                            {produto.titulo}
                          </h4>
                          {produto.status === "Inativo" && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full self-start">
                              Inativo
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {produto.descricao_capa}
                        </p>
                        <p className="text-xs text-gray-500">
                          {produto.descricao_geral}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                        <span className="font-semibold text-kaiserhaus-dark-brown text-sm sm:text-base">
                          {formatCurrency(produto.preco)}
                        </span>
                        
                        <div className="flex gap-1 sm:gap-2">
                          {/* ========================================
                              🔗 INTEGRAÇÃO COM BACKEND - EDITAR PRODUTO
                              ======================================== */}
                          <button 
                            onClick={() => {
                              // TODO: Implementar modal/formulário para editar produto
                              // TODO: Conectar com API PUT /produtos/{id}
                              // const response = await fetch(`${API_BASE_URL}/produtos/${produto.id}`, {
                              //   method: 'PUT',
                              //   headers: {
                              //     'Content-Type': 'application/json',
                              //     'Authorization': `Bearer ${token}`
                              //   },
                              //   body: JSON.stringify(produtoEditado)
                              // })
                              console.log(`Editar produto ${produto.id}`)
                            }}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Editar produto"
                          >
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => toggleProdutoStatus(produto.id)}
                            className={`p-1.5 sm:p-2 transition-colors ${
                              produto.status === "Ativo" 
                                ? "text-gray-400 hover:text-red-600" 
                                : "text-red-500 hover:text-green-600"
                            }`}
                            title={produto.status === "Ativo" ? "Desativar produto" : "Ativar produto"}
                          >
                            {produto.status === "Ativo" ? (
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Painel de acompanhamento de pedidos */}
        <div className="w-full xl:w-80">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Acompanhar pedidos
              </h2>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-xs sm:text-sm font-semibold text-gray-600">ID</th>
                      <th className="text-left py-2 text-xs sm:text-sm font-semibold text-gray-600">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-900">{pedido.id}</td>
                        <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-600 truncate max-w-[200px]">{pedido.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
