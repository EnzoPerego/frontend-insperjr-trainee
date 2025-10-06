import React from 'react'
import Layout from '../components/Layout'
import CheckoutProgress from '../components/CheckoutProgress'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../components/AuthContext'
import { formatCurrency } from '../lib/utils'
import carrinhoVazio from '../assets/carrinho_vazio.png'

const Carrinho: React.FC = () => {
  const { items, isInitialized, updateQuantity, getTotalPrice } = useCart()
  const { user } = useAuth()
  
  // Aguardar inicialização do carrinho
  if (!isInitialized) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kaiserhaus-dark-brown mx-auto mb-4"></div>
            <p className="text-kaiserhaus-dark-brown">Carregando carrinho...</p>
          </div>
        </div>
      </Layout>
    )
  }

  const handleContinueToCheckout = () => {
    if (items.length === 0) {
      alert('Carrinho vazio')
      return
    }
    
    // Verificar se o usuário está logado
    if (!user) {
      // Salvar a intenção de checkout para redirecionar após login
      localStorage.setItem('checkoutIntent', '/formas-entrega')
      window.location.href = '/login'
      return
    }
    
    // Se logado, ir direto para formas de entrega
    window.location.href = '/formas-entrega'
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-8">
            {/* indicar progresso */}
            <div className="mb-8">
              <CheckoutProgress currentStep={1} />
            </div>

            <div className="mb-6">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center text-kaiserhaus-dark-brown hover:text-kaiserhaus-light-brown transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Meu carrinho</span>
              </button>
            </div>

         
            <div className="max-w-6xl mx-auto">
              <div className="bg-white border border-kaiserhaus-dark-brown rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-kaiserhaus-dark-brown mb-4">
                  Seu carrinho está vazio!
                </h1>
                
                <p className="text-kaiserhaus-dark-brown mb-6">
                  Para prosseguir, adicione produtos ao carrinho
                </p>
                
             
                <div className="mb-6 flex justify-center">
                  <img 
                    src={carrinhoVazio} 
                    alt="Carrinho vazio" 
                    className="w-24 h-24"
                  />
                </div>
                
            
                <button 
                  onClick={() => window.location.href = '/cardapio'}
                  className="mx-auto bg-white border border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown font-bold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  NOSSO CARDÁPIO
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // Carrinho com produtos 
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
         
          <div className="mb-8">
            <CheckoutProgress currentStep={1} />
          </div>

       
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center text-kaiserhaus-dark-brown hover:text-kaiserhaus-light-brown transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Meu carrinho</span>
              </button>
            </div>
    
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-kaiserhaus-dark-brown mb-8">
                Meu carrinho
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {items.map((item) => {
                      const price = item.preco_promocional || item.preco
                      return (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              {item.image_url ? (
                                <img 
                                  src={item.image_url} 
                                  alt={item.titulo}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-kaiserhaus-dark-brown mb-1 truncate">
                                {item.titulo}
                              </h3>
                              <p className="text-lg font-bold text-kaiserhaus-dark-brown">
                                {formatCurrency(price)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantidade}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-kaiserhaus-dark-brown">
                                {formatCurrency(price * item.quantidade)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                
                  <div className="mt-8">
                    <button
                      onClick={() => window.location.href = '/#menu'}
                      className="w-full border-2 border-kaiserhaus-light-brown text-kaiserhaus-dark-brown py-3 px-6 rounded-lg font-medium hover:bg-kaiserhaus-light-brown hover:text-white transition-colors"
                    >
                      ADICIONAR MAIS ITENS
                    </button>
                  </div>
                </div>

             
                <div className="lg:col-span-1">
                  <div className="bg-kaiserhaus-light-brown/20 rounded-lg p-6">
                  

              
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-kaiserhaus-dark-brown font-medium">Subtotal:</span>
                        <span className="text-kaiserhaus-dark-brown font-semibold">
                          {formatCurrency(getTotalPrice())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-kaiserhaus-dark-brown font-medium">Taxa de entrega:</span>
                        <span className="text-kaiserhaus-dark-brown font-semibold">A definir</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-kaiserhaus-dark-brown">TOTAL:</span>
                        <span className="text-lg font-bold text-kaiserhaus-dark-brown">
                          {formatCurrency(getTotalPrice())}
                        </span>
                      </div>
                    </div>

                
                    <button
                      onClick={handleContinueToCheckout}
                      className="w-full bg-kaiserhaus-dark-brown text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-kaiserhaus-light-brown transition-colors"
                    >
                      CONTINUAR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Carrinho
