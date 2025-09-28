// Configuração geral da aplicação
export const config = {
  // URL do backend
  API_BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Outras configurações
  APP_NAME: 'InsperJr Trainee',
  VERSION: '1.0.0',
} as const

// Tipo para a configuração
export type Config = typeof config
