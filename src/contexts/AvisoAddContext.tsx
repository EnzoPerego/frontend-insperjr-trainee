import React, { createContext, useContext, useState } from 'react'
import AvisoAdd from '../components/AvisoAdd'

interface AvisoAddContextType {
  mostrarAviso: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void
}

const AvisoAddContext = createContext<AvisoAddContextType | undefined>(undefined)

export const AvisoAddProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'success' | 'error' | 'info'>('success')
  const [duration, setDuration] = useState(2500)

  const mostrarAviso = (msg: string, avisoType: 'success' | 'error' | 'info' = 'success', avisoDuration: number = 2500) => {
    setMessage(msg)
    setType(avisoType)
    setDuration(avisoDuration)
    setIsVisible(true)
  }

  return (
    <AvisoAddContext.Provider value={{ mostrarAviso }}>
      {children}
      <AvisoAdd
        message={message}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        type={type}
        duration={duration}
      />
    </AvisoAddContext.Provider>
  )
}

export const useAvisoAdd = () => {
  const context = useContext(AvisoAddContext)
  if (!context) {
    throw new Error('useAvisoAdd must be used within a AvisoAddProvider')
  }
  return context
}

