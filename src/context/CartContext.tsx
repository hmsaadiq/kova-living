'use client'

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { CartItem, Product, SelectedOptions } from '@/lib/types'
import { calculatePrice } from '@/lib/priceCalculator'
import { v4 as uuid } from 'uuid'

// ─── State ───────────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { items: [...state.items, action.payload] }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.id !== action.id) }
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: Math.max(1, action.quantity) } : i
        ),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addToCart: (product: Product, selectedOptions: SelectedOptions, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addToCart = useCallback(
    (product: Product, selectedOptions: SelectedOptions, quantity = 1) => {
      const unitPrice = calculatePrice(product, selectedOptions)
      dispatch({
        type: 'ADD_ITEM',
        payload: { id: uuid(), product, selectedOptions, quantity, unitPrice },
      })
    },
    []
  )

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', id })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items: state.items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
