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

function App() {
  // Simulação de roteamento simples - em produção usar React Router
  const currentPath = window.location.pathname
  
  // Rotas do cardápio
  if (currentPath === '/admin/cardapio/entradas') {
    return <Entradas />
  }
  
  if (currentPath === '/admin/cardapio/pratos') {
    return <Pratos />
  }
  
  if (currentPath === '/admin/cardapio/sobremesas') {
    return <Sobremesas />
  }
  
  if (currentPath === '/admin/cardapio/bebidas') {
    return <Bebidas />
  }
  
  if (currentPath === '/admin/cardapio/vinhos') {
    return <Vinhos />
  }
  
  // Rotas de pedidos
  if (currentPath === '/admin/pedidos/pendentes') {
    return <PedidosPendentes />
  }
  
  if (currentPath === '/admin/pedidos/concluidos') {
    return <PedidosConcluidos />
  }
  
  return (
    <Layout>
      <Home />
    </Layout>
  )
}

export default App
