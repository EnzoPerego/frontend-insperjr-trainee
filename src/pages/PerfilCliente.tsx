import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../components/AuthContext'
import { apiFetch } from '../utils/api'
import { buscarCliente, atualizarCliente, removerEndereco, adicionarEndereco, atualizarEndereco, ClienteResponse, EnderecoData } from '../services/clienteService'

interface Pedido {
  id: string
  status: string
  total: number
  created_at: string
  metodo_pagamento?: string
}

const PerfilCliente: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()
  const [cliente, setCliente] = useState<ClienteResponse | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'perfil' | 'pedidos' | 'enderecos'>('perfil')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    nome: '',
    email: '',
    telefone: ''
  })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [newAddress, setNewAddress] = useState<EnderecoData>({
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    cep: '',
    complemento: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return
      
      if (!user) {
        setError('Usuário não logado')
        setLoading(false)
        return
      }

      try {
        const clienteData = await buscarCliente(user.id)
        setCliente(clienteData)
        setEditForm({
          nome: clienteData.nome,
          email: clienteData.email,
          telefone: clienteData.telefone || ''
        })

        // buscar pedidos do cliente
        const pedidosResponse = await apiFetch(`/pedidos?cliente_id=${user.id}`)
        if (Array.isArray(pedidosResponse)) {
          setPedidos(pedidosResponse)
        } else {
          setPedidos([])
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err)
        setError(`Erro ao carregar dados: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, authLoading])

  const handleSaveProfile = async () => {
    if (!user || !cliente) return

    try {
      const updatedCliente = await atualizarCliente(user.id, {
        nome: editForm.nome,
        email: editForm.email,
        telefone: editForm.telefone
      })
      setCliente(updatedCliente)
      setIsEditing(false)
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err)
      setError('Erro ao atualizar perfil')
    }
  }

  const handleRemoveAddress = async (enderecoId: string) => {
    if (!user || !cliente) return

    if (!confirm('Tem certeza que deseja excluir este endereço?')) {
      return
    }

    try {
      const updatedCliente = await removerEndereco(user.id, enderecoId)
      setCliente(updatedCliente)
    } catch (err) {
      console.error('Erro ao remover endereço:', err)
      setError('Erro ao remover endereço')
    }
  }

  const handleAddAddress = async () => {
    if (!user) return

    if (!newAddress.rua || !newAddress.numero || !newAddress.bairro || !newAddress.cidade || !newAddress.cep) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      const updatedCliente = await adicionarEndereco(user.id, newAddress)
      setCliente(updatedCliente)
      setShowAddressForm(false)
      setNewAddress({
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        cep: '',
        complemento: ''
      })
    } catch (err) {
      console.error('Erro ao adicionar endereço:', err)
      setError('Erro ao adicionar endereço')
    }
  }

  const handleEditAddress = (endereco: EnderecoData) => {
    setEditingAddressId(endereco.id || null)
    setNewAddress({
      rua: endereco.rua,
      numero: endereco.numero,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      cep: endereco.cep,
      complemento: endereco.complemento || ''
    })
    setShowAddressForm(true)
  }

  const handleUpdateAddress = async () => {
    if (!user || !editingAddressId) return

    if (!newAddress.rua || !newAddress.numero || !newAddress.bairro || !newAddress.cidade || !newAddress.cep) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      const updatedCliente = await atualizarEndereco(user.id, editingAddressId, newAddress)
      setCliente(updatedCliente)
      setShowAddressForm(false)
      setEditingAddressId(null)
      setNewAddress({
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        cep: '',
        complemento: ''
      })
    } catch (err) {
      console.error('Erro ao atualizar endereço:', err)
      setError('Erro ao atualizar endereço')
    }
  }

  const handleCancelEdit = () => {
    setShowAddressForm(false)
    setEditingAddressId(null)
    setNewAddress({
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      cep: '',
      complemento: ''
    })
  }

  const getStatusColor = (status: string) => {
    const statusColors = {
      'Pendente': 'text-yellow-600 bg-yellow-100',
      'Em preparo': 'text-blue-600 bg-blue-100',
      'Pronto': 'text-purple-600 bg-purple-100',
      'Saiu para entrega': 'text-orange-600 bg-orange-100',
      'Entregue': 'text-green-600 bg-green-100',
      'Cancelado': 'text-red-600 bg-red-100'
    }
    return statusColors[status as keyof typeof statusColors] || 'text-gray-600 bg-gray-100'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const brazilTime = new Date(date.getTime() - (3 * 60 * 60 * 1000))
    
    return brazilTime.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    })
  }

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kaiserhaus-dark-brown mx-auto mb-4"></div>
            <p className="text-kaiserhaus-dark-brown">
              {authLoading ? 'Verificando login...' : 'Carregando perfil...'}
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso restrito</h1>
            <p className="text-gray-600 mb-6">Você precisa estar logado para acessar seu perfil</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-kaiserhaus-dark-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar perfil</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-kaiserhaus-dark-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
  
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-kaiserhaus-dark-brown mb-2">
              Meu Perfil
            </h1>
            <p className="text-gray-600">
              Gerencie suas informações pessoais e acompanhe seus pedidos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 px-4 sm:px-6">
                <button
                  onClick={() => setActiveTab('perfil')}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'perfil'
                      ? 'border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Informações Pessoais
                </button>
                <button
                  onClick={() => setActiveTab('pedidos')}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pedidos'
                      ? 'border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Meus Pedidos ({pedidos.length})
                </button>
                <button
                  onClick={() => setActiveTab('enderecos')}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'enderecos'
                      ? 'border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Endereços ({cliente?.enderecos.length || 0})
                </button>
              </nav>
            </div>

            <div className="p-6">
             
              {activeTab === 'perfil' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Informações Pessoais
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full sm:w-auto bg-kaiserhaus-dark-brown text-white px-4 py-2 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
                      >
                        Editar
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome
                        </label>
                        <input
                          type="text"
                          value={editForm.nome}
                          onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={editForm.telefone}
                          onChange={(e) => setEditForm({ ...editForm, telefone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                          placeholder="(11) 99999-9999"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleSaveProfile}
                          className="w-full sm:w-auto bg-kaiserhaus-dark-brown text-white px-4 py-2 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false)
                            setEditForm({
                              nome: cliente?.nome || '',
                              email: cliente?.email || '',
                              telefone: cliente?.telefone || ''
                            })
                          }}
                          className="w-full sm:w-auto bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome
                        </label>
                        <p className="text-gray-900">{cliente?.nome}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <p className="text-gray-900">{cliente?.email}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone
                        </label>
                        <p className="text-gray-900">{cliente?.telefone || 'Não informado'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cliente desde
                        </label>
                        <p className="text-gray-900">
                          {cliente?.created_at ? formatDate(cliente.created_at) : 'Não informado'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* parte de meus pedidos, coloquei no meu perfil mas vou perguntar se preferem deixar fora */}
              {activeTab === 'pedidos' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Meus Pedidos
                    </h2>
                    <p className="text-gray-600">
                      Acompanhe o status de todos os seus pedidos
                    </p>
                  </div>

                  {pedidos.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mb-6">
                        <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                      <p className="text-gray-600 mb-6">Você ainda não fez nenhum pedido</p>
                      <button
                        onClick={() => window.location.href = '/cardapio'}
                        className="bg-kaiserhaus-dark-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
                      >
                        Ver Cardápio
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pedidos.map((pedido) => (
                        <div key={pedido.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Pedido #{pedido.id.slice(-8)}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                                  {pedido.status}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Data:</span>
                                  <p>{formatDate(pedido.created_at)}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Total:</span>
                                  <p className="font-semibold text-kaiserhaus-dark-brown">
                                    R$ {pedido.total.toFixed(2).replace('.', ',')}
                                  </p>
                                </div>
                                {pedido.metodo_pagamento && (
                                  <div>
                                    <span className="font-medium">Pagamento:</span>
                                    <p className="capitalize">
                                      {pedido.metodo_pagamento === 'cash' ? 'Dinheiro' : 
                                       pedido.metodo_pagamento === 'credit' ? 'Cartão de Crédito' :
                                       pedido.metodo_pagamento === 'debit' ? 'Cartão de Débito' :
                                       pedido.metodo_pagamento === 'pix' ? 'PIX' :
                                       pedido.metodo_pagamento}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="ml-6">
                              <button
                                onClick={() => window.location.href = `/pedido-confirmado?id=${pedido.id}`}
                                className="bg-kaiserhaus-dark-brown text-white px-4 py-2 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
                              >
                                Ver Detalhes
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* parte dos enderecos */}
              {activeTab === 'enderecos' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Meus Endereços
                    </h2>
                    <p className="text-gray-600">
                      Gerencie seus endereços de entrega
                    </p>
                  </div>

                  {!showAddressForm && (
                    <>
                      {cliente?.enderecos.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="mb-6">
                            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum endereço cadastrado</h3>
                          <p className="text-gray-600 mb-6">Adicione endereços para facilitar suas entregas</p>
                          <button
                            onClick={() => setShowAddressForm(true)}
                            className="bg-kaiserhaus-dark-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
                          >
                            Adicionar Endereço
                          </button>
                        </div>
                      ) : (
                    <div className="space-y-4">
                      {cliente?.enderecos.map((endereco, index) => (
                        <div key={endereco.id || index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-kaiserhaus-dark-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Endereço {index + 1}
                                </h3>
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600">
                                <p className="font-medium">
                                  {endereco.rua}, {endereco.numero}
                                </p>
                                <p>
                                  {endereco.bairro} - {endereco.cidade}
                                </p>
                                <p>CEP: {endereco.cep}</p>
                                {endereco.complemento && (
                                  <p className="text-gray-500">
                                    Complemento: {endereco.complemento}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="ml-6 flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => handleEditAddress(endereco)}
                                className="bg-kaiserhaus-dark-brown text-white px-4 py-2 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                              </button>
                              <button
                                onClick={() => endereco.id && handleRemoveAddress(endereco.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Excluir
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="bg-kaiserhaus-dark-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
                        >
                          Adicionar Novo Endereço
                        </button>
                      </div>
                    </div>
                      )}
                    </>
                  )}

                  {/* parte de possibilitar add um endereco */}
                  {showAddressForm && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingAddressId ? 'Editar Endereço' : 'Adicionar Novo Endereço'}
                        </h3>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
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
                        
                        <div className="sm:col-span-2">
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
                      
                      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
                        <button
                          onClick={handleCancelEdit}
                          className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={editingAddressId ? handleUpdateAddress : handleAddAddress}
                          className="w-full sm:w-auto bg-kaiserhaus-dark-brown text-white px-6 py-2 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
                        >
                          {editingAddressId ? 'Atualizar Endereço' : 'Salvar Endereço'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PerfilCliente

