import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { apiFetch } from '../utils/api'

export default function AdminAddFuncionario(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<string>('adicionar')
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

        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <form onSubmit={onSubmit} className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-kaiserhaus-dark-brown transition-colors" 
                value={nome} 
                onChange={e => setNome(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-kaiserhaus-dark-brown transition-colors" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-kaiserhaus-dark-brown transition-colors" 
                value={senha} 
                onChange={e => setSenha(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-kaiserhaus-dark-brown transition-colors" 
                value={cpf} 
                onChange={e => setCpf(formatCpf(e.target.value))} 
                placeholder="000.000.000-00" 
                required 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-kaiserhaus-dark-brown transition-colors" 
                value={status} 
                onChange={e => setStatus(e.target.value as any)}
              >
                <option value="funcionario">Funcionário</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && <div className="md:col-span-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

            <div className="md:col-span-2 pt-2">
              <button 
                disabled={loading} 
                className="w-full md:w-auto px-6 py-3 bg-kaiserhaus-dark-brown text-white rounded-lg hover:bg-kaiserhaus-light-brown transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Salvando...' : 'Criar Funcionário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}


