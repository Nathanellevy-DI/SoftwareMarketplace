'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  title: string
  price: string | number
  image_url: string
  qty: number
  variant_id?: string
  variant_name?: string
  original_product_id?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Omit<CartItem, 'qty'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ff-cart')
    if (stored) {
      try { setItems(JSON.parse(stored)) } catch {}
    }
  }, [])

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('ff-cart', JSON.stringify(items))
  }, [items])

  function addItem(product: Omit<CartItem, 'qty'>) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...product, qty: 1 } as CartItem]
    })
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQty(id: string, qty: number) {
    if (qty < 1) return removeItem(id)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + (parseFloat(String(i.price)) * i.qty), 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      totalItems, totalPrice, isOpen, setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
