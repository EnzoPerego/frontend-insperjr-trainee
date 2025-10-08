import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../utils/api'
import ProductModal from '../components/ProductModal'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { Produto, Categoria } from '../types'

const Cardapio1: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [modalProduto, setModalProduto] = useState<Produto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar categorias
        const categoriasData = await apiFetch<Categoria[]>('/categorias')
        setCategorias(categoriasData)
        
        // Carregar produtos
        const produtosData = await apiFetch<Produto[]>('/produtos')
        setProdutos(produtosData.filter(p => p.categoria && p.categoria.id))
        
        // Selecionar primeira categoria por padrão
        if (categoriasData.length > 0) {
          setCategoriaSelecionada(categoriasData[0].id)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleOpenProductModal = (produto: Produto) => {
    setModalProduto(produto)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalProduto(null)
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const produtosFiltrados = categoriaSelecionada 
    ? produtos.filter(p => p.categoria?.id === categoriaSelecionada)
    : produtos

  // Agrupar produtos por categoria
  const produtosPorCategoria = categorias.reduce((acc, categoria) => {
    const produtosDaCategoria = produtos.filter(p => p.categoria?.id === categoria.id)
    if (produtosDaCategoria.length > 0) {
      acc[categoria.id] = {
        categoria,
        produtos: produtosDaCategoria
      }
    }
    return acc
  }, {} as Record<string, { categoria: Categoria; produtos: Produto[] }>)

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kaiserhaus-dark-brown mx-auto"></div>
            <p className="mt-4 text-kaiserhaus-dark-brown">Carregando cardápio...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Header do Cardápio */}
        <div className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <p className="text-kaiserhaus-dark-brown text-sm font-medium mb-2">Carta de Vinhos</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">Speisekarte</h1>
                <p className="text-lg text-gray-900">Cardápio</p>
              </div>
              <div className="mt-4 md:mt-0">
                <a href="#" className="text-kaiserhaus-dark-brown hover:text-kaiserhaus-light-brown transition-colors text-sm font-medium">
                  Ver cardápio em pdf
                </a>
              </div>
            </div>

            {/* Filtros de Categoria */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button 
                onClick={() => setCategoriaSelecionada('')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  categoriaSelecionada === '' 
                    ? 'text-kaiserhaus-dark-brown border-b-2 border-kaiserhaus-dark-brown' 
                    : 'text-gray-600 hover:text-kaiserhaus-dark-brown'
                }`}
              >
                Todos
              </button>
              {categorias.map((categoria) => (
                <button 
                  key={categoria.id}
                  onClick={() => setCategoriaSelecionada(categoria.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    categoriaSelecionada === categoria.id 
                      ? 'text-kaiserhaus-dark-brown border-b-2 border-kaiserhaus-dark-brown' 
                      : 'text-gray-600 hover:text-kaiserhaus-dark-brown'
                  }`}
                >
                  {categoria.nome}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seção de Produtos */}
        <div className="bg-white">
          <div className="container mx-auto px-4 pb-12">
            {categoriaSelecionada ? (
              // Mostrar produtos da categoria selecionada
              (() => {
                const categoria = categorias.find(c => c.id === categoriaSelecionada)
                const produtosCategoria = produtos.filter(p => p.categoria?.id === categoriaSelecionada)
                
                if (!categoria || produtosCategoria.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Nenhum produto encontrado nesta categoria.</p>
                    </div>
                  )
                }

                return (
                  <div key={categoria.id}>
                    <div className="flex items-center mb-8">
                      <div className="w-1 h-8 bg-kaiserhaus-dark-brown mr-4"></div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">I {categoria.nome}</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {produtosCategoria.map((produto) => (
                        <ProductCard
                          key={produto.id}
                          produto={produto}
                          onAddToCart={handleOpenProductModal}
                        />
                      ))}
                    </div>
                  </div>
                )
              })()
            ) : (
              // Mostrar todas as categorias
              Object.values(produtosPorCategoria).map(({ categoria, produtos: produtosCategoria }) => (
                <div key={categoria.id} className="mb-16">
                  <div className="flex items-center mb-8">
                    <div className="w-1 h-8 bg-kaiserhaus-dark-brown mr-4"></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">I {categoria.nome}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {produtosCategoria.map((produto) => (
                      <ProductCard
                        key={produto.id}
                        produto={produto}
                        onAddToCart={handleOpenProductModal}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* Botão Voltar ao Topo */}
            <div className="text-center mt-12">
              <button 
                onClick={handleScrollToTop}
                className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
              >
                Voltar ao topo ↑
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* Modal do Produto */}
        {modalProduto && (
          <ProductModal
            produto={modalProduto}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </Layout>
  )
}

export default Cardapio1
