import { apiFetch } from '../utils/api'

export interface EnderecoData {
  id?: string
  rua: string
  numero: string
  bairro: string
  cidade: string
  cep: string
  complemento?: string
}

export interface ClienteData {
  nome: string
  email: string
  senha?: string
  telefone?: string
  enderecos?: EnderecoData[]
}

export interface ClienteResponse {
  id: string
  nome: string
  email: string
  telefone?: string
  enderecos: EnderecoData[]
  created_at: string
  updated_at: string
}

export async function buscarCliente(id: string): Promise<ClienteResponse> {
  return apiFetch<ClienteResponse>(`/clientes/${id}`)
}

export async function atualizarCliente(id: string, data: Partial<ClienteData>): Promise<ClienteResponse> {
  return apiFetch<ClienteResponse>(`/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export async function adicionarEndereco(clienteId: string, endereco: EnderecoData): Promise<ClienteResponse> {
  return apiFetch<ClienteResponse>(`/clientes/${clienteId}/enderecos`, {
    method: 'POST',
    body: JSON.stringify(endereco)
  })
}

// funcao para conseguir deletar o endereco, que ja existe noo back, entao chamei a rota do metodo delete
export async function removerEndereco(clienteId: string, enderecoId: string): Promise<ClienteResponse> {
  await apiFetch(`/clientes/${clienteId}/enderecos/${enderecoId}`, {
    method: 'DELETE'
  })
  // Retornar os dados atualizados do cliente
  return buscarCliente(clienteId)
}
