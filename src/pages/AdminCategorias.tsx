import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { apiFetch } from '../utils/api'

type Categoria = { id: string; nome: string }

export default function AdminCategorias(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<string>('categorias')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const data = await apiFetch<Categoria[]>('/categorias')
      setCategorias(data)
    } catch (e: any) {
      setError(e?.message || 'Falha ao carregar categorias')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const addCategoria = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await apiFetch('/categorias', { method: 'POST', body: JSON.stringify({ nome }) })
      setNome('')
      await load()
    } catch (e: any) {
      setError(e?.message || 'Erro ao adicionar categoria')
    } finally {
      setLoading(false)
    }
  }

  const deleteCategoria = async (id: string) => {
    if (!confirm('Remover esta categoria?')) return
    try {
      await apiFetch(`/categorias/${id}`, { method: 'DELETE' })
      await load()
    } catch (e: any) {
      alert(e?.message || 'Erro ao remover categoria')
    }
  }

  return (
    <AdminLayout title="Categorias" activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="space-y-6">
        <div className="bg-white rounded-lg border shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Adicionar nova categoria</h2>
          <form onSubmit={addCategoria} className="flex gap-2">
            <input className="flex-1 border rounded p-2" placeholder="Nome da categoria" value={nome} onChange={e => setNome(e.target.value)} required />
            <button disabled={loading} className="px-4 py-2 bg-kaiserhaus-dark-brown text-white rounded">
              {loading ? 'Adicionando...' : 'Adicionar'}
            </button>
          </form>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Cards Mobile (sm) */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {categorias.map((c) => (
            <div key={c.id} className="bg-white rounded-lg border shadow-sm p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{c.nome}</span>
                <button 
                  onClick={() => deleteCategoria(c.id)} 
                  className="px-3 py-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-md text-sm font-medium transition-colors"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
          {categorias.length === 0 && (
            <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
              <p className="text-gray-500">Nenhuma categoria cadastrada.</p>
            </div>
          )}
        </div>

        {/* Tabela Desktop/Tablet (md+) */}
        <div className="hidden md:block bg-white rounded-lg border shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Categorias existentes</h2>
          </div>
          <ul className="divide-y">
            {categorias.map((c) => (
              <li key={c.id} className="flex items-center justify-between p-4">
                <span>{c.nome}</span>
                <button onClick={() => deleteCategoria(c.id)} className="text-red-600 hover:underline">Remover</button>
              </li>
            ))}
            {categorias.length === 0 && (
              <li className="p-4 text-gray-500">Nenhuma categoria cadastrada.</li>
            )}
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}


