import React from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'
import './styles/globals.css'

function App() {
  // Simulação de roteamento simples - em produção usar React Router
  const currentPath = window.location.pathname
  
  if (currentPath === '/admin') {
    return <Admin />
  }
  
  return (
    <Layout>
      <Home />
    </Layout>
  )
}

export default App
