import React from 'react'

interface PixModalProps {
  isOpen: boolean
  onClose: () => void
  valorTotal: number
  onPaymentConfirmed?: () => void
}

const PixModal: React.FC<PixModalProps> = ({ isOpen, onClose, valorTotal, onPaymentConfirmed }) => {
  if (!isOpen) return null

  const formatarValor = (valor: number) => {
    return valor.toFixed(2).replace('.', ',')
  }

  const copiarChavePix = () => {
    const chavePix = "kaiserhaus@restaurante.com.br"
    navigator.clipboard.writeText(chavePix).then(() => {
      alert('Chave PIX copiada para a área de transferência!')
    }).catch(() => {
      alert('Erro ao copiar chave PIX')
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto">
        
        <div className="relative p-4 pb-2">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg font-bold text-kaiserhaus-dark-brown text-center">
            Pagamento PIX
          </h2>
        </div>

        <div className="px-4 pb-4">
          
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-gray-900">
              R$ {formatarValor(valorTotal)}
            </div>
          </div>

          {/* qr codee */}
          <div className="text-center mb-4">
            <div className="inline-block bg-white border border-gray-200 rounded-lg p-3">
              <img
                src="/src/assets/QRcode.png"
                alt="QR Code PIX"
                className="w-36 h-36"
              />
            </div>
            <p className="text-gray-500 text-xs mt-2">Escaneie com seu app bancário</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 font-medium mb-2 text-center text-sm">Ou copie a chave PIX</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-gray-800 font-mono text-xs flex-1 mr-2">
                  kaiserhaus@restaurante.com.br
                </span>
                <button
                  onClick={copiarChavePix}
                  className="bg-kaiserhaus-dark-brown text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-kaiserhaus-light-brown transition-colors"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>

          {/* passo a passo para quem precisa */}
          <div className="bg-orange-50 rounded-lg p-3 mb-4">
            <h3 className="font-semibold text-kaiserhaus-dark-brown mb-2 text-sm">Como pagar</h3>
            <div className="space-y-1 text-xs text-kaiserhaus-dark-brown">
              <div className="flex items-center">
                <span className="bg-kaiserhaus-dark-brown text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
                <span>Abra o app do seu banco</span>
              </div>
              <div className="flex items-center">
                <span className="bg-kaiserhaus-dark-brown text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
                <span>Escaneie o QR Code ou cole a chave</span>
              </div>
              <div className="flex items-center">
                <span className="bg-kaiserhaus-dark-brown text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
                <span>Confirme o pagamento</span>
              </div>
            </div>
          </div>

  
          <div className="flex items-center justify-center mb-4">
            <img
              src="/src/assets/icone_seguranca.png"
              alt="Ícone de segurança"
              className="w-4 h-4 mr-1"
            />
            <span className="text-gray-500 text-xs">
                Assim que o pagamento for identificado, confirmamos seu pedido automaticamente
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                if (onPaymentConfirmed) {
                  onPaymentConfirmed()
                } else {
                  alert('Pagamento confirmado! Aguarde o processamento.')
                  onClose()
                }
              }}
              className="w-full bg-kaiserhaus-dark-brown text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-kaiserhaus-light-brown transition-colors text-sm"
            >
              Já Paguei
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              Cancelar
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PixModal
