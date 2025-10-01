import React, { useEffect, useMemo, useState } from 'react'
import AdminLayout from './AdminLayout'
import { apiFetch } from '../utils/api'
import { config } from '../config'

type Props = {
  title: string
  categoriaNome: string
  onSuccessRedirect: string
}

export default function AddProductForm({ title, categoriaNome, onSuccessRedirect }: Props): React.JSX.Element {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descricaoCapa, setDescricaoCapa] = useState('')
  const [descricaoGeral, setDescricaoGeral] = useState('')
  const [precoInput, setPrecoInput] = useState('')
  const [acompanhamentos, setAcompanhamentos] = useState<Array<{ nome: string; precoInput: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categoriaId, setCategoriaId] = useState<string | null>(null)
  // Controles de imagem (pré-visualização)
  const [imageZoom, setImageZoom] = useState<number>(1)
  const [imageOffset, setImageOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  // Buscar ID real da categoria por nome
  useEffect(() => {
    const loadCategoria = async () => {
      try {
        const categorias = await apiFetch<Array<{ id: string; nome: string }>>('/categorias')
        const found = categorias.find(c => c.nome.toLowerCase() === categoriaNome.toLowerCase())
        if (!found) {
          setError(`Categoria '${categoriaNome}' não encontrada`)
        } else {
          setCategoriaId(found.id)
        }
      } catch (e: any) {
        setError(e?.message || 'Falha ao carregar categorias')
      }
    }
    loadCategoria()
  }, [categoriaNome])

  // Helpers de preço (máscara em BRL)
  const onlyDigits = (v: string) => (v || '').replace(/\D+/g, '')
  const formatBRL = (digits: string) => {
    const n = Number(digits || '0')
    return (n / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  const precoNumber = useMemo(() => Number(onlyDigits(precoInput)) / 100, [precoInput])

  const addAcompanhamento = () => setAcompanhamentos(prev => [...prev, { nome: '', precoInput: '' }])
  const updateAcomp = (idx: number, field: 'nome' | 'precoInput', value: string) => {
    setAcompanhamentos(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a))
  }
  const removeAcomp = (idx: number) => setAcompanhamentos(prev => prev.filter((_, i) => i !== idx))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (!categoriaId) throw new Error('Categoria não carregada')
      let finalImageUrl = ''
      if (imageFile) {
        const form = new FormData()
        form.append('file', imageFile)
        const res = await fetch(`${config.API_BASE_URL}/files/upload`, { method: 'POST', body: form })
        if (!res.ok) throw new Error('Falha no upload da imagem')
        const data = await res.json()
        finalImageUrl = data.url
      }
      const body = {
        categoria_id: categoriaId,
        titulo,
        descricao_capa: descricaoCapa,
        descricao_geral: descricaoGeral,
        image_url: finalImageUrl || undefined,
        preco: precoNumber,
        status: 'Ativo',
        estrelas_kaiserhaus: false,
        acompanhamentos: acompanhamentos
          .filter(a => a.nome && a.precoInput)
          .map(a => ({ nome: a.nome, preco: Number(onlyDigits(a.precoInput)) / 100 }))
      }
      await apiFetch('/produtos', { method: 'POST', body: JSON.stringify(body) })
      window.location.href = onSuccessRedirect
    } catch (err: any) {
      setError(err?.message || 'Erro ao adicionar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title={`Adicionar ${title}`}>
      <div className="bg-white rounded-2xl shadow border p-6">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            {/* Pré-visualização do card do produto */}
            <div className="bg-white border rounded-2xl overflow-hidden shadow-card">
              <div
                className="relative w-full aspect-[16/10] bg-gray-200 overflow-hidden select-none"
                onMouseDown={(e) => {
                  if (!imageFile) return
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
                  if (!imageFile) return
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
              >
                {imageFile ? (
                  <div className="absolute inset-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Pré-visualização"
                      className="absolute"
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
                    <span className="text-gray-500 text-sm font-medium">{titulo.charAt(0) || '?'}</span>
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{titulo || 'Título do produto'}</h3>
                <p className="mt-1.5 text-sm sm:text-base text-gray-600 line-clamp-2 min-h-[48px]">{descricaoCapa || 'Descrição do produto'}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-kaiserhaus-light-brown text-lg">
                    {precoInput ? formatBRL(onlyDigits(precoInput)) : 'R$ 0,00'}
                  </span>
                  <button
                    type="button"
                    className="group inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown"
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
                    <input
                      type="range"
                      min={1}
                      max={2}
                      step={0.01}
                      value={imageZoom}
                      onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Posição X</label>
                      <input
                        type="range"
                        min={-150}
                        max={150}
                        step={1}
                        value={imageOffset.x}
                        onChange={(e) => setImageOffset((prev) => ({ ...prev, x: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Posição Y</label>
                      <input
                        type="range"
                        min={-150}
                        max={150}
                        step={1}
                        value={imageOffset.y}
                        onChange={(e) => setImageOffset((prev) => ({ ...prev, y: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => { setImageZoom(1); setImageOffset({ x: 0, y: 0 }) }}
                      className="px-3 py-1.5 text-sm border rounded-md"
                    >
                      Resetar imagem
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Pré-visualização do produto</p>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Imagem do produto</label>
              <label className="w-full flex items-center justify-between gap-3 border rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-white border flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-700">
                    {imageFile ? imageFile.name : 'Clique para escolher uma imagem do seu computador'}
                  </div>
                </div>
                <span className="text-sm px-3 py-1.5 bg-kaiserhaus-dark-brown text-white rounded-md">Selecionar</span>
                <input className="hidden" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              </label>
              <p className="text-xs text-gray-500 mt-1">Formatos suportados: JPG, PNG, WEBP. Máx 5MB.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input className="w-full border rounded p-2" value={titulo} onChange={e => setTitulo(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição da capa</label>
              <input className="w-full border rounded p-2" value={descricaoCapa} onChange={e => setDescricaoCapa(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição do produto</label>
              <input className="w-full border rounded p-2" value={descricaoGeral} onChange={e => setDescricaoGeral(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preço</label>
              <input
                inputMode="numeric"
                className="w-full border rounded p-2"
                placeholder="R$ 0,00"
                value={formatBRL(onlyDigits(precoInput))}
                onChange={(e) => setPrecoInput(onlyDigits(e.target.value))}
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <label className="block text-sm font-semibold">Acompanhamentos</label>
                  <p className="text-xs text-gray-500">Opcional. Adicione itens extras com nome e preço.</p>
                </div>
                <button
                  type="button"
                  onClick={addAcompanhamento}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown rounded-md hover:bg-kaiserhaus-dark-brown hover:text-white transition"
                >
                  + Adicionar
                </button>
              </div>

              <div className="rounded-lg border bg-gray-50 p-3 space-y-3">
                {acompanhamentos.length === 0 && (
                  <div className="text-sm text-gray-600">Nenhum acompanhamento adicionado.</div>
                )}

                {acompanhamentos.map((a, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-start">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
                      <input
                        className="w-full border rounded p-2"
                        placeholder={`Ex.: Molho extra ${idx+1}`}
                        value={a.nome}
                        onChange={e => updateAcomp(idx, 'nome', e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Preço</label>
                      <input
                        inputMode="numeric"
                        className="w-full border rounded p-2"
                        placeholder="R$ 0,00"
                        value={formatBRL(onlyDigits(a.precoInput))}
                        onChange={e => updateAcomp(idx, 'precoInput', onlyDigits(e.target.value))}
                      />
                    </div>
                    <div className="sm:col-span-1 flex sm:justify-end">
                      <button
                        type="button"
                        onClick={() => removeAcomp(idx)}
                        className="w-full sm:w-auto px-3 py-2 rounded-md border text-red-600 border-red-200 hover:bg-red-50 transition text-sm"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            <button disabled={loading || !categoriaId} className="w-full md:w-auto px-4 py-2 bg-kaiserhaus-dark-brown text-white rounded hover:opacity-90 disabled:opacity-60">
              {loading ? 'Salvando...' : (!categoriaId ? 'Carregando categoria...' : 'Adicionar Produto')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}


