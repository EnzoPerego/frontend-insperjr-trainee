import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ProductModal from '../components/ProductModal'
import ProductCard from '../components/ProductCard'
import { apiFetch } from '../utils/api'

interface Produto {
  id: string
  titulo: string
  preco: number
  preco_promocional?: number
  descricao_capa?: string
  descricao_geral?: string
  descricao?: string
  image_url?: string
  categoria?: {
    id: string
    nome: string
  }
  status: string
  acompanhamentos?: Array<{
    nome: string
    preco: number
  }>
}

const Busca: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([])
  const [termoBusca, setTermoBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalProduto, setModalProduto] = useState<Produto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categorias, setCategorias] = useState<Array<{ id: string; nome: string }>>([])

  // Buscar termo da URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q') || ''
    setTermoBusca(query)
  }, [])

  // Carregar produtos e categorias
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true)
      try {
        // Carregar produtos
        const todosProdutos = await apiFetch<Produto[]>('/produtos')
        setProdutos(todosProdutos)

        // Carregar categorias
        const categoriasData = await apiFetch<Array<{ id: string; nome: string }>>('/categorias')
        setCategorias(categoriasData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  // Filtrar produtos
  useEffect(() => {
    let produtosFiltrados = produtos.filter(produto => produto.status === 'Ativo')

    // Filtrar por termo de busca
    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase()
      produtosFiltrados = produtosFiltrados.filter(produto =>
        produto.titulo.toLowerCase().includes(termo) ||
        produto.descricao_geral?.toLowerCase().includes(termo) ||
        produto.categoria?.nome.toLowerCase().includes(termo)
      )
    }

    // Filtrar por categoria
    if (categoriaFiltro) {
      produtosFiltrados = produtosFiltrados.filter(produto =>
        produto.categoria?.id === categoriaFiltro
      )
    }

    setProdutosFiltrados(produtosFiltrados)
  }, [produtos, termoBusca, categoriaFiltro])

  // Função para abrir modal do produto
  const handleOpenProductModal = (produto: Produto) => {
    setModalProduto(produto)
    setIsModalOpen(true)
  }

  // Função para fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalProduto(null)
  }


  const ProductCardWrapper = ({ produto }: { produto: Produto }) => {
    const handleAddToCart = (produto: any) => {
      handleOpenProductModal(produto)
    }
    
    return (
      <ProductCard
        produto={produto as any}
        descricao={produto.descricao_capa || produto.descricao_geral || produto.descricao || "Descrição do produto"}
        onAddToCart={handleAddToCart}
      />
    )
  }

  // Função para buscar
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const url = new URL(window.location.href)
    url.searchParams.set('q', termoBusca)
    window.history.pushState({}, '', url.toString())
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kaiserhaus-dark-brown mx-auto mb-4"></div>
            <p className="text-kaiserhaus-dark-brown">Carregando produtos...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header da busca */}
          <div className="mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <a 
                  href="/cardapio"
                  className="inline-flex items-center text-kaiserhaus-dark-brown hover:text-kaiserhaus-light-brown transition-colors font-montserrat text-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar ao Cardápio
                </a>
                
                <h1 className="text-3xl font-bold text-kaiserhaus-dark-brown font-montserrat">
                  Resultados da Busca
                </h1>
                
                <div className="w-32"></div> {/* Espaço vazio para centralizar o título */}
              </div>
              
              {/* Barra de busca */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    placeholder="Buscar produtos por nome ou descrição..."
                    className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:border-kaiserhaus-dark-brown focus:outline-none transition-colors text-lg font-montserrat bg-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-kaiserhaus-dark-brown hover:text-kaiserhaus-light-brown transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <span className="text-kaiserhaus-dark-brown font-montserrat font-semibold text-sm sm:text-base">Categoria:</span>
                  <select
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:border-kaiserhaus-dark-brown focus:outline-none transition-colors font-montserrat bg-white hover:border-kaiserhaus-dark-brown/50 cursor-pointer"
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setTermoBusca('')
                    setCategoriaFiltro('')
                    const url = new URL(window.location.href)
                    url.searchParams.delete('q')
                    window.history.pushState({}, '', url.toString())
                  }}
                  className="w-full sm:w-auto px-6 py-2 bg-kaiserhaus-dark-brown text-white rounded-lg hover:bg-kaiserhaus-light-brown transition-colors font-montserrat font-semibold"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="max-w-6xl mx-auto">
            {/* Contador de resultados */}
            <div className="mb-6">
              <p className="text-black text-center font-montserrat">
                {produtosFiltrados.length === 0 
                  ? 'Nenhum produto encontrado' 
                  : `${produtosFiltrados.length} produto${produtosFiltrados.length !== 1 ? 's' : ''} encontrado${produtosFiltrados.length !== 1 ? 's' : ''}`
                }
                {termoBusca && ` para "${termoBusca}"`}
              </p>
            </div>

            {/* pprodutos */}
            {produtosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtosFiltrados.map((produto) => (
                  <ProductCardWrapper key={produto.id} produto={produto} />
                ))}
              </div>
            ) : (
              /* estado vazio */
              <div className="text-center py-12">
                <div className="mb-6">
                  <svg className="w-16 h-16 text-kaiserhaus-dark-brown/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-kaiserhaus-dark-brown mb-2 font-montserrat">
                  Nenhum produto encontrado
                </h3>
                <p className="text-black mb-6 font-montserrat">
                  Tente ajustar os termos de busca ou filtros
                </p>
                <button
                  onClick={() => window.location.href = '/cardapio'}
                  className="bg-kaiserhaus-dark-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors font-montserrat"
                >
                  Ver Cardápio Completo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* modal do Produto */}
      {modalProduto && (
        <ProductModal
          produto={modalProduto}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </Layout>
  )
}

export default Busca
