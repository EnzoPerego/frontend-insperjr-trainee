import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'

import { useAvisoAdd } from '../contexts/AvisoAddContext'

import { resolveImageUrl } from '../lib/utils'


interface Acompanhamento {
  nome: string
  preco: number
}

interface Produto {
  id: string
  titulo: string
  descricao_capa?: string
  descricao_geral?: string
  image_url?: string
  preco: number
  preco_promocional?: number
  acompanhamentos?: Acompanhamento[]
}

interface ProductModalProps {
  produto: Produto
  isOpen: boolean
  onClose: () => void
}

const ProductModal: React.FC<ProductModalProps> = ({ produto, isOpen, onClose }) => {
  const { addItem } = useCart()
  const { mostrarAviso } = useAvisoAdd()
  const [quantidade, setQuantidade] = useState(1)
  const [acompanhamentosSelecionados, setAcompanhamentosSelecionados] = useState<{ [key: string]: number }>({})
  const [observacoes, setObservacoes] = useState('')

  if (!isOpen) return null

  const handleAcompanhamentoChange = (nome: string, quantidade: number) => {
    if (quantidade === 0) {
      const novos = { ...acompanhamentosSelecionados }
      delete novos[nome]
      setAcompanhamentosSelecionados(novos)
    } else {
      setAcompanhamentosSelecionados(prev => ({
        ...prev,
        [nome]: quantidade
      }))
    }
  }

  const handleAdicionarAoCarrinho = () => {
    // Calcular preço total com acompanhamentos
    const precoBase = produto.preco_promocional || produto.preco
    let precoTotal = precoBase * quantidade

    // Adicionar preço dos acompanhamentos
    Object.entries(acompanhamentosSelecionados).forEach(([nome, qtd]) => {
      const acompanhamento = produto.acompanhamentos?.find(acomp => acomp.nome === nome)
      if (acompanhamento) {
        precoTotal += acompanhamento.preco * qtd
      }
    })

    // Criar item para o carrinho
    const itemParaCarrinho = {
      id: produto.id,
      titulo: produto.titulo,
      preco: precoTotal / quantidade, // Preço unitário total (produto + acompanhamentos)
      preco_promocional: produto.preco_promocional,
      image_url: produto.image_url,
      quantidade: quantidade,
      observacoes: observacoes,
      acompanhamentos: acompanhamentosSelecionados
    }

    addItem(itemParaCarrinho)
    
    // Fechar modal e resetar
    onClose()
    setQuantidade(1)
    setAcompanhamentosSelecionados({})
    setObservacoes('')
    
    // Mostrar aviso
    mostrarAviso('Produto adicionado ao carrinho!', 'success', 2500)
  }

  const preco = produto.preco_promocional || produto.preco

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]">
          {/* Imagem  */}
          <div className="w-full md:w-1/2 p-4 md:p-6 flex items-center">
            {produto.image_url ? (
              <img
                src={resolveImageUrl(produto.image_url)}
                alt={produto.titulo}
                className="w-full h-full max-h-[300px] md:max-h-[500px] object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full max-h-[300px] md:max-h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Sem imagem</span>
              </div>
            )}
          </div>

          {/* Conteudoo */}
          <div className="w-full md:w-1/2 p-4 md:p-6">
            {/* Nome e preço do Produto */}
            <div className="mb-4 md:mb-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">{produto.titulo}</h2>
                    <span className="text-xl font-montserrat font-light text-kaiserhaus-dark-brown">
                      {Math.floor(preco)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold ml-4"
                >
                  ×
                </button>
              </div>
            </div>

            {/* ddescrição */}
            {(produto.descricao_capa || produto.descricao_geral) && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {produto.descricao_capa || produto.descricao_geral}
                </p>
              </div>
            )}

            {/* acompanhamentos */}
            {produto.acompanhamentos && produto.acompanhamentos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Incluir ao pedido</h3>
                <div className="space-y-3">
                  {produto.acompanhamentos.map((acompanhamento, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1 flex items-center gap-2">
                      <span className="font-medium text-gray-900">{acompanhamento.nome}</span>
                      <span className="text-gray-900 font-montserrat font-light">
                        {Math.floor(acompanhamento.preco)}
                      </span>
                    </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAcompanhamentoChange(
                            acompanhamento.nome, 
                            (acompanhamentosSelecionados[acompanhamento.nome] || 0) - 1
                          )}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          disabled={(acompanhamentosSelecionados[acompanhamento.nome] || 0) <= 0}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">
                          {acompanhamentosSelecionados[acompanhamento.nome] || 0}
                        </span>
                        <button
                          onClick={() => handleAcompanhamentoChange(
                            acompanhamento.nome, 
                            (acompanhamentosSelecionados[acompanhamento.nome] || 0) + 1
                          )}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* observacoes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações:
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Alguma observação especial?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-kaiserhaus-dark-brown resize-none"
                rows={3}
              />
            </div>

            {/* qntd e botão adicionar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Quantidade:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{quantidade}</span>
                  <button
                    onClick={() => setQuantidade(quantidade + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAdicionarAoCarrinho}
                className="bg-kaiserhaus-dark-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors"
              >
                ADICIONAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
