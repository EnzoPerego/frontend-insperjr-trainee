import React from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Entradas from './pages/Entradas'
import Pratos from './pages/Pratos'
import Sobremesas from './pages/Sobremesas'
import Bebidas from './pages/Bebidas'
import Vinhos from './pages/Vinhos'
import PedidosPendentes from './pages/PedidosPendentes'
import PedidosConcluidos from './pages/PedidosConcluidos'
import './styles/globals.css'
import { AuthProvider, useAuth } from './components/AuthContext'
import Login from './pages/Login'
import CadastroCliente from './pages/CadastroCliente'

function AdminGuard({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { user } = useAuth()
  const currentPath: string = window.location.pathname
  const isAdminPath = currentPath.startsWith('/admin')
  // Fase de desenvolvimento: liberar acesso a /admin para todos
  // Para habilitar restrição somente admin, use o trecho abaixo:
  // if (isAdminPath && (!user || user.role !== 'admin')) {
  //   window.location.href = '/login'
  //   return <></>
  // }
  return <>{children}</>
}

function App(): React.JSX.Element {
  // Simulação de roteamento simples - em produção usar React Router
  const currentPath: string = window.location.pathname
  
  // Rotas do cardápio
  if (currentPath === '/admin/cardapio/entradas') {
    return (
      <AuthProvider>
        <AdminGuard>
          <Entradas />
        </AdminGuard>
      </AuthProvider>
    )
  }
  
  if (currentPath === '/admin/cardapio/pratos') {
    return (
      <AuthProvider>
        <AdminGuard>
          <Pratos />
        </AdminGuard>
      </AuthProvider>
    )
  }
  
  if (currentPath === '/admin/cardapio/sobremesas') {
    return (
      <AuthProvider>
        <AdminGuard>
          <Sobremesas />
        </AdminGuard>
      </AuthProvider>
    )
  }
  
  if (currentPath === '/admin/cardapio/bebidas') {
    return (
      <AuthProvider>
        <AdminGuard>
          <Bebidas />
        </AdminGuard>
      </AuthProvider>
    )
  }
  
  if (currentPath === '/admin/cardapio/vinhos') {
    return (
      <AuthProvider>
        <AdminGuard>
          <Vinhos />
        </AdminGuard>
      </AuthProvider>
    )
  }
  
  // Rotas de pedidos
  if (currentPath === '/admin/pedidos/pendentes') {
    return (
      <AuthProvider>
        <AdminGuard>
          <PedidosPendentes />
        </AdminGuard>
      </AuthProvider>
    )
  }
  
  if (currentPath === '/admin/pedidos/concluidos') {
    return (
      <AuthProvider>
        <AdminGuard>
          <PedidosConcluidos />
        </AdminGuard>
      </AuthProvider>
    )
  }
  
  if (currentPath === '/login') {
    return (
      <AuthProvider>
        <Login />
      </AuthProvider>
    )
  }

  if (currentPath === '/cadastro') {
    return (
      <AuthProvider>
        <CadastroCliente />
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <AdminGuard>
        <Layout>
          <Home />
        </Layout>
      </AdminGuard>
    </AuthProvider>
  )
}

export default App
