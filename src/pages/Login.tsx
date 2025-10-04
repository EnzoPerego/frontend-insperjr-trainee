import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../components/AuthContext'

const Login: React.FC = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [userType, setUserType] = useState<'cliente' | 'funcionario'>('cliente')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login({ email, senha, user_type: userType })
      
      // Verificar se há intenção de checkout
      const checkoutIntent = localStorage.getItem('checkoutIntent')
      if (checkoutIntent && userType === 'cliente') {
        localStorage.removeItem('checkoutIntent')
        window.location.href = checkoutIntent
        return
      }
      
      // Redirecionamento padrão
      if (userType === 'cliente') {
        window.location.href = '/'
      } else {
        window.location.href = '/admin/cardapio/entradas'
      }
    } catch (err: any) {
      setError(err?.message || 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <a href="/" className="text-3xl font-extrabold tracking-wide text-kaiserhaus-dark-brown hover:opacity-90 transition">
              KAISERHAUS
            </a>
            <p className="text-gray-600 mt-1">Área de acesso</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
            <div className="px-6 pt-6">
              <div className="flex rounded-lg p-1 bg-gray-100 text-sm font-medium w-full mb-5" role="tablist">
                <button
                  type="button"
                  onClick={() => setUserType('cliente')}
                  className={`flex-1 py-2 rounded-md transition ${userType === 'cliente' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('funcionario')}
                  className={`flex-1 py-2 rounded-md transition ${userType === 'funcionario' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Funcionário
                </button>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-gray-500 hover:text-gray-700">
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={senha}
                      onChange={e => setSenha(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 focus:border-kaiserhaus-dark-brown focus:ring-2 focus:ring-kaiserhaus-dark-brown/20 px-3 py-2 outline-none transition pr-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
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
                  {loading && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
                <div className="space-y-2 pb-6 text-sm">
                  <div className="text-center">
                    <span className="text-gray-500">Esqueceu a senha? Fale com o administrador.</span>
                  </div>
                  <div className="text-center">
                    <a href="/cadastro" className="text-kaiserhaus-dark-brown hover:underline">Criar conta como cliente</a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Login


