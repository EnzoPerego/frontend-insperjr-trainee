import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../utils/api'

const RedefinirSenha: React.FC = () => {
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // vai ppegar token da url
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    }
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // validacao
    if (!token) {
      setError('Token não encontrado na URL')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    
    try {
      await apiFetch('/auth/redefinir-senha', {
        method: 'POST',
        body: JSON.stringify({ 
          token, 
          new_password: newPassword 
        })
      })
      
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message || 'Erro ao redefinir senha')
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
              <p className="text-gray-600 mt-1">Senha redefinida</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Senha redefinida!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
                </p>

                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full bg-kaiserhaus-dark-brown text-white py-3 px-4 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
                >
                  Ir para Login
                </button>
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
            <p className="text-gray-600 mt-1">Redefinir senha</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
            <form onSubmit={onSubmit} className="px-6 py-6">
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-kaiserhaus-dark-brown text-white py-3 px-4 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Redefinindo...' : 'Redefinir senha'} 
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

export default RedefinirSenha
