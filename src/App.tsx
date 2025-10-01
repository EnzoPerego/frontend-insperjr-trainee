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
import AdminAddProduto from './pages/AdminAddProduto'
import AdminCategorias from './pages/AdminCategorias'

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

  if (currentPath === '/admin/cardapio/entradas/novo') {
    return (
      <AuthProvider>
        <AdminGuard>
          <AdminAddProduto categoriaNome="Entradas" titulo="Entradas" redirect="/admin/cardapio/entradas" />
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

  if (currentPath === '/admin/cardapio/pratos/novo') {
    return (
      <AuthProvider>
        <AdminGuard>
          <AdminAddProduto categoriaNome="Pratos" titulo="Pratos" redirect="/admin/cardapio/pratos" />
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

  if (currentPath === '/admin/cardapio/sobremesas/novo') {
    return (
      <AuthProvider>
        <AdminGuard>
          <AdminAddProduto categoriaNome="Sobremesas" titulo="Sobremesas" redirect="/admin/cardapio/sobremesas" />
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

  if (currentPath === '/admin/cardapio/bebidas/novo') {
    return (
      <AuthProvider>
        <AdminGuard>
          <AdminAddProduto categoriaNome="Bebidas" titulo="Bebidas" redirect="/admin/cardapio/bebidas" />
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

  if (currentPath === '/admin/cardapio/vinhos/novo') {
    return (
      <AuthProvider>
        <AdminGuard>
          <AdminAddProduto categoriaNome="Vinhos" titulo="Vinhos" redirect="/admin/cardapio/vinhos" />
        </AdminGuard>
      </AuthProvider>
    )
  }

  if (currentPath === '/admin/categorias') {
    return (
      <AuthProvider>
        <AdminGuard>
          <AdminCategorias />
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
