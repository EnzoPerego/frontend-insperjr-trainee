import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { apiFetch } from '../utils/api'

type Funcionario = {
  id: string
  nome: string
  email: string
  status: 'funcionario' | 'admin'
  cpf?: string
  created_at?: string
}

export default function AdminFuncionarios(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<string>('gerenciar')
  const [items, setItems] = useState<Funcionario[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const getPerfilColor = (perfil: 'funcionario' | 'admin'): string => {
    return perfil === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiFetch<Funcionario[]>('/funcionarios')
        setItems(data)
      } catch (e: any) {
        setError(e?.message || 'Falha ao carregar funcionários')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const deleteFuncionario = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este funcionário?')) return
    try {
      await apiFetch(`/funcionarios/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(f => f.id !== id))
    } catch (e: any) {
      alert(e?.message || 'Falha ao excluir funcionário')
    }
  }

  return (
    <AdminLayout title="Gerenciar Funcionários" activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Funcionários</h1>
            <p className="text-gray-600 mt-1">Listagem e gerenciamento de acessos</p>
          </div>
          <a href="/admin/funcionarios/novo" className="px-4 py-2 bg-kaiserhaus-dark-brown text-white rounded-lg hover:bg-kaiserhaus-brown transition-colors font-medium">Adicionar Funcionário +</a>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaiserhaus-dark-brown"></div>
          </div>
        ) : (
          <>
            {/* Cards Mobile (sm) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {items.map((f) => (
                <div key={f.id} className="bg-white rounded-lg border shadow-sm p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{f.nome}</h3>
                      <p className="text-sm text-gray-600 truncate">{f.email}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1.5 rounded-md text-sm font-medium ml-2 flex-shrink-0 ${getPerfilColor(f.status)}`}>
                      {f.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Criado em:</span>
                      <span className="ml-2">{f.created_at ? new Date(f.created_at).toLocaleDateString('pt-BR') : '-'}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => deleteFuncionario(f.id)} 
                      className="px-3 py-1.5 rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
                  <p className="text-gray-500">Nenhum funcionário encontrado.</p>
                </div>
              )}
            </div>

            {/* Tabela Desktop/Tablet (md+) */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((f) => (
                      <tr key={f.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{f.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1.5 rounded-md text-sm font-medium ${getPerfilColor(f.status)}`}>
                            {f.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.created_at ? new Date(f.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button onClick={() => deleteFuncionario(f.id)} className="px-3 py-1.5 rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors">Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}


