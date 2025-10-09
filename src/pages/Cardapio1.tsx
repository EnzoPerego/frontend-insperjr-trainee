import React, { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../utils/api'
import ProductModal from '../components/ProductModal'
import ProductCard from '../components/ProductCard'
import { Produto, Categoria } from '../types'

const Cardapio1: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // modal
  const [modalProduto, setModalProduto] = useState<Produto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // refs para âncoras
  const topRef = useRef<HTMLDivElement>(null)
  const entradasRef = useRef<HTMLElement>(null)
  const pratosRef = useRef<HTMLElement>(null)
  const sobremesasRef = useRef<HTMLElement>(null)
  const cervejasRef = useRef<HTMLElement>(null)
  const bebidasRef = useRef<HTMLElement>(null)

  // categoria ativa (IntersectionObserver)
  const [activeCategory, setActiveCategory] = useState<string>('')


  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const cats = await apiFetch<Categoria[]>('/categorias')
        const prods = await apiFetch<Produto[]>('/produtos')
        setCategorias(cats || [])
        setProdutos(prods || [])
      } catch (err) {
        console.error('Erro ao carregar Cardápio:', err)
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

  const produtosEntradas: Produto[] = getProdutosByCategory('entrada')
  const produtosPratos: Produto[] = getProdutosByCategory('prato')
  const produtosSobremesas: Produto[] = getProdutosByCategory('sobremesa')
  const produtosCervejas: Produto[] = getProdutosByCategory('cerveja')
  const produtosBebidas: Produto[] = getProdutosByCategory('bebida')

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
  const scrollToEntradas = () => scrollToRef(entradasRef)
  const scrollToPratos = () => scrollToRef(pratosRef)
  const scrollToSobremesas = () => scrollToRef(sobremesasRef)
  const scrollToCervejas = () => scrollToRef(cervejasRef)
  const scrollToBebidas = () => scrollToRef(bebidasRef)
  const scrollToTop = () => scrollToRef(topRef)

  /* IntersectionObserver pra destacar categoria ativa */
  useEffect(() => {
    const sections: { id: string; ref: React.RefObject<HTMLElement | HTMLDivElement | null> }[] = [
      { id: 'entradas', ref: entradasRef },
      { id: 'pratos', ref: pratosRef },
      { id: 'sobremesas', ref: sobremesasRef },
      { id: 'cervejas', ref: cervejasRef },
      { id: 'bebidas', ref: bebidasRef },
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) {
          setActiveCategory(visible.target.id)
        }
      },
      {
        root: null,
        threshold: [0.25, 0.4, 0.6],
        rootMargin: '0px 0px -30% 0px',
      }
    )

    sections.forEach((s) => {
      if (s.ref.current) observer.observe(s.ref.current)
    })

    return () => observer.disconnect()
  }, [produtos, categorias])

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
      <div ref={topRef} className="min-h-screen bg-white py-10">
        {/* Header fixo */}
        <div className="fixed top-16 left-0 right-0 bg-white z-40 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            {/* Top header */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-1/3 text-left">
                <a href="/carta-vinhos" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }} className="text-kaiserhaus-dark-brown hover:underline">Carta de vinhos</a>
              </div>

              <div className="w-1/3 text-center select-none" style={{ userSelect: 'none' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif' }} className="text-3xl font-extrabold tracking-wide">
                  Speisekarte
                </div>

                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }} className="mt-2 text-gray-900 select-none">
                  Cardápio
                </div>
              </div>

              <div className="w-1/3 text-right">
                <a href="/Cardápio Trainee.pdf" target="_blank" rel="noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }} className="text-kaiserhaus-dark-brown hover:underline">
                  Ver cardápio em PDF
                </a>
              </div>
            </div>

            {/* categorias (Montserrat 18) */}
            <div className="flex justify-center gap-8">
              <button
                onClick={scrollToEntradas}
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }}
                className={`${activeCategory === 'entradas' ? 'text-kaiserhaus-dark-brown font-bold border-b-2 border-kaiserhaus-dark-brown pb-1' : 'text-gray-700 font-normal'}`}
              >
                Entradas
              </button>

              <button
                onClick={scrollToPratos}
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }}
                className={`${activeCategory === 'pratos' ? 'text-kaiserhaus-dark-brown font-bold border-b-2 border-kaiserhaus-dark-brown pb-1' : 'text-gray-700 font-normal'}`}
              >
                Pratos
              </button>

              <button
                onClick={scrollToSobremesas}
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }}
                className={`${activeCategory === 'sobremesas' ? 'text-kaiserhaus-dark-brown font-bold border-b-2 border-kaiserhaus-dark-brown pb-1' : 'text-gray-700 font-normal'}`}
              >
                Sobremesas
              </button>

              <button
                onClick={scrollToCervejas}
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }}
                className={`${activeCategory === 'cervejas' ? 'text-kaiserhaus-dark-brown font-bold border-b-2 border-kaiserhaus-dark-brown pb-1' : 'text-gray-700 font-normal'}`}
              >
                Cervejas
              </button>

              <button
                onClick={scrollToBebidas}
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18 }}
                className={`${activeCategory === 'bebidas' ? 'text-kaiserhaus-dark-brown font-bold border-b-2 border-kaiserhaus-dark-brown pb-1' : 'text-gray-700 font-normal'}`}
              >
                Bebidas
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo com padding para compensar o header fixo */}
        <div className="max-w-6xl mx-auto px-6 pt-32">

          {/* Entradas */}
          <section ref={entradasRef} id="entradas" className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                      <div className="w-1 h-8 bg-kaiserhaus-dark-brown mr-4"></div>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 35 }} className="font-bold text-kaiserhaus-dark-brown">Entradas</h2>
              </div>
                    </div>
                    
            <hr className="border-t border-gray-200 mb-6" />

            {produtosEntradas.length === 0 ? (
              <p className="text-gray-600">Nenhuma entrada cadastrada.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {produtosEntradas.map((p) => (
                  <ProductCardWrapper
                    key={String(p.id)}
                    produto={p}
                        />
                      ))}
                    </div>
            )}
          </section>

          {/* Pratos */}
          <section ref={pratosRef} id="pratos" className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-kaiserhaus-dark-brown mr-4"></div>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 35 }} className="font-bold text-kaiserhaus-dark-brown">Pratos</h2>
                    </div>
                  </div>

            <hr className="border-t border-gray-200 mb-6" />

            {produtosPratos.length === 0 ? (
              <p className="text-gray-600">Nenhum prato cadastrado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {produtosPratos.map((p) => (
                  <ProductCardWrapper
                    key={String(p.id)}
                    produto={p}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Sobremesas */}
          <section ref={sobremesasRef} id="sobremesas" className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                    <div className="w-1 h-8 bg-kaiserhaus-dark-brown mr-4"></div>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 35 }} className="font-bold text-kaiserhaus-dark-brown">Sobremesas</h2>
              </div>
                  </div>
                  
            <hr className="border-t border-gray-200 mb-6" />

            {produtosSobremesas.length === 0 ? (
              <p className="text-gray-600">Nenhuma sobremesa cadastrada.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {produtosSobremesas.map((p) => (
                  <ProductCardWrapper
                    key={String(p.id)}
                    produto={p}
                      />
                    ))}
                  </div>
            )}
          </section>

          {/* Cervejas */}
          <section ref={cervejasRef} id="cervejas" className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-kaiserhaus-dark-brown mr-4"></div>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 35 }} className="font-bold text-kaiserhaus-dark-brown">Cervejas</h2>
              </div>
            </div>

            <hr className="border-t border-gray-200 mb-6" />

            {produtosCervejas.length === 0 ? (
              <p className="text-gray-600">Nenhuma cerveja cadastrada.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {produtosCervejas.map((p) => (
                  <ProductCardWrapper
                    key={String(p.id)}
                    produto={p}
                  />
                ))}
                </div>
            )}
          </section>

          {/* Bebidas */}
          <section ref={bebidasRef} id="bebidas" className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-kaiserhaus-dark-brown mr-4"></div>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 35 }} className="font-bold text-kaiserhaus-dark-brown">Bebidas</h2>
              </div>
              <a href="/carta-vinhos" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 20 }} className="text-kaiserhaus-dark-brown hover:underline">Carta de vinhos</a>
            </div>

            <hr className="border-t border-gray-200 mb-6" />

            {produtosBebidas.length === 0 ? (
              <p className="text-gray-600">Nenhuma bebida cadastrada.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {produtosBebidas.map((p) => (
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

export default Cardapio1
