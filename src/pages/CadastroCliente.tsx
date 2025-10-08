import React, { useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../utils/api'
import { formatPhoneBR, onlyDigits } from '../utils/phone'
import BackButton from '../components/BackButton'

const CadastroCliente: React.FC = () => {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch<{ access_token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nome, email, senha, telefone })
      })
      localStorage.setItem('auth_token', res.access_token)
      // redireciona para Home logado como cliente
      window.location.href = '/'
    } catch (err: any) {
      setError(err?.message || 'Falha no cadastro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md relative">
          <div className="text-center mb-6">
            <a href="/" className="text-3xl font-extrabold tracking-wide text-kaiserhaus-dark-brown hover:opacity-90 transition">
              KAISERHAUS
            </a>
            <p className="text-gray-600 mt-1">Criar conta de cliente</p>
          </div>

          {/* Botão de voltar para home */}
          <div className="mb-4">
            <BackButton />
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
            <div className="px-6 pt-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:border-kaiserhaus-dark-brown focus:ring-2 focus:ring-kaiserhaus-dark-brown/20 px-3 py-2 outline-none transition"
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:border-kaiserhaus-dark-brown focus:ring-2 focus:ring-kaiserhaus-dark-brown/20 px-3 py-2 outline-none transition"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone (opcional)</label>
                  <input
                    type="tel"
                    value={formatPhoneBR(telefone)}
                    onChange={e => setTelefone(onlyDigits(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 focus:border-kaiserhaus-dark-brown focus:ring-2 focus:ring-kaiserhaus-dark-brown/20 px-3 py-2 outline-none transition"
                    placeholder="(11) 90000-0000"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-gray-500 hover:text-gray-700">
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:border-kaiserhaus-dark-brown focus:ring-2 focus:ring-kaiserhaus-dark-brown/20 px-3 py-2 outline-none transition"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-kaiserhaus-dark-brown hover:bg-[#4b2f22] text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-70"
                >
                  {loading ? 'Cadastrando...' : 'Criar conta'}
                </button>

                <div className="text-center pb-6 text-sm">
                  <a href="/login" className="text-gray-600 hover:underline">Já tem conta? Fazer login</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CadastroCliente


