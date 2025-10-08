import React from 'react'
import { resolveImageUrl } from '../lib/utils'

interface Produto {
  id: string
  titulo: string
  preco: number
  preco_promocional?: number
  descricao_geral?: string
  descricao?: string
  image_url?: string
  acompanhamentos?: Array<{
    nome: string
    preco: number
  }>
}

interface ProductCardProps {
  produto: Produto
  descricao?: string
  onAddToCart: (produto: Produto) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  produto, 
  descricao, 
  onAddToCart 
}) => {
  const preco = produto.preco_promocional || produto.preco
  const descricaoFinal = descricao || produto.descricao_geral || produto.descricao || "Descrição do produto"

  return (
    <article className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center overflow-hidden">
        {produto.image_url ? (
          <img
            src={resolveImageUrl(produto.image_url)}
            alt={produto.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">Imagem {produto.titulo}</span>
        )}
      </div>
      <div className="p-4 relative">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{produto.titulo}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-montserrat font-light text-kaiserhaus-dark-brown">
              {Math.floor(preco)}
            </span>
            {produto.preco_promocional && produto.preco_promocional !== produto.preco && (
              <span className="text-lg font-montserrat font-light text-gray-500 line-through">
                {Math.floor(produto.preco)}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-8">
          {descricaoFinal}
        </p>
        <button 
          onClick={() => onAddToCart(produto)}
          className="absolute bottom-4 left-4 text-sm text-kaiserhaus-dark-brown font-medium hover:text-kaiserhaus-light-brown transition"
        >
          Adicionar ao carrinho →
        </button>
      </div>
    </article>
  )
}

export default ProductCard
