import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { config } from "../config"

// Função utilitária para combinar classes do Tailwind (compatível com Shadcn UI)
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Funções utilitárias para a aplicação
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('pt-BR')
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const resolveImageUrl = (path?: string): string => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${config.API_BASE_URL}${path}`
}
