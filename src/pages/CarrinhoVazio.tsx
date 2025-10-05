import React from 'react'
import Layout from '../components/Layout'
import CheckoutProgress from '../components/CheckoutProgress'
import { useCart } from '../contexts/CartContext'
import carrinhoVazioImg from '../assets/carrinho_vazio.png'

const CarrinhoVazio: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart()

  const handleContinueToCheckout = () => {
    if (items.length === 0) {
      alert('Carrinho vazio')
      return
    }
    window.location.href = '/formas-entrega'
  }

  if (items.length === 0) {
    return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
       
          <div className="mb-8">
            <CheckoutProgress currentStep={1} />
          </div>

       
          <div className="max-w-lg sm:max-w-2xl mx-auto">
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

            <div className="bg-white border border-kaiserhaus-dark-brown rounded-lg p-8 text-center shadow-sm">
              <h1 className="text-2xl font-bold text-kaiserhaus-dark-brown mb-4">
                Seu carrinho está vazio!
              </h1>
              
              <p className="text-kaiserhaus-dark-brown mb-6">
                Para prosseguir, adicione produtos ao carrinho
              </p>
              
            
              <div className="mb-6 flex justify-center">
                <img 
                  src={carrinhoVazioImg} 
                  alt="Carrinho vazio" 
                  className="w-20 h-20 sm:w-24 sm:h-24"
                />
              </div>
              
         
              <button 
                onClick={() => window.location.href = '/#menu'}
                className="w-full bg-white border border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown py-3 px-6 rounded-lg font-medium hover:bg-kaiserhaus-dark-brown hover:text-white transition-colors"
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

  // Carrinho com itens
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          
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

    
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-kaiserhaus-dark-brown mb-6">
                Meu carrinho
              </h1>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const price = item.preco_promocional || item.preco
                  return (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-kaiserhaus-dark-brown">{item.titulo}</h3>
                        <p className="text-sm text-gray-600">
                          R$ {price.toFixed(2).replace('.', ',')} cada
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantidade}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-kaiserhaus-dark-brown">
                          R$ {(price * item.quantidade).toFixed(2).replace('.', ',')}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-kaiserhaus-dark-brown">Total:</span>
                  <span className="text-red-600">
                    R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
              
          
              <div className="flex justify-end">
                <button
                  onClick={handleContinueToCheckout}
                  className="bg-kaiserhaus-dark-brown text-white px-8 py-3 rounded-lg font-medium hover:bg-kaiserhaus-light-brown transition-colors"
                >
                  CONTINUAR COMPRA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CarrinhoVazio

