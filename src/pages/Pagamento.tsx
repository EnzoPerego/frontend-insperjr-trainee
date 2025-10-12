import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import CheckoutProgress from '../components/CheckoutProgress'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../components/AuthContext'
import { criarPedido } from '../services/pedidoService'
import PixModal from '../components/PixModal'

interface DeliveryInfo {
  endereco?: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    cep: string
    complemento?: string
  }
  metodo: 'delivery' | 'pickup'
  addressIndex?: number | null
}

const Pagamento: React.FC = () => {
  const { items, clearCart, getTotalPrice } = useCart()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState<string>('pix')
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [observacoes, setObservacoes] = useState('')
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })
  const [showPixModal, setShowPixModal] = useState(false)

  useEffect(() => {
    const savedDeliveryInfo = localStorage.getItem('deliveryInfo')
    if (savedDeliveryInfo) {
      setDeliveryInfo(JSON.parse(savedDeliveryInfo))
    }
  }, [])

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method)
  }

  const handleCardDataChange = (field: string, value: string) => {
    let formattedValue = value

    // Formatação automática para o número do cartão
    if (field === 'number') {
      // Remove todos os caracteres não numéricos
      formattedValue = value.replace(/\D/g, '')
      // Adiciona espaços a cada 4 dígitos
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ')
      // Limita a 19 caracteres (16 dígitos + 3 espaços)
      formattedValue = formattedValue.substring(0, 19)
    }

    // Formatação automática para a validade (MM/AA)
    if (field === 'expiry') {
      // Remove todos os caracteres não numéricos
      formattedValue = value.replace(/\D/g, '')
      // Adiciona barra após 2 dígitos
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4)
      }
    }

    // Formatação automática para o CVV (apenas números, máximo 4 dígitos)
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4)
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }))
  }

  const calculateDeliveryFee = () => {
    if (!deliveryInfo) return 0
    return deliveryInfo.metodo === 'delivery' ? 8 : 0
  }

  const calculateTotal = () => {
    return getTotalPrice() + calculateDeliveryFee()
  }

  const validateCardData = () => {
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      if (!cardData.number.trim()) {
        alert('Por favor, preencha o número do cartão')
        return false
      }
      if (!cardData.name.trim()) {
        alert('Por favor, preencha o nome no cartão')
        return false
      }
      if (!cardData.expiry.trim()) {
        alert('Por favor, preencha a validade do cartão')
        return false
      }
      if (!cardData.cvv.trim()) {
        alert('Por favor, preencha o CVV do cartão')
        return false
      }
      
      // Validação básica do formato
      const cardNumber = cardData.number.replace(/\s/g, '')
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        alert('Número do cartão deve ter entre 13 e 19 dígitos')
        return false
      }
      if (cardData.expiry.length !== 5 || !cardData.expiry.includes('/')) {
        alert('Formato de validade inválido (use MM/AA)')
        return false
      }
      if (cardData.cvv.length < 3 || cardData.cvv.length > 4) {
        alert('CVV deve ter entre 3 e 4 dígitos')
        return false
      }
    }
    return true
  }

  const handleFinalizeOrder = async () => {
    if (!user || !deliveryInfo || items.length === 0) {
      alert('Dados incompletos para finalizar o pedido')
      return
    }

    // Validar dados do cartão se necessário
    if (!validateCardData()) {
      return
    }

    // Se for PiX, abrir modal ao inves de finalizar diretamente
    if (paymentMethod === 'pix') {
      setShowPixModal(true)
      return
    }

    setLoading(true)
    try {
      const pedidoData = {
        cliente_id: user.id,
        endereco_index: deliveryInfo.addressIndex || 0,
        itens: items.map(item => ({
          produto_id: item.id,
          quantidade: item.quantidade
        })),
        metodo_pagamento: paymentMethod,
        metodo_entrega: deliveryInfo.metodo,
        observacoes: observacoes,
        taxa_entrega: calculateDeliveryFee(),
        desconto: 0
      }


      const pedido = await criarPedido(pedidoData)
      
      // Limpar carrinho e informações de entrega
      clearCart()
      localStorage.removeItem('deliveryInfo')
      
      // Redirecionar para página de confirmação
      window.location.href = `/pedido-confirmado?id=${pedido.id}`
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao finalizar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handlePixPaymentConfirmed = async () => {
    setShowPixModal(false)
    setLoading(true)
    
    try {
      const pedidoData = {
        cliente_id: user!.id,
        endereco_index: deliveryInfo!.addressIndex || 0,
        itens: items.map(item => ({
          produto_id: item.id,
          quantidade: item.quantidade
        })),
        metodo_pagamento: 'pix',
        observacoes: observacoes,
        taxa_entrega: calculateDeliveryFee(),
        desconto: 0
      }

      const pedido = await criarPedido(pedidoData)
      
      // Limpar carrinho e informações de entrega
      clearCart()
      localStorage.removeItem('deliveryInfo')
      
      // Redirecionar para página de confirmação
      window.location.href = `/pedido-confirmado?id=${pedido.id}`
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao finalizar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
        
          <div className="mb-8">
            <CheckoutProgress currentStep={3} />
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
                <span className="font-medium">Pagamento</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Coluna esquerda - Formas de pagamento */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
              
              {/* metodos de pagamento */}
              <div className="space-y-4 mb-6">
                <h2 className="text-xl font-semibold text-kaiserhaus-dark-brown mb-4">
                  Forma de pagamento
                </h2>

                {/* PIX  */}
                <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pix"
                    checked={paymentMethod === 'pix'}
                    onChange={() => handlePaymentMethodChange('pix')}
                    className="w-4 h-4 text-kaiserhaus-dark-brown border-2 border-kaiserhaus-dark-brown focus:ring-0 focus:ring-offset-0"
                  />
                  <div className="flex items-center space-x-2">
                    {/* icone de pix */}
                    {/* <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">PIX</span>
                    </div> */}
                    <span className="text-kaiserhaus-dark-brown font-medium">PIX</span>
                  </div>
                </label>

                {/* credito opcao */}
                <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    checked={paymentMethod === 'credit'}
                    onChange={() => handlePaymentMethodChange('credit')}
                    className="w-4 h-4 text-kaiserhaus-dark-brown border-2 border-kaiserhaus-dark-brown focus:ring-0 focus:ring-offset-0"
                  />
                  <div className="flex items-center space-x-2">
                    {/* ícone do cartão de crédito  */}
                    {/* <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h16V6H4zm2 2h12v2H6V8zm0 4h8v2H6v-2z"/>
                    </svg> */}
                    <span className="text-kaiserhaus-dark-brown font-medium">Cartão de Crédito</span>
                  </div>
                </label>

                {/* Debitoo */}
                <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="debit"
                    checked={paymentMethod === 'debit'}
                    onChange={() => handlePaymentMethodChange('debit')}
                    className="w-4 h-4 text-kaiserhaus-dark-brown border-2 border-kaiserhaus-dark-brown focus:ring-0 focus:ring-offset-0"
                  />
                  <div className="flex items-center space-x-2">
                    {/* ícone do cartão de débito */}
                    {/* <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h16V6H4zm2 2h12v2H6V8zm0 4h8v2H6v-2z"/>
                    </svg> */}
                    <span className="text-kaiserhaus-dark-brown font-medium">Cartão de Débito</span>
                  </div>
                </label>

                {/* dinheiro */}
                <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => handlePaymentMethodChange('cash')}
                    className="w-4 h-4 text-kaiserhaus-dark-brown border-2 border-kaiserhaus-dark-brown focus:ring-0 focus:ring-offset-0"
                  />
                  <div className="flex items-center space-x-2">
                    {/* ícone do dinheiro  */}
                    {/* <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg> */}
                    <span className="text-kaiserhaus-dark-brown font-medium">Dinheiro</span>
                  </div>
                </label>
              </div>

              {/* Dados do cartão */}
              {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-kaiserhaus-dark-brown mb-4">
                    Dados do cartão
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-kaiserhaus-dark-brown mb-1">
                        Número do cartão
                      </label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => handleCardDataChange('number', e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-kaiserhaus-dark-brown mb-1">
                        Nome no cartão
                      </label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => handleCardDataChange('name', e.target.value)}
                        placeholder="Nome como está no cartão"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-kaiserhaus-dark-brown mb-1">
                          Validade
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => handleCardDataChange('expiry', e.target.value)}
                          placeholder="MM/AA"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-kaiserhaus-dark-brown mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => handleCardDataChange('cvv', e.target.value)}
                          placeholder="000"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>

              {/* Coluna direita - Resumo */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-kaiserhaus-dark-brown mb-5">
                  Resumo do pedido
                </h3>
                
                {/* Itens do pedido */}
                <div className="space-y-3 mb-5">
                  {items.map((item) => {
                    const price = item.preco_promocional || item.preco
                    return (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-sm text-gray-800 font-medium">
                          {item.quantidade}x {item.titulo}
                        </span>
                        <span className="text-sm text-gray-800 font-medium">
                          R$ {(price * item.quantidade).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Totais */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Subtotal:</span>
                    <span className="text-sm text-gray-800 font-medium">
                      R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Taxa de entrega:</span>
                    <span className="text-sm text-gray-800 font-medium">
                      {calculateDeliveryFee() === 0 ? 'Grátis' : `R$ ${calculateDeliveryFee().toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-kaiserhaus-dark-brown">Total:</span>
                      <span className="text-lg font-bold text-kaiserhaus-dark-brown">
                        R$ {calculateTotal().toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Alguma observação especial para o pedido?"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-kaiserhaus-dark-brown transition-all duration-200 resize-none"
                    rows={2}
                  />
                </div>

                {/* Botão finalizar */}
                <button
                  onClick={handleFinalizeOrder}
                  disabled={loading || items.length === 0}
                  className="w-full bg-kaiserhaus-dark-brown text-white py-3 px-6 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? 'FINALIZANDO...' : 'FINALIZAR PEDIDO'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal PIX */}
      <PixModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        valorTotal={calculateTotal()}
        onPaymentConfirmed={handlePixPaymentConfirmed}
      />
    </Layout>
  )
}

export default Pagamento