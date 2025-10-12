import React, { useState } from 'react'

type Props = {
  title: string
  descricaoCapa?: string
  precoDisplay: string
  previewSrc?: string
  placeholderChar?: string
}

export default function ProductImagePreview({ title, descricaoCapa, precoDisplay, previewSrc, placeholderChar = '?' }: Props): React.JSX.Element {
  const [imageZoom, setImageZoom] = useState<number>(1)
  const [imageOffset, setImageOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  const hasImage = Boolean(previewSrc)

  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-card">
      <div
        className="relative w-full aspect-[16/10] bg-gray-200 overflow-hidden select-none"
        onMouseDown={(e) => {
          if (!hasImage) return
          setDragging(true)
          setDragStart({ x: e.clientX - imageOffset.x, y: e.clientY - imageOffset.y })
        }}
        onMouseMove={(e) => {
          if (!dragging || !dragStart) return
          setImageOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
        }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={(e) => {
          if (!hasImage) return
          const t = e.touches[0]
          setDragging(true)
          setDragStart({ x: t.clientX - imageOffset.x, y: t.clientY - imageOffset.y })
        }}
        onTouchMove={(e) => {
          if (!dragging || !dragStart) return
          const t = e.touches[0]
          setImageOffset({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y })
        }}
        onTouchEnd={() => setDragging(false)}
        onWheel={(e) => {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -0.05 : 0.05
          setImageZoom((z) => Math.min(2, Math.max(1, parseFloat((z + delta).toFixed(2)))))
        }}
        onDragStart={(e) => { e.preventDefault() }}
        style={{ touchAction: 'none' }}
      >
        {hasImage ? (
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Pré-visualização"
              className="absolute"
              draggable={false}
              style={{
                transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(${imageZoom})`,
                transformOrigin: 'center center',
                cursor: dragging ? 'grabbing' : 'grab',
                minWidth: '100%',
                minHeight: '100%',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">{placeholderChar}</span>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title || 'Título do produto'}</h3>
        <p className="mt-1.5 text-sm sm:text-base text-gray-600 line-clamp-2 min-h-[48px]">{descricaoCapa || 'Descrição do produto'}</p>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="font-semibold text-kaiserhaus-light-brown text-lg text-center sm:text-left">
            {precoDisplay}
          </span>
          <button
            type="button"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown hover:bg-kaiserhaus-dark-brown hover:text-white transition-colors"
            disabled
          >
            Adicionar ao carrinho
            <svg
              className="w-4 h-4 transform group-hover:translate-x-0.5 transition"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        {/* Controles de imagem */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Zoom</label>
            <div className="flex items-center gap-2">
              <button type="button" className="w-8 h-8 sm:w-10 sm:h-10 px-2 py-1 border rounded text-sm sm:text-base flex items-center justify-center" onClick={() => setImageZoom(z => Math.max(1, parseFloat((z - 0.05).toFixed(2))))}>-</button>
              <input
                type="range"
                min={1}
                max={2}
                step={0.01}
                value={imageZoom}
                onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                className="flex-1 h-2"
              />
              <button type="button" className="w-8 h-8 sm:w-10 sm:h-10 px-2 py-1 border rounded text-sm sm:text-base flex items-center justify-center" onClick={() => setImageZoom(z => Math.min(2, parseFloat((z + 0.05).toFixed(2))))}>+</button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Dica: arraste a imagem para reposicionar. Use a roda do mouse para zoom.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setImageOffset({ x: 0, y: 0 })}
              className="w-full sm:w-auto px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
            >
              Centralizar
            </button>
            <button
              type="button"
              onClick={() => { setImageZoom(1); setImageOffset({ x: 0, y: 0 }) }}
              className="w-full sm:w-auto px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
            >
              Resetar imagem
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


