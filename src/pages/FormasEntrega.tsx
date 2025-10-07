import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import CheckoutProgress from '../components/CheckoutProgress'
import { useAuth } from '../components/AuthContext'
import { useCart } from '../contexts/CartContext'
import { buscarCliente, adicionarEndereco, EnderecoData } from '../services/clienteService'
import { formatCurrency } from '../lib/utils'

const FormasEntrega: React.FC = () => {
  const { user } = useAuth()
  const { getTotalPrice } = useCart()
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('delivery')
  const [addresses, setAddresses] = useState<EnderecoData[]>([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState<EnderecoData>({
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    cep: '',
    complemento: ''
  })
  const [loading, setLoading] = useState(true)

  // Carregar endereços do cliente
  useEffect(() => {
    const loadClientData = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const clienteData = await buscarCliente(user.id)
        setAddresses(clienteData.enderecos || [])
        if (clienteData.enderecos && clienteData.enderecos.length > 0) {
          setSelectedAddressIndex(0)
        }
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error)
      } finally {
        setLoading(false)
      }
    }

    loadClientData()
  }, [user?.id])

  const handleDeliveryMethodChange = (method: 'pickup' | 'delivery') => {
    setDeliveryMethod(method)
    setShowAddressForm(false)
  }

  const handleAddressChange = () => {
    setShowAddressForm(true)
  }

  const handleAddNewAddress = async () => {
    if (!user?.id) {
      alert('Usuário não logado')
      return
    }

    // Validar campos obrigatórios
    if (!newAddress.rua || !newAddress.numero || !newAddress.bairro || !newAddress.cidade || !newAddress.cep) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      const clienteData = await adicionarEndereco(user.id, newAddress)
      setAddresses(clienteData.enderecos || [])
      setSelectedAddressIndex(clienteData.enderecos.length - 1)
      setShowAddressForm(false)
      setNewAddress({
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        cep: '',
        complemento: ''
      })
      alert('Endereço adicionado com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar endereço:', error)
      alert('Erro ao adicionar endereço. Tente novamente.')
    }
  }

  const handleContinueToPayment = () => {
    if (deliveryMethod === 'delivery' && addresses.length === 0) {
      alert('Por favor, adicione um endereço de entrega')
      return
    }
    
    // Salvar informações na sessão/localStorage para usar na página de pagamento
    const deliveryInfo = {
      method: deliveryMethod,
      addressIndex: deliveryMethod === 'delivery' ? selectedAddressIndex : null
    }
    localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo))
    
    // Redirecionar para página de pagamento
    window.location.href = '/pagamento'
  }

  const formatAddress = (address: EnderecoData) => {
    return `${address.rua}, ${address.numero} - ${address.bairro}, ${address.cidade}`
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
         
          <div className="mb-8">
            <CheckoutProgress currentStep={2} />
          </div>

       
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          
              <div className="mb-4">
                <button 
                  onClick={() => window.history.back()}
                  className="flex items-center text-kaiserhaus-dark-brown hover:text-kaiserhaus-light-brown transition-colors group"
                >
                  <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium">Formas de entrega</span>
                </button>
              </div>

        
              <div className="space-y-3 mb-6">
                <h2 className="text-xl font-semibold text-kaiserhaus-dark-brown mb-3">
                  Escolha a forma de entrega
                </h2>
           
                <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => handleDeliveryMethodChange('pickup')}
                    className="w-4 h-4 text-kaiserhaus-dark-brown border-2 border-kaiserhaus-dark-brown focus:ring-0 focus:ring-offset-0"
                  />
                  <div className="flex-1">
                    <span className="text-gray-800 font-medium">
                      Retirada no restaurante
                    </span>
                    <p className="text-sm text-gray-600 mt-0.5">Você retira o pedido no local</p>
                  </div>
                </label>

             
                <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="delivery"
                    checked={deliveryMethod === 'delivery'}
                    onChange={() => handleDeliveryMethodChange('delivery')}
                    className="w-4 h-4 text-kaiserhaus-dark-brown border-2 border-kaiserhaus-dark-brown focus:ring-0 focus:ring-offset-0"
                  />
                  <div className="flex-1">
                    <span className="text-gray-800 font-medium">
                      Entregar no endereço
                    </span>
                    <p className="text-sm text-gray-600 mt-0.5">Taxa de entrega: R$ 8,00</p>
                  </div>
                </label>
              </div>

        
              {deliveryMethod === 'delivery' && (
                <div className="mb-6">
                  {loading ? (
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <span className="text-kaiserhaus-dark-brown">Carregando endereços...</span>
                    </div>
                  ) : !showAddressForm ? (
                    <div className="space-y-4">
                      {addresses.length > 0 ? (
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-kaiserhaus-dark-brown">
                            Endereços disponíveis:
                          </h3>
                          {addresses.map((address, index) => (
                            <label key={index} className="flex items-start space-x-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-kaiserhaus-dark-brown transition-all">
                              <input
                                type="radio"
                                name="selectedAddress"
                                value={index}
                                checked={selectedAddressIndex === index}
                                onChange={() => setSelectedAddressIndex(index)}
                                className="mt-1 w-4 h-4 text-kaiserhaus-dark-brown border-2 border-kaiserhaus-dark-brown focus:ring-0 focus:ring-offset-0"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <svg className="w-4 h-4 text-kaiserhaus-dark-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="text-gray-800 font-medium text-sm">
                                    {formatAddress(address)}
                                  </span>
                                </div>
                                {address.complemento && (
                                  <p className="text-xs text-gray-600 ml-6 mb-0.5">{address.complemento}</p>
                                )}
                                <p className="text-xs text-gray-600 ml-6">CEP: {address.cep}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-kaiserhaus-dark-brown mb-2">Nenhum endereço cadastrado</p>
                          <p className="text-sm text-gray-600">Adicione um endereço para continuar</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={handleAddressChange}
                          className="text-kaiserhaus-dark-brown hover:text-kaiserhaus-light-brown font-medium border-b border-transparent hover:border-kaiserhaus-dark-brown transition-all text-sm"
                        >
                          {addresses.length > 0 ? 'Adicionar novo endereço' : 'Adicionar endereço'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-kaiserhaus-dark-brown">
                        Adicionar novo endereço
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rua *
                          </label>
                          <input
                            type="text"
                            value={newAddress.rua}
                            onChange={(e) => setNewAddress({...newAddress, rua: e.target.value})}
                            placeholder="Nome da rua"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número *
                          </label>
                          <input
                            type="text"
                            value={newAddress.numero}
                            onChange={(e) => setNewAddress({...newAddress, numero: e.target.value})}
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CEP *
                          </label>
                          <input
                            type="text"
                            value={newAddress.cep}
                            onChange={(e) => setNewAddress({...newAddress, cep: e.target.value})}
                            placeholder="00000-000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bairro *
                          </label>
                          <input
                            type="text"
                            value={newAddress.bairro}
                            onChange={(e) => setNewAddress({...newAddress, bairro: e.target.value})}
                            placeholder="Nome do bairro"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cidade *
                          </label>
                          <input
                            type="text"
                            value={newAddress.cidade}
                            onChange={(e) => setNewAddress({...newAddress, cidade: e.target.value})}
                            placeholder="Nome da cidade"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complemento
                          </label>
                          <input
                            type="text"
                            value={newAddress.complemento || ''}
                            onChange={(e) => setNewAddress({...newAddress, complemento: e.target.value})}
                            placeholder="Apartamento, bloco, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-3">
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="text-gray-600 hover:text-gray-800 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleAddNewAddress}
                          className="bg-kaiserhaus-dark-brown text-white px-5 py-2 rounded-lg font-medium hover:bg-kaiserhaus-light-brown transition-colors shadow-md hover:shadow-lg"
                        >
                          Salvar endereço
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Total com Delivery */}
              <div className="mb-6">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-kaiserhaus-dark-brown mb-3">
                    Resumo do pedido
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Subtotal dos produtos:</span>
                      <span className="text-sm text-gray-800 font-medium">{formatCurrency(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Taxa de entrega:</span>
                      <span className="text-sm text-gray-800 font-medium">
                        {deliveryMethod === 'delivery' ? 'R$ 8,00' : 'Grátis'}
                      </span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-kaiserhaus-dark-brown">Total com a entrega:</span>
                      <span className="text-lg font-bold text-kaiserhaus-dark-brown">
                        {formatCurrency(getTotalPrice() + (deliveryMethod === 'delivery' ? 8 : 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            
              <div className="flex justify-end">
                <button
                  onClick={handleContinueToPayment}
                  className="bg-kaiserhaus-dark-brown text-white px-6 py-2 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors shadow-md hover:shadow-lg"
                >
                  IR PARA O PAGAMENTO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FormasEntrega

