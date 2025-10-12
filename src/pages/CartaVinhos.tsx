import React, { useEffect, useRef, useState } from 'react'
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

  // refs para âncoras
  const topRef = useRef<HTMLDivElement>(null)
  const tintosRef = useRef<HTMLElement>(null)
  const brancosRef = useRef<HTMLElement>(null)
  const roseRef = useRef<HTMLElement>(null)


  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const cats = await apiFetch<Categoria[]>('/categorias')
        const prods = await apiFetch<Produto[]>('/produtos')
        setCategorias(cats || [])
        setProdutos(prods || [])
      } catch (err) {
        console.error('Erro ao carregar Carta de Vinhos:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  /* helpers de categoria / agrupamento */
  const getProdutoCategoriaId = (p: Produto) =>
    (p as any).categoria_id ?? (p as any).categoriaId ?? p.categoria?.id ?? ''

  const produtosPorCategoria: Record<string, Produto[]> = {}
  produtos.forEach((p) => {
    const catId = String(getProdutoCategoriaId(p) || 'uncategorized')
    if (!produtosPorCategoria[catId]) produtosPorCategoria[catId] = []
    produtosPorCategoria[catId].push(p)
  })

  const findCategoriaByName = (namePart: string) =>
    categorias.find((c) => String(c.nome).toLowerCase().includes(namePart.toLowerCase()))

  const getProdutosByCategory = (categoryName: string): Produto[] => {
    const categoria = findCategoriaByName(categoryName)
    if (!categoria) return []
    return produtosPorCategoria[String(categoria.id)] || []
  }

  const produtosTintos: Produto[] = getProdutosByCategory('tinto')
  const produtosBrancos: Produto[] = getProdutosByCategory('branco')
  const produtosRose: Produto[] = getProdutosByCategory('rosé')

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

  /* scroll helpers (âncoras) */
  const scrollToRef = (r: React.RefObject<HTMLElement | HTMLDivElement | null>) => {
    const el = r.current
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const scrollToTop = () => scrollToRef(topRef)


  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kaiserhaus-dark-brown mx-auto" />
            <p className="mt-4 text-kaiserhaus-dark-brown">Carregando carta de vinhos...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div ref={topRef} className="min-h-screen bg-white py-10">
        {/* Header normal (rola com a página) */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-4">
            {/* Top header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="text-center sm:text-left">
                <a href="/cardapio" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }} className="text-kaiserhaus-dark-brown hover:underline">Voltar ao cardápio</a>
              </div>

              <div className="text-center select-none" style={{ userSelect: 'none' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif' }} className="text-2xl sm:text-3xl font-extrabold tracking-wide">
                  Weinkarte
                </div>

                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16 }} className="mt-2 text-gray-900 select-none">
                  Carta de Vinhos
                </div>
              </div>

              <div className="text-center sm:text-right">
                <a href="/Cardápio Trainee.pdf" target="_blank" rel="noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16 }} className="text-kaiserhaus-dark-brown hover:underline">
                  Ver cardápio em PDF
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo normal */}
        <div className="max-w-6xl mx-auto px-6 pt-8">

          {/* Vinhos Tintos */}
          <section ref={tintosRef} id="tintos" className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-kaiserhaus-dark-brown mr-4"></div>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 35 }} className="font-bold text-kaiserhaus-dark-brown">Vinhos Tintos</h2>
              </div>
            </div>

            <hr className="border-t border-gray-200 mb-6" />

            {produtosTintos.length === 0 ? (
              <p className="text-gray-600">Nenhum vinho tinto cadastrado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {produtosTintos.map((p) => (
                  <ProductCardWrapper
                    key={String(p.id)}
                    produto={p}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Vinhos Brancos */}
          <section ref={brancosRef} id="brancos" className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-kaiserhaus-dark-brown mr-4"></div>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 35 }} className="font-bold text-kaiserhaus-dark-brown">Vinhos Brancos</h2>
              </div>
            </div>

            <hr className="border-t border-gray-200 mb-6" />

            {produtosBrancos.length === 0 ? (
              <p className="text-gray-600">Nenhum vinho branco cadastrado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {produtosBrancos.map((p) => (
                  <ProductCardWrapper
                    key={String(p.id)}
                    produto={p}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Vinhos Rosé */}
          <section ref={roseRef} id="rose" className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-kaiserhaus-dark-brown mr-4"></div>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 35 }} className="font-bold text-kaiserhaus-dark-brown">Vinhos Rosé</h2>
              </div>
            </div>

            <hr className="border-t border-gray-200 mb-6" />

            {produtosRose.length === 0 ? (
              <p className="text-gray-600">Nenhum vinho rosé cadastrado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {produtosRose.map((p) => (
                  <ProductCardWrapper
                    key={String(p.id)}
                    produto={p}
                  />
                ))}
              </div>
            )}
          </section>

          <div style={{ height: 100 }} />
        </div>

        {/* botão "Voltar ao topo" FIXO */}
        <div style={{ zIndex: 60 }} className="fixed left-1/2 transform -translate-x-1/2 bottom-6">
          <button onClick={scrollToTop} className="px-6 py-3 rounded-md bg-gray-100 shadow" aria-label="Voltar ao topo">
            Voltar ao topo
          </button>
        </div>

        {/* Modal do produto */}
        {modalProduto && <ProductModal produto={modalProduto} isOpen={isModalOpen} onClose={closeProductModal} />}
      </div>
    </Layout>
  )
}

export default CartaVinhos
