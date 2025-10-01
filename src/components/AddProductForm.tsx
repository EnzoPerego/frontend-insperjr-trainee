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
  const [acompanhamentos, setAcompanhamentos] = useState<Array<{ nome: string; preco: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categoriaId, setCategoriaId] = useState<string | null>(null)

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

  const addAcompanhamento = () => setAcompanhamentos(prev => [...prev, { nome: '', preco: '' }])
  const updateAcomp = (idx: number, field: 'nome' | 'preco', value: string) => {
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
          .filter(a => a.nome && a.preco)
          .map(a => ({ nome: a.nome, preco: Number(a.preco) }))
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
            <div className="aspect-square w-full rounded-xl border border-dashed flex items-center justify-center bg-gray-50">
              {imageFile ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={URL.createObjectURL(imageFile)} alt="Pré-visualização" className="object-cover w-full h-full rounded-xl" />
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-6xl">🍽️</div>
                  <div className="mt-2 text-sm">Selecione uma imagem ao lado</div>
                </div>
              )}
            </div>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Acompanhamentos</label>
                <button type="button" onClick={addAcompanhamento} className="px-2 py-1 border rounded text-sm">Adicionar +</button>
              </div>
              {acompanhamentos.map((a, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <input className="sm:col-span-3 border rounded p-2" placeholder={`Acompanhamento ${idx+1}`} value={a.nome} onChange={e => updateAcomp(idx, 'nome', e.target.value)} />
                  <input type="number" step="0.01" className="sm:col-span-1 border rounded p-2" placeholder="Preço" value={a.preco} onChange={e => updateAcomp(idx, 'preco', e.target.value)} />
                  <button type="button" onClick={() => removeAcomp(idx)} className="sm:col-span-1 border rounded p-2">Remover</button>
                </div>
              ))}
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


