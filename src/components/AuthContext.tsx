import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../utils/api'

type User = {
  id: string
  nome: string
  email: string
  user_type: 'cliente' | 'funcionario'
  role: 'cliente' | 'funcionario' | 'admin'
}

type AuthState = {
  user: User | null
  token: string | null
  login: (params: { email: string; senha: string; user_type: 'cliente' | 'funcionario' }) => Promise<void>
  logout: () => void
}

const Ctx = createContext<AuthState | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('auth_token')
    if (t) {
      setToken(t)
      apiFetch<User>('/auth/me').then(setUser).catch(() => {
        localStorage.removeItem('auth_token')
        setToken(null)
      })
    }
  }, [])

  const login = async ({ email, senha, user_type }: { email: string; senha: string; user_type: 'cliente' | 'funcionario' }) => {
    const res = await apiFetch<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha, user_type })
    })
    localStorage.setItem('auth_token', res.access_token)
    setToken(res.access_token)
    setUser(res.user)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setToken(null)
    setUser(null)
    window.location.href = '/'
  }

  const value = useMemo(() => ({ user, token, login, logout }), [user, token])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useAuth = (): AuthState => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}


