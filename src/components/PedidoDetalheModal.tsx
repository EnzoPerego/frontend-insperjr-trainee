import React, { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'
import { formatCurrency } from '../lib/utils'

type Props = {
  pedidoId: string | null
  open: boolean
  onClose: () => void
}

export default function PedidoDetalheModal({ pedidoId, open, onClose }: Props): React.JSX.Element | null {
  const [loading, setLoading] = useState<boolean>(false)
  const [erro, setErro] = useState<string | null>(null)
  const [pedido, setPedido] = useState<any | null>(null)

  useEffect(() => {
    if (!open || !pedidoId) return
    const load = async () => {
      setLoading(true)
      setErro(null)
      setPedido(null)
      try {
        const data = await apiFetch<any>(`/pedidos/${pedidoId}`)
        setPedido(data)
      } catch (e: any) {
        setErro(e?.message || 'Erro ao carregar detalhes do pedido')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [open, pedidoId])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Detalhes do Pedido</h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>
        <div className="p-4 space-y-3 max-h-[70vh] overflow-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaiserhaus-dark-brown"></div>
            </div>
          ) : erro ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm">{erro}</div>
          ) : pedido ? (
            <>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Número</p>
                  <p className="font-medium">#{String(pedido.id || '').padStart(4, '0')}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium">{pedido.status}</p>
                </div>
                <div>
                  <p className="text-gray-500">Cliente</p>
                  <p className="font-medium">{pedido?.cliente?.nome || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Criado em</p>
                  <p className="font-medium">{pedido?.created_at ? new Date(pedido.created_at).toLocaleString('pt-BR') : '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Endereço</p>
                  <p className="font-medium">
                    {pedido?.endereco ? `${pedido.endereco.rua}, ${pedido.endereco.numero} - ${pedido.endereco.bairro}, ${pedido.endereco.cidade}` : '-'}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm font-semibold mb-2">Itens</p>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2">Produto</th>
                        <th className="text-left px-3 py-2">Qtd</th>
                        <th className="text-right px-3 py-2">Preço</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(pedido?.itens) && pedido.itens.map((i: any, idx: number) => (
                        <tr key={idx} className="border-t">
                          <td className="px-3 py-2">{i?.produto?.titulo || '-'}</td>
                          <td className="px-3 py-2">{i?.quantidade}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(Number(i?.preco_unitario || 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Subtotal</p>
                  <p className="font-medium">{formatCurrency(Number(pedido?.subtotal || 0))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Taxa de entrega</p>
                  <p className="font-medium">{formatCurrency(Number(pedido?.taxa_entrega || 0))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Desconto</p>
                  <p className="font-medium">{formatCurrency(Number(pedido?.desconto || 0))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-semibold text-kaiserhaus-light-brown">{formatCurrency(Number(pedido?.total || 0))}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-600">Não foi possível carregar os detalhes.</p>
          )}
        </div>
        <div className="px-4 py-3 border-t flex justify-end">
          <button className="px-4 py-2 rounded-md border" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}


