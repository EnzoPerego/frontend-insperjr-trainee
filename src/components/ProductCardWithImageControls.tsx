import React, { useState } from 'react'
import { resolveImageUrl } from '../lib/utils'

interface Produto {
  id: string
  titulo: string
  preco: number
  preco_promocional?: number
  descricao_capa?: string
  descricao_geral?: string
  descricao?: string
  image_url?: string
  acompanhamentos?: Array<{
    nome: string
    preco: number
  }>
}

interface ProductCardWithImageControlsProps {
  produto: Produto
  descricao?: string
  onAddToCart: (produto: Produto) => void
  onImageTransform?: (transform: { zoom: number; offsetX: number; offsetY: number }) => void
  showImageControls?: boolean
}

const ProductCardWithImageControls: React.FC<ProductCardWithImageControlsProps> = ({ 
  produto, 
  descricao, 
  onAddToCart,
  onImageTransform,
  showImageControls = false
}) => {
  const [imageZoom, setImageZoom] = useState<number>(1)
  const [imageOffset, setImageOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  const preco = produto.preco_promocional || produto.preco
  const descricaoFinal = descricao || produto.descricao_capa || produto.descricao_geral || produto.descricao || "Descrição do produto"

  const handleImageTransform = (zoom: number, offset: { x: number; y: number }) => {
    if (onImageTransform) {
      onImageTransform({ zoom, offsetX: offset.x, offsetY: offset.y })
    }
  }

  const updateZoom = (newZoom: number) => {
    setImageZoom(newZoom)
    handleImageTransform(newZoom, imageOffset)
  }

  const updateOffset = (newOffset: { x: number; y: number }) => {
    setImageOffset(newOffset)
    handleImageTransform(imageZoom, newOffset)
  }

  const resetImage = () => {
    setImageZoom(1)
    setImageOffset({ x: 0, y: 0 })
    handleImageTransform(1, { x: 0, y: 0 })
  }

  return (
    <article className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col" style={{ minHeight: '450px' }}>
      <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center overflow-hidden">
        {produto.image_url ? (
          <div
            className="relative w-full h-full overflow-hidden select-none"
            onMouseDown={(e) => {
              if (!showImageControls) return
              setDragging(true)
              setDragStart({ x: e.clientX - imageOffset.x, y: e.clientY - imageOffset.y })
            }}
            onMouseMove={(e) => {
              if (!dragging || !dragStart || !showImageControls) return
              updateOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
            }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onTouchStart={(e) => {
              if (!showImageControls) return
              const t = e.touches[0]
              setDragging(true)
              setDragStart({ x: t.clientX - imageOffset.x, y: t.clientY - imageOffset.y })
            }}
            onTouchMove={(e) => {
              if (!dragging || !dragStart || !showImageControls) return
              const t = e.touches[0]
              updateOffset({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y })
            }}
            onTouchEnd={() => setDragging(false)}
            onWheel={(e) => {
              if (!showImageControls) return
              e.preventDefault()
              const delta = e.deltaY > 0 ? -0.05 : 0.05
              const newZoom = Math.min(2, Math.max(1, parseFloat((imageZoom + delta).toFixed(2))))
              updateZoom(newZoom)
            }}
            onDragStart={(e) => { e.preventDefault() }}
            style={{ touchAction: 'none' }}
          >
            <img
              src={produto.image_url.startsWith('blob:') ? produto.image_url : resolveImageUrl(produto.image_url)}
              alt={produto.titulo}
              className="absolute w-full h-full object-cover"
              draggable={false}
              style={{
                transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(${imageZoom})`,
                transformOrigin: 'center center',
                cursor: showImageControls ? (dragging ? 'grabbing' : 'grab') : 'default',
                minWidth: '100%',
                minHeight: '100%',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        ) : (
          <span className="text-gray-500">Imagem {produto.titulo}</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
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
        <p className="text-sm text-gray-600 flex-grow mb-4 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}>
          {descricaoFinal}
        </p>
        <button 
          onClick={() => onAddToCart(produto)}
          className="text-sm text-kaiserhaus-dark-brown font-medium hover:text-kaiserhaus-light-brown transition"
        >
          Adicionar ao carrinho →
        </button>
      </div>

      {/* Controles de imagem - só aparecem quando showImageControls = true */}
      {showImageControls && produto.image_url && (
        <div className="p-4 border-t bg-gray-50 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Zoom</label>
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                className="px-2 py-1 border rounded text-xs" 
                onClick={() => updateZoom(Math.max(1, parseFloat((imageZoom - 0.05).toFixed(2))))}
              >
                -
              </button>
              <input
                type="range"
                min={1}
                max={2}
                step={0.01}
                value={imageZoom}
                onChange={(e) => updateZoom(parseFloat(e.target.value))}
                className="flex-1"
              />
              <button 
                type="button" 
                className="px-2 py-1 border rounded text-xs" 
                onClick={() => updateZoom(Math.min(2, parseFloat((imageZoom + 0.05).toFixed(2))))}
              >
                +
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Dica: arraste a imagem para reposicionar. Use a roda do mouse para zoom.</p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => updateOffset({ x: 0, y: 0 })}
              className="px-3 py-1.5 text-xs border rounded-md"
            >
              Centralizar
            </button>
            <button
              type="button"
              onClick={resetImage}
              className="px-3 py-1.5 text-xs border rounded-md"
            >
              Resetar imagem
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

export default ProductCardWithImageControls
