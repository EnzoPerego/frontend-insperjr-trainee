import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Função utilitária para combinar classes do Tailwind (compatível com Shadcn UI)
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Funções utilitárias para a aplicação
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
