import { apiFetch } from '../utils/api'

export interface EnderecoData {
  rua: string
  numero: string
  bairro: string
  cidade: string
  cep: string
  complemento?: string
}

export interface PedidoItemData {
  produto_id: string
  quantidade: number
}

export interface CriarPedidoData {
  cliente_id: string
  endereco_index: number
  itens: PedidoItemData[]
  metodo_pagamento?: string
  observacoes?: string
  taxa_entrega: number
  desconto: number
}

export interface PedidoResponse {
  id: string
  cliente: {
    id: string
    nome: string
  }
  endereco: {
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
  status: string
  data_hora: string
  metodo_pagamento?: string
  observacoes?: string
  subtotal: number
  taxa_entrega: number
  desconto: number
  total: number
  created_at: string
  updated_at: string
}

export async function criarPedido(data: CriarPedidoData): Promise<PedidoResponse> {
  return apiFetch<PedidoResponse>('/pedidos', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function listarPedidos(params?: {
  status_filtro?: string
  cliente_id?: string
}): Promise<PedidoResponse[]> {
  const queryParams = new URLSearchParams()
  if (params?.status_filtro) queryParams.append('status_filtro', params.status_filtro)
  if (params?.cliente_id) queryParams.append('cliente_id', params.cliente_id)
  
  const queryString = queryParams.toString()
  const path = queryString ? `/pedidos?${queryString}` : '/pedidos'
  
  return apiFetch<PedidoResponse[]>(path)
}

export async function buscarPedido(id: string): Promise<PedidoResponse> {
  return apiFetch<PedidoResponse>(`/pedidos/${id}`)
}
