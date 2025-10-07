import React, { useEffect, useMemo, useState } from 'react'
import AdminLayout from './AdminLayout'
import { apiFetch } from '../utils/api'
import { config } from '../config'
import { resolveImageUrl } from '../lib/utils'
import ProductImagePreview from './ProductImagePreview'

type Props = {
  title: string
  categoriaNome: string
  onSuccessRedirect: string
  productId: string
}

export default function EditProductForm({ title, categoriaNome, onSuccessRedirect, productId }: Props): React.JSX.Element {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descricaoCapa, setDescricaoCapa] = useState('')
  const [descricaoGeral, setDescricaoGeral] = useState('')
  const [precoInput, setPrecoInput] = useState('')
  const [precoPromocionalInput, setPrecoPromocionalInput] = useState('')
  const [acompanhamentos, setAcompanhamentos] = useState<Array<{ nome: string; precoInput: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categoriaId, setCategoriaId] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('')

  // Controles de imagem moved to ProductImagePreview

  // Helpers de preço (máscara em BRL)
  const onlyDigits = (v: string) => (v || '').replace(/\D+/g, '')
  const formatBRL = (digits: string) => {
    const n = Number(digits || '0')
    return (n / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  const precoNumber = useMemo(() => Number(onlyDigits(precoInput)) / 100, [precoInput])
  const precoPromocionalNumber = useMemo(() => {
    const d = onlyDigits(precoPromocionalInput)
    return d ? Number(d) / 100 : undefined
  }, [precoPromocionalInput])

  const addAcompanhamento = () => setAcompanhamentos(prev => [...prev, { nome: '', precoInput: '' }])
  const updateAcomp = (idx: number, field: 'nome' | 'precoInput', value: string) => {
    setAcompanhamentos(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a))
  }
  const removeAcomp = (idx: number) => setAcompanhamentos(prev => prev.filter((_, i) => i !== idx))

  // Carregar produto e categoria por nome
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const categorias = await apiFetch<Array<{ id: string; nome: string }>>('/categorias')
        const found = categorias.find(c => c.nome.toLowerCase() === categoriaNome.toLowerCase())
        if (!found) {
          throw new Error(`Categoria '${categoriaNome}' não encontrada`)
        }
        setCategoriaId(found.id)

        const prod = await apiFetch<any>(`/produtos/${productId}`)
        setTitulo(prod.titulo || '')
        setDescricaoCapa(prod.descricao_capa || '')
        setDescricaoGeral(prod.descricao_geral || '')
        setCurrentImageUrl(prod.image_url || '')
        setPrecoInput(String(Math.round(Number(prod.preco || 0) * 100)))
        if (prod.preco_promocional != null) {
          setPrecoPromocionalInput(String(Math.round(Number(prod.preco_promocional) * 100)))
        } else {
          setPrecoPromocionalInput('')
        }
        const acomp = Array.isArray(prod.acompanhamentos) ? prod.acompanhamentos : []
        setAcompanhamentos(acomp.map((a: any) => ({ nome: a.nome || '', precoInput: String(Math.round(Number(a.preco || 0) * 100)) })))
      } catch (e: any) {
        setError(e?.message || 'Falha ao carregar produto')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [categoriaNome, productId])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (!categoriaId) throw new Error('Categoria não carregada')
      let finalImageUrl = currentImageUrl
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
        preco_promocional: precoPromocionalNumber,
        acompanhamentos: acompanhamentos
          .filter(a => a.nome && a.precoInput)
          .map(a => ({ nome: a.nome, preco: Number(onlyDigits(a.precoInput)) / 100 }))
      }
      await apiFetch(`/produtos/${productId}`, { method: 'PUT', body: JSON.stringify(body) })
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.location.href = onSuccessRedirect
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title={`Editar ${title}`}>
      <div className="bg-white rounded-2xl shadow border p-6">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProductImagePreview
              title={titulo}
              descricaoCapa={descricaoCapa}
              precoDisplay={precoInput ? formatBRL(onlyDigits(precoInput)) : 'R$ 0,00'}
              previewSrc={imageFile ? URL.createObjectURL(imageFile) : (currentImageUrl ? resolveImageUrl(currentImageUrl) : undefined)}
              placeholderChar={titulo.charAt(0) || '?'}
            />
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
                    {imageFile ? imageFile.name : (currentImageUrl ? 'Imagem carregada. Clique para trocar' : 'Clique para escolher uma imagem do seu computador')}
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
            <div>
              <label className="block text-sm font-medium mb-1">Preço promocional (opcional)</label>
              <input
                inputMode="numeric"
                className="w-full border rounded p-2"
                placeholder="R$ 0,00"
                value={formatBRL(onlyDigits(precoPromocionalInput))}
                onChange={(e) => setPrecoPromocionalInput(onlyDigits(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Deixe em branco para não aplicar promoção.</p>
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
              {loading ? 'Salvando...' : (!categoriaId ? 'Carregando categoria...' : 'Salvar alterações')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}


