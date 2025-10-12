import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../utils/api'
import ProductModal from '../components/ProductModal'
import ProductCard from '../components/ProductCard'
import { Produto, Categoria } from '../types'

const CartaVinhos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // modal
  const [modalProduto, setModalProduto] = useState<Produto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const cats = await apiFetch<Categoria[]>('/categorias')
        const prods = await apiFetch<Produto[]>('/produtos')
        setCategorias(cats || [])
        
 
        const categoriaVinhos = cats?.find(c => c.nome.toLowerCase().includes('vinho'))
        const vinhos = prods?.filter(p => p.categoria?.id === categoriaVinhos?.id) || []
        setProdutos(vinhos)
      } catch (err) {
        console.error('Erro ao carregar Carta de Vinhos:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  /* modal handlers */
  const openProductModal = (p: Produto) => {
    setModalProduto(p)
    setIsModalOpen(true)
  }
  const closeProductModal = () => {
    setModalProduto(null)
    setIsModalOpen(false)
  }

  /* wrapper para ProductCard */
  const ProductCardWrapper = ({ produto }: { produto: Produto }) => {
    const handleAddToCart = (produto: any) => {
      openProductModal(produto)
    }
    
    return (
      <ProductCard
        produto={produto as any}
        descricao={(produto as any).descricao_capa || produto.descricao_geral || (produto as any).descricao || "Descrição do produto"}
        onAddToCart={handleAddToCart}
      />
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kaiserhaus-dark-brown mx-auto"></div>
            <p className="mt-4 text-kaiserhaus-dark-brown">Carregando carta de vinhos...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white py-10">
        
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-4">
            {/* Top header */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-1/3 text-left">
                <a href="/cardapio" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }} className="text-black hover:underline">
                  Voltar ao cardápio
                </a>
              </div>

              <div className="w-1/3 text-center select-none" style={{ userSelect: 'none' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif' }} className="text-3xl font-extrabold tracking-wide">
                  Weinkarte
                </div>

                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }} className="mt-2 text-gray-900 select-none">
                  Carta de Vinhos
                </div>
              </div>

              <div className="w-1/3 text-right">
                <a href="/Cardápio Trainee.pdf" target="_blank" rel="noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }} className="text-black hover:underline">
                  Ver cardápio em PDF
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo com padding para compensar o header fixo */}
        <div className="max-w-6xl mx-auto px-6 pt-8">

     
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-kaiserhaus-dark-brown mr-4"></div>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 35 }} className="font-bold text-kaiserhaus-dark-brown">Vinhos</h2>
              </div>
            </div>
                    
            <hr className="border-t border-gray-200 mb-6" />

            {produtos.length === 0 ? (
              <p className="text-gray-600">Nenhum vinho cadastrado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtos.map(produto => (
                  <ProductCardWrapper key={produto.id} produto={produto} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modal de produto */}
      {isModalOpen && modalProduto && (
        <ProductModal
          produto={modalProduto}
          isOpen={isModalOpen}
          onClose={closeProductModal}
          onAddToCart={(quantidade) => {
           
            console.log('Adicionar ao carrinho:', modalProduto.titulo, quantidade)
          }}
        />
      )}
    </Layout>
  )
}

export default CartaVinhos