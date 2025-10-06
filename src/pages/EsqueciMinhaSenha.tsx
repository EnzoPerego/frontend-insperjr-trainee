import React, { useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../utils/api'

const EsqueciMinhaSenha: React.FC = () => {
  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState<'cliente' | 'funcionario'>('cliente')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await apiFetch('/auth/esqueci-senha', {
        method: 'POST',
        body: JSON.stringify({ email, user_type: userType })
      })
      
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message || 'Erro ao solicitar reset de senha')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Layout showHeader={false} showFooter={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <a href="/" className="text-3xl font-extrabold tracking-wide text-kaiserhaus-dark-brown hover:opacity-90 transition">
                KAISERHAUS
              </a>
              <p className="text-gray-600 mt-1">Redefinir senha</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Email enviado!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Se o email <strong>{email}</strong> estiver cadastrado, você receberá instruções para redefinir sua senha.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Para teste:</strong> Verifique o console do backend para ver o token de reset.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full bg-kaiserhaus-dark-brown text-white py-3 px-4 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
                  >
                    Voltar ao Login
                  </button>
                  
                  <button
                    onClick={() => {
                      setSuccess(false)
                      setEmail('')
                      setError(null)
                    }}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Tentar outro email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <a href="/" className="text-3xl font-extrabold tracking-wide text-kaiserhaus-dark-brown hover:opacity-90 transition">
              KAISERHAUS
            </a>
            <p className="text-gray-600 mt-1">Esqueci minha senha</p>
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
            </div>

            <form onSubmit={onSubmit} className="px-6 pb-6">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent transition-all"
                  required
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-kaiserhaus-dark-brown text-white py-3 px-4 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar instruções'}
              </button>

              <div className="mt-4 text-center">
                <a 
                  href="/login" 
                  className="text-sm text-kaiserhaus-dark-brown hover:text-kaiserhaus-light-brown transition-colors"
                >
                  ← Voltar ao login
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default EsqueciMinhaSenha
