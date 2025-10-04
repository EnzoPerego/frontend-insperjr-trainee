import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../utils/api'
import ProductModal from '../components/ProductModal'

interface Produto {
  id: string
  titulo: string
  descricao?: string
  descricao_geral?: string
  preco: number
  preco_promocional?: number
  image_url?: string
  acompanhamentos?: Array<{
    nome: string
    preco: number
  }>
  categoria?: {
    id: string
    nome: string
  }
}

interface Categoria {
  id: string
  nome: string
}

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

  const produtosFiltrados = categoriaSelecionada 
    ? produtos.filter(p => p.categoria?.id === categoriaSelecionada)
    : produtos

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
      <div className="min-h-screen bg-white p-8">
        {/* TODO: Miguel vai fazer todo o cardapio aqui, fiz essas coisas nessa parte do cardapio so para funcionar a parte de juntar com o backend */}
        <h1>Cardápio</h1>
        
        {/* Filtros básicos */}
        <div className="mb-4">
          <button onClick={() => setCategoriaSelecionada('')}>Todos</button>
          {categorias.map((categoria) => (
            <button 
              key={categoria.id}
              onClick={() => setCategoriaSelecionada(categoria.id)}
              style={{ marginLeft: '10px' }}
            >
              {categoria.nome}
            </button>
          ))}
        </div>

        {/* Lista simples de produtos (miguel vai alterar as coisas depois) */}
        <div>
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <h3>{produto.titulo}</h3>
              <p>R$ {produto.preco_promocional || produto.preco}</p>
              <button onClick={() => handleOpenProductModal(produto)}>
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>

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
