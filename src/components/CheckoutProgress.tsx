import React from 'react'
import { cn } from '../lib/utils'

interface CheckoutProgressProps {
  currentStep: number
  className?: string
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep, className = '' }) => {
  const steps = [
    { number: 1, label: 'Carrinho' },
    { number: 2, label: 'Recebimento' },
    { number: 3, label: 'Pagamento' }
  ]

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* circulo das etapas */}
          <div className="flex flex-col items-center">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-colors font-montserrat',
              currentStep >= step.number
                ? 'bg-[#F8F1DE] text-kaiserhaus-dark-brown border border-kaiserhaus-dark-brown'
                : 'border border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown bg-white'
            )}>
              {step.number}
            </div>
            
            {/* Nome da etapa abaixo do círculo */}
            <div className="mt-2">
              <span className={cn(
                'text-sm font-normal font-montserrat',
                currentStep >= step.number
                  ? 'text-kaiserhaus-dark-brown'
                  : 'text-kaiserhaus-dark-brown'
              )}>
                {step.label}
              </span>
            </div>
          </div>
          
          {/* Linha conectora */}
          {index < steps.length - 1 && (
            <div className="w-8 h-px bg-kaiserhaus-dark-brown mx-4"></div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CheckoutProgress

