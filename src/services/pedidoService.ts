import { apiFetch } from '../utils/api'

export interface PedidoData {
  id: string
  status: string
  total: number
  metodo_pagamento?: string
  observacoes?: string
  created_at?: string
  cliente?: {
    nome: string
  }
  endereco?: {
    rua: string
    numero: string
    bairro: string
    cidade: string
  }
  itens: Array<{
    produto: {
      id: string
      titulo: string
    }
    quantidade: number
    preco_unitario: number
  }>
}

export interface CriarPedidoData {
  cliente_id: string
  endereco_index: number
  itens: Array<{
    produto_id: string
    quantidade: number
  }>
  metodo_pagamento?: string
  observacoes?: string
  taxa_entrega: number
  desconto: number
}

export interface PedidoResponse {
  id: string
  status: string
  total: number
  created_at: string
}

export const criarPedido = async (data: CriarPedidoData): Promise<PedidoResponse> => {
  try {
    const response = await apiFetch('/pedidos', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response as PedidoResponse
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    throw error
  }
}

export const buscarPedido = async (pedidoId: string): Promise<PedidoData> => {
  try {
    const response = await apiFetch(`/pedidos/${pedidoId}`)
    return response as PedidoData
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    throw error
  }
}

export const buscarHistoricoPedido = async (pedidoId: string) => {
  try {
    const response = await apiFetch(`/pedidos/${pedidoId}/historico`)
    return response
  } catch (error) {
    console.error('Erro ao buscar histórico do pedido:', error)
    throw error
  }
}