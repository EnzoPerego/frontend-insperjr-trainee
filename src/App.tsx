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
import { CartProvider } from './contexts/CartContext'
import Login from './pages/Login'
import CadastroCliente from './pages/CadastroCliente'
import EsqueciMinhaSenha from './pages/EsqueciMinhaSenha'
import RedefinirSenha from './pages/RedefinirSenha'
import AdminAddProduto from './pages/AdminAddProduto'
import AdminCategorias from './pages/AdminCategorias'
import EditProductForm from './components/EditProductForm'

import Carrinho from './pages/Carrinho'
import FormasEntrega from './pages/FormasEntrega'
import Pagamento from './pages/Pagamento'
import PedidoConfirmado from './pages/PedidoConfirmado'
import MeusPedidos from './pages/MeusPedidos'
import PerfilCliente from './pages/PerfilCliente'
import Cardapio1 from './pages/Cardapio1'
import Busca from './pages/Busca'
import AdminFuncionarios from './pages/AdminFuncionarios'
import AdminAddFuncionario from './pages/AdminAddFuncionario'


function AdminGuard({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { user, isLoading } = useAuth()
  const currentPath: string = window.location.pathname
  const isAdminPath = currentPath.startsWith('/admin')
  
  // Aguardar carregamento do usuário
  if (isLoading) {
    return <div>Carregando...</div>
  }
  
  // Bloqueios de autenticação baseados em role
  if (isAdminPath) {
    // Se não está logado, redireciona para login
    if (!user) {
      window.location.href = '/login'
      return <></>
    }
    
    // Se é cliente, não pode acessar área admin
    if (user.user_type === 'cliente') {
      window.location.href = '/'
      return <></>
    }
    
    // Se é funcionário, só pode acessar pedidos
    if (user.user_type === 'funcionario' && user.role === 'funcionario') {
      const isPedidosPath = currentPath.includes('/admin/pedidos/')
      if (!isPedidosPath) {
        window.location.href = '/admin/pedidos/pendentes'
        return <></>
      }
    }
  }
  
  return <>{children}</>
}

function AppProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  )
}

function App(): React.JSX.Element {
  // Simulação de roteamento simples - em produção usar React Router
  const currentPath: string = window.location.pathname
  
  // Função para renderizar conteúdo baseado na rota
  const renderContent = () => {
    // Rotas do cardápio
    if (currentPath === '/admin/cardapio/entradas') {
      return (
        <AdminGuard>
          <Entradas />
        </AdminGuard>
      )
    }

    if (currentPath === '/admin/cardapio/entradas/novo') {
      return (
        <AdminGuard>
          <AdminAddProduto categoriaNome="Entradas" titulo="Entradas" redirect="/admin/cardapio/entradas" />
        </AdminGuard>
      )
    }
    if (currentPath.startsWith('/admin/cardapio/entradas/editar')) {
      const id = new URLSearchParams(window.location.search).get('id') || ''
      return (
        <AdminGuard>
          <EditProductForm title="Entrada" categoriaNome="Entradas" onSuccessRedirect="/admin/cardapio/entradas" productId={id} />
        </AdminGuard>
      )
    }
  
    if (currentPath === '/admin/cardapio/pratos') {
      return (
        <AdminGuard>
          <Pratos />
        </AdminGuard>
      )
    }

    if (currentPath === '/admin/cardapio/pratos/novo') {
      return (
        <AdminGuard>
          <AdminAddProduto categoriaNome="Pratos" titulo="Pratos" redirect="/admin/cardapio/pratos" />
        </AdminGuard>
      )
    }
    if (currentPath.startsWith('/admin/cardapio/pratos/editar')) {
      const id = new URLSearchParams(window.location.search).get('id') || ''
      return (
        <AdminGuard>
          <EditProductForm title="Prato" categoriaNome="Pratos" onSuccessRedirect="/admin/cardapio/pratos" productId={id} />
        </AdminGuard>
      )
    }
  
    if (currentPath === '/admin/cardapio/sobremesas') {
      return (
        <AdminGuard>
          <Sobremesas />
        </AdminGuard>
      )
    }

    if (currentPath === '/admin/cardapio/sobremesas/novo') {
      return (
        <AdminGuard>
          <AdminAddProduto categoriaNome="Sobremesas" titulo="Sobremesas" redirect="/admin/cardapio/sobremesas" />
        </AdminGuard>
      )
    }
    if (currentPath.startsWith('/admin/cardapio/sobremesas/editar')) {
      const id = new URLSearchParams(window.location.search).get('id') || ''
      return (
        <AdminGuard>
          <EditProductForm title="Sobremesa" categoriaNome="Sobremesas" onSuccessRedirect="/admin/cardapio/sobremesas" productId={id} />
        </AdminGuard>
      )
    }
  
    if (currentPath === '/admin/cardapio/bebidas') {
      return (
        <AdminGuard>
          <Bebidas />
        </AdminGuard>
      )
    }

    if (currentPath === '/admin/cardapio/bebidas/novo') {
      return (
        <AdminGuard>
          <AdminAddProduto categoriaNome="Bebidas" titulo="Bebidas" redirect="/admin/cardapio/bebidas" />
        </AdminGuard>
      )
    }
    if (currentPath.startsWith('/admin/cardapio/bebidas/editar')) {
      const id = new URLSearchParams(window.location.search).get('id') || ''
      return (
        <AdminGuard>
          <EditProductForm title="Bebida" categoriaNome="Bebidas" onSuccessRedirect="/admin/cardapio/bebidas" productId={id} />
        </AdminGuard>
      )
    }
  
    if (currentPath === '/admin/cardapio/vinhos') {
      return (
        <AdminGuard>
          <Vinhos />
        </AdminGuard>
      )
    }

    if (currentPath === '/admin/cardapio/vinhos/novo') {
      return (
        <AdminGuard>
          <AdminAddProduto categoriaNome="Vinhos" titulo="Vinhos" redirect="/admin/cardapio/vinhos" />
        </AdminGuard>
      )
    }
    if (currentPath.startsWith('/admin/cardapio/vinhos/editar')) {
      const id = new URLSearchParams(window.location.search).get('id') || ''
      return (
        <AdminGuard>
          <EditProductForm title="Vinho" categoriaNome="Vinhos" onSuccessRedirect="/admin/cardapio/vinhos" productId={id} />
        </AdminGuard>
      )
    }

    if (currentPath === '/admin/categorias') {
      return (
        <AdminGuard>
          <AdminCategorias />
        </AdminGuard>
      )
    }


    if (currentPath === '/admin/funcionarios') {
      return (
        <AdminGuard>
          <AdminFuncionarios />
        </AdminGuard>
      )
    }

    if (currentPath === '/admin/funcionarios/novo') {
      return (
        <AdminGuard>
          <AdminAddFuncionario />
        </AdminGuard>
      )
    }
  
    // Rotas de pedidos
    if (currentPath === '/admin/pedidos/pendentes') {
      return (
        <AdminGuard>
          <PedidosPendentes />
        </AdminGuard>
      )
    }
    
    if (currentPath === '/admin/pedidos/concluidos') {
      return (
        <AdminGuard>
          <PedidosConcluidos />
        </AdminGuard>
      )
    }
  
    if (currentPath === '/login') {
      return <Login />
    }

    if (currentPath === '/cadastro') {
      return <CadastroCliente />
    }

    if (currentPath === '/esqueci-minha-senha') {
      return <EsqueciMinhaSenha />
    }

    if (currentPath === '/redefinir-senha') {
      return <RedefinirSenha />
    }

    // Rota do cardápio
    if (currentPath === '/cardapio') {
      return <Cardapio1 />
    }

    // Rota de busca
    if (currentPath === '/busca') {
      return <Busca />
    }

    // Rotas do carrinho
    if (currentPath === '/carrinho') {
      return <Carrinho />
    }

    if (currentPath === '/formas-entrega') {
      return <FormasEntrega />
    }

    if (currentPath === '/pagamento') {
      return <Pagamento />
    }

    if (currentPath === '/pedido-confirmado') {
      return <PedidoConfirmado />
    }

    if (currentPath === '/meus-pedidos') {
      return <MeusPedidos />
    }

    if (currentPath === '/perfil') {
      return <PerfilCliente />
    }

    // Página padrão (Home)
    return (
      <Layout>
        <Home />
      </Layout>
    )
  }

  // Renderizar tudo dentro dos providers
  return (
    <AppProviders>
      {renderContent()}
    </AppProviders>
  )
}

export default App
