import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { apiFetch } from '../utils/api'

export default function AdminAddFuncionario(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<string>('funcionarios')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cpf, setCpf] = useState('')
  const [status, setStatus] = useState<'funcionario' | 'admin'>('funcionario')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCpf = (v: string) =>
    v
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const body = { nome, email, senha, cpf: cpf.replace(/\D/g, ''), status }
      await apiFetch('/funcionarios', { method: 'POST', body: JSON.stringify(body) })
      window.location.href = '/admin/funcionarios'
    } catch (err: any) {
      setError(err?.message || 'Falha ao criar funcionário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Adicionar Funcionário" activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Novo Funcionário</h1>
          <a href="/admin/funcionarios" className="text-sm text-blue-700 hover:underline">Voltar</a>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input className="w-full border rounded p-2" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <input type="password" className="w-full border rounded p-2" value={senha} onChange={e => setSenha(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPF</label>
              <input className="w-full border rounded p-2" value={cpf} onChange={e => setCpf(formatCpf(e.target.value))} placeholder="000.000.000-00" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Perfil</label>
              <select className="w-full border rounded p-2" value={status} onChange={e => setStatus(e.target.value as any)}>
                <option value="funcionario">Funcionário</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && <div className="md:col-span-2 text-sm text-red-600">{error}</div>}

            <div className="md:col-span-2">
              <button disabled={loading} className="px-4 py-2 bg-kaiserhaus-dark-brown text-white rounded hover:opacity-90 disabled:opacity-60">
                {loading ? 'Salvando...' : 'Criar Funcionário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}


