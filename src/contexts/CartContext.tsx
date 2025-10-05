import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  titulo: string
  preco: number
  preco_promocional?: number
  quantidade: number
  image_url?: string
  observacoes?: string
  acompanhamentos?: { [key: string]: number }
}

interface CartContextType {
  items: CartItem[]
  isInitialized: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Carregar carrinho do localStorage na inicialização
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        localStorage.removeItem('cart')
      }
    }
    setIsInitialized(true)
  }, [])

  // Salvar carrinho no localStorage sempre que items mudar (apenas após inicialização)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id)
      return existingItem
        ? prevItems.map(item =>
            item.id === newItem.id
              ? { ...item, quantidade: item.quantidade + newItem.quantidade }
              : item
          )
        : [...prevItems, newItem]
    })
  }

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantidade: quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('cart')
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantidade, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.preco_promocional || item.preco
      return total + (price * item.quantidade)
    }, 0)
  }

  const value: CartContextType = {
    items,
    isInitialized,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
